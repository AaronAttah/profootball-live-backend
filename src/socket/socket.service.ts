import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import { matchEvents, MATCH_UPDATED, NEW_EVENT, STATS_UPDATED } from '../shared/eventBus';
import { ChatMessage } from '../modules/matches/model/chatMessage.model';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

export class SocketService {
  private io: SocketIOServer;
  private connectedUsers: Map<string, string> = new Map(); // userId -> socketId
  private roomListeners: Map<string, Set<string>> = new Map(); // matchId -> Set of userIds
  private userLastMessageTime: Map<string, number> = new Map(); // userId -> timestamp
  private typingTimeouts: Map<string, NodeJS.Timeout> = new Map(); // userId-matchId -> timeout

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "*",
        methods: ["GET", "POST"]
      }
    });

    this.setupMiddleware();
    this.setupEventHandlers();
    this.setupExternalEventListeners();
  }

  private setupMiddleware() {
    this.io.use((socket: AuthenticatedSocket, next) => {
      // 1. Check auth object (Standard Socket.io way)
      // 2. Check Authorization header
      // 3. Check direct headers sometimes used by clients/Postman
      const token = 
        socket.handshake.auth?.token || 
        socket.handshake.headers.authorization?.split(' ')[1] ||
        socket.handshake.headers.token ||
        socket.handshake.headers.bearer;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      try {
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string) as any;
        socket.userId = decoded.user;
        socket.userRole = decoded.role;
        (socket as any).firstName = decoded.firstName || null;
        next();
      } catch (err) {
        console.error('[Socket Auth Error]', err );
        next(new Error('Authentication error: Invalid token'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      console.log(`User ${socket.userId} connected`);
      
      if (socket.userId) {
        this.connectedUsers.set(socket.userId, socket.id);
      }

      // Join Match Room
      socket.on('join_match', (data: { matchId: string }) => {
        const { matchId } = data;
        
        socket.join(`match:${matchId}`);
        
        if (!this.roomListeners.has(matchId)) {
          this.roomListeners.set(matchId, new Set());
        }
        this.roomListeners.get(matchId)!.add(socket.userId!);
        
        this.broadcastUserCount(matchId);
        console.log(`User ${socket.userId} joined match ${matchId}`);
      });

      socket.on('leave_match', (data: { matchId: string }) => {
        const { matchId } = data;
        socket.leave(`match:${matchId}`);
        
        if (this.roomListeners.has(matchId)) {
          this.roomListeners.get(matchId)!.delete(socket.userId!);
          this.broadcastUserCount(matchId);
        }
        console.log(`User ${socket.userId} left match ${matchId}`);
      });

      // Chat Events
      socket.on('send_message', async (data: { 
        matchId: string;
        content: string; 
      }) => {
        try {
          const userId = socket.userId!;
          
          // Basic Rate Limiting (1 message every 1 second)
          const now = Date.now();
          const lastTime = this.userLastMessageTime.get(userId) || 0;
          if (now - lastTime < 1000) {
            return socket.emit('error', { message: 'Rate limit exceeded. Please wait.' });
          }

          // Validation
          if (!data.content || data.content.trim() === '') {
            return socket.emit('error', { message: 'Message cannot be empty' });
          }
          if (data.content.length > 500) {
            return socket.emit('error', { message: 'Message too long (max 500 characters)' });
          }

          const senderName = (socket as any).firstName || `User ${userId.slice(0, 4)}`;
          
          // Persistence
          const message = await ChatMessage.create({
            matchId: data.matchId,
            userId: userId,
            senderName,
            content: data.content
          });

          this.userLastMessageTime.set(userId, now);

          this.io.to(`match:${data.matchId}`).emit('new_message', {
            id: message.id,
            senderId: userId,
            senderName: senderName,
            matchId: data.matchId,
            content: data.content,
            timestamp: message.createdAt
          });
        } catch (error) {
          console.error('[Chat Error]', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      socket.on('typing_start', (data: { matchId: string }) => {
        const key = `${socket.userId}-${data.matchId}`;
        
        // Clear existing timeout
        if (this.typingTimeouts.has(key)) {
          clearTimeout(this.typingTimeouts.get(key));
        }

        socket.to(`match:${data.matchId}`).emit('user_typing', {
          userId: socket.userId,
          matchId: data.matchId,
          isTyping: true
        });

        // Auto-stop after 3 seconds
        const timeout = setTimeout(() => {
          this.typingTimeouts.delete(key);
          this.io.to(`match:${data.matchId}`).emit('user_typing', {
            userId: socket.userId,
            matchId: data.matchId,
            isTyping: false
          });
        }, 3000);
        
        this.typingTimeouts.set(key, timeout);
      });

      socket.on('typing_stop', (data: { matchId: string }) => {
        const key = `${socket.userId}-${data.matchId}`;
        if (this.typingTimeouts.has(key)) {
          clearTimeout(this.typingTimeouts.get(key));
          this.typingTimeouts.delete(key);
        }

        socket.to(`match:${data.matchId}`).emit('user_typing', {
          userId: socket.userId,
          matchId: data.matchId,
          isTyping: false
        });
      });

      socket.on('disconnect', () => {
        if (socket.userId) {
          this.connectedUsers.delete(socket.userId);
          this.roomListeners.forEach((listeners, matchId) => {
            if (listeners.has(socket.userId!)) {
              listeners.delete(socket.userId!);
              this.broadcastUserCount(matchId);
            }
          });
        }
      });
    });
  }

  private setupExternalEventListeners() {
    matchEvents.on(MATCH_UPDATED, (data) => {
      this.io.to(`match:${data.id}`).emit('match_status_update', data);
    });

    matchEvents.on(NEW_EVENT, (data) => {
      this.io.to(`match:${data.matchId}`).emit('new_match_event', data);
    });

    matchEvents.on(STATS_UPDATED, (data) => {
      this.io.to(`match:${data.matchId}`).emit('match_stats_update', data);
    });
  }

  private broadcastUserCount(matchId: string) {
    const count = this.roomListeners.get(matchId)?.size || 0;
    this.io.to(`match:${matchId}`).emit('user_count_update', {
      matchId,
      count
    });
  }

  public notifyUser(userId: string, event: string, data: any) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }
}
