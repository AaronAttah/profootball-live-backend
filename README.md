# ProFootball Live Backend

Real-time football match center backend featuring live event streaming, match simulation, and room-based chat.

## Overview

ProFootball Live provides a robust API for football enthusiasts to track live matches, receive real-time goal updates, and interact with other fans in match-specific chat rooms. The system includes a background simulator that brings fantasy matches to life with realistic event distributions.

## Tech Stack

- **Server**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Sequelize
- **Real-time**: Socket.io & Server-Sent Events (SSE)
- **Validation**: Zod
- **Match Simulation**: Event-driven background service

## Architecture Decisions

1. **Modular Design**: The codebase is organized by modules (`user`, `matches`, `chat`) to ensure scalability and maintainability.
2. **Event-Driven Simulation**: A centralized `EventBus` facilitates communication between the match simulator and the real-time transmission layer (WebSockets/SSE).
3. **Dual Real-time Strategy**: 
    - **WebSockets (Socket.io)**: Used for bidirectional communication like chat, typing indicators, and room management.
    - **SSE (Server-Sent Events)**: Offered as a lightweight alternative for unidirectional match event streaming.
4. **Clean Code Utilities**: Enforced HTTP status code enums for consistent API responses.
5. **Database Dynamics**:
    - **Development/Staging**: The app uses `sequelize.sync()` to automatically create and update tables based on models, enabling rapid iteration.
    - **Production**: When `NODE_ENV` is set to `production`, the automatic sync is disabled. The system is designed to trigger migrations (via `npm run db:migrate`) as part of the deployment pipeline to ensure data integrity and schema versioning.

## Future Improvements / Known Limitations
- Implement advanced Redis-based rate limiting for high-traffic scenarios.
- Add comprehensive unit and integration tests for match event broadcasting.
- Expand match simulation to include VAR reviews and injury time.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL (Supabase recommended)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```env
   PORT=3001
   DATABASE_URL=your_supabase_url
   JWT_SECRET=your_secret
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

## API Documentation

### REST Endpoints
- `GET /api/v1/matches`: List all live/upcoming matches.
- `GET /api/v1/matches/:id`: Get detailed match information (inc. events and stats).
- `GET /api/v1/matches/:id/events/stream`: SSE endpoint for live match updates.
- `GET /api/v1/matches/:id/messages`: this endpoint fetches all messages.
- `GET /api/v1/matches/socket/info`: this endpoint fetches all socket info which helps in propmting/sending requests to the socket server.

## Socket.io Real-Time Connection Guide

### Connection Setup

**WebSocket URL**: 
- Local: `ws://localhost:3000`
- Production: `wss://your-app.onrender.com`

**Authentication**: The SocketService middleware accepts JWT tokens in multiple formats:
- `socket.handshake.auth.token` (✅ Recommended)
- `Authorization: Bearer <token>` header
- Custom `token` header
- Custom `bearer` header

---

### WebSocket Events
- `join_match`: Join a match-specific room (`matchId`).
- `leave_match`: Leave a match room.
- `send_message`: Send a chat message.
- `typing_start`/`typing_stop`: Chat interaction indicators.
- e.t.c


### JavaScript/TypeScript Example

```javascript
import { io } from 'socket.io-client';

// Connect with authentication
const socket = io('ws://localhost:3000', {
  auth: {
    token: 'YOUR_JWT_TOKEN_HERE'
  }
});

// Connection events
socket.on('connect', () => {
  console.log('✅ Connected to ProFootball Live!');
  
  // Join a match room to receive updates
  socket.emit('join_match', { matchId: 'match-uuid-here' });
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection failed:', error.message);
});

// Listen for live match updates
socket.on('match_status_update', (data) => {
  console.log('⚽ Score update:', data.homeTeam, data.homeScore, '-', data.awayScore, data.awayTeam);
});

socket.on('new_match_event', (event) => {
  console.log('🎯 Match event:', event.type, event.team, event.playerMain);
});

socket.on('match_stats_update', (stats) => {
  console.log('📊 Stats:', stats.homePossession + '% possession');
});

// Chat functionality
socket.on('new_message', (message) => {
  console.log(`💬 ${message.senderName}: ${message.content}`);
});

socket.on('user_count_update', (data) => {
  console.log(`👥 ${data.count} fans watching this match`);
});

socket.on('user_typing', (data) => {
  if (data.isTyping) {
    console.log(`✍️ User ${data.userId} is typing...`);
  }
});

// Send a chat message
function sendMessage(matchId, content) {
  socket.emit('send_message', {
    matchId: matchId,
    content: content
  });
}

// Typing indicators
function startTyping(matchId) {
  socket.emit('typing_start', { matchId });
}

function stopTyping(matchId) {
  socket.emit('typing_stop', { matchId });
}

// Leave a match room
function leaveMatch(matchId) {
  socket.emit('leave_match', { matchId });
}
```

---


### Event Reference

#### 📤 Client → Server (Emit)

| Event | Payload | Description | Rate Limit |
|-------|---------|-------------|------------|
| `join_match` | `{ matchId: string }` | Subscribe to match room for live updates and chat | None |
| `leave_match` | `{ matchId: string }` | Unsubscribe from match room | None |
| `send_message` | `{ matchId: string, content: string }` | Send a chat message (max 500 chars) | 1 msg/sec |
| `typing_start` | `{ matchId: string }` | Show typing indicator to other users | None |
| `typing_stop` | `{ matchId: string }` | Hide typing indicator | None |

#### 📥 Server → Client (Listen)

| Event | Payload Example | When Triggered |
|-------|----------------|----------------|
| `match_status_update` | `{ id, homeTeam, awayTeam, homeScore, awayScore, minute, status }` | Score changes, time updates, status changes |
| `new_match_event` | `{ type: 'GOAL', team: 'Arsenal', playerMain: 'Saka', minute: 23 }` | Goals, cards, substitutions, fouls, shots |
| `match_stats_update` | `{ matchId, homePossession: 55, homeShots: 12, ... }` | Live statistics updates |
| `new_message` | `{ id, senderId, senderName, content, timestamp }` | New chat message in the room |
| `user_count_update` | `{ matchId, count: 247 }` | User joins/leaves the match room |
| `user_typing` | `{ userId, matchId, isTyping: true }` | Someone starts/stops typing (auto-clears after 3s) |
| `error` | `{ message: 'Rate limit exceeded' }` | Validation errors, rate limiting |

---

### Common Use Cases

#### 1. **Watch a Live Match**
```javascript
socket.emit('join_match', { matchId: 'abc-123' });

socket.on('match_status_update', (data) => {
  updateScoreboard(data);
});

socket.on('new_match_event', (event) => {
  if (event.type === 'GOAL') {
    showGoalAnimation(event);
  }
});
```

#### 2. **Chat with Other Fans**
```javascript
// Load chat history first (REST API)
fetch('/api/v1/matches/abc-123/messages')
  .then(res => res.json())
  .then(data => displayMessages(data.data));

// Then listen for new messages
socket.on('new_message', (msg) => {
  appendMessage(msg);
});

// Send messages
sendButton.onclick = () => {
  socket.emit('send_message', {
    matchId: 'abc-123',
    content: messageInput.value
  });
};
```

#### 3. **Typing Indicators**
```javascript
let typingTimeout;

messageInput.addEventListener('input', () => {
  socket.emit('typing_start', { matchId: 'abc-123' });
  
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit('typing_stop', { matchId: 'abc-123' });
  }, 1000);
});
```

---

### Error Handling

```javascript
socket.on('error', (error) => {
  switch(error.message) {
    case 'Rate limit exceeded. Please wait.':
      showNotification('Slow down! Wait a second between messages.');
      break;
    case 'Message cannot be empty':
      showNotification('Please enter a message.');
      break;
    case 'Message too long (max 500 characters)':
      showNotification('Message is too long!');
      break;
    default:
      console.error('Socket error:', error.message);
  }
});
```

---

### Testing with Postman
**Note**: Socket.io requests cannot be published to public Postman documentation, that is why I am using this README for sharing connection details. 

1. Create a new **Socket.io Request** in Postman
2. Set URL to `ws://localhost:3000` or `wss://gloryradio-server-staging.onrender.com/api/v1` (note that its hosted on a free tier platform which can make the server for every 15mins inactivity to sleep)
3. In **Handshake** tab, add:
   - Key: `token`
   - Value: `<your-jwt-token>`
4. Click **Connect**
5. Use the **Events** tab to emit and listen for events



---

### Postman HTTP API Documentation
For REST endpoints (auth, matches, messages): https://documenter.getpostman.com/view/16602053/2sBXVk9obV 
 


## Author
 - Name: Ojima Aaron Attah
 - Email: aoahorizon@gmail.com

