import { config } from 'dotenv';
config();

import { createServer } from 'http';
import app from './app';
import { sequelize } from './config/database';
import './models/index';
import { SocketService } from './socket/socket.service';
import { MatchSimulator } from './simulator/matchSimulator';

const port = Number(process.env.PORT || 3001);

async function bootstrap() {
  try {
    console.log('Connecting to PostgreSQL database...');
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync();
      console.log('✅ Models synchronized (development mode)');
    }

    // Start Simulator
    const simulator = new MatchSimulator();
    await simulator.seedInitialMatches();
    console.log('✅ Match Simulator started');

    // Create HTTP server and setup Socket.io
    const server = createServer(app);
    const socketService = new SocketService(server);
    
    server.listen(port, () => {
      console.log(`🚀 ProFootball Live Backend running on http://localhost:${port}`);
      console.log(`🔌 WebSocket server ready for real-time communication`);
    });
  } catch (error: any) {
    console.error('❌ Failed to start application');
    console.error('Error:', error?.message || error);
    process.exit(1);
  }
}

bootstrap();



