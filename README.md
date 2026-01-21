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

### WebSocket Events
- `join_match`: Join a match-specific room (`matchId`).
- `leave_match`: Leave a match room.
- `send_message`: Send a chat message.
- `typing_start`/`typing_stop`: Chat interaction indicators.
- e.t.c

### WebSocket Authentication
The  SocketService middleware is made  flexible. It now checks for the token in all of these locations, so anywhere its passed will work:

- Handshake Auth: socket.handshake.auth.token (Recommended)
- Authorization Header: Authorization: Bearer <token>
- Direct Token Header: token: <token>
- Direct Bearer Header: bearer: <token> 


#### postman DOCUMENTATION for both HTTP and SOCKET.IO(rooms and chats)
 https://documenter.getpostman.com/view/16602053/2sBXVk9obV 
 





## Author
 - Name: Ojima Aaron Attah
 - Email: aoahorizon@gmail.com

