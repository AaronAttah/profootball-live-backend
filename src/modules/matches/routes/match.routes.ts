import { Router } from 'express';
import { getAllMatches, getMatchById, streamMatchEvents, getMatchMessages } from '../controller/match.controller';
import { validateParams, idParamSchema } from '../validation/match.validation';
import { authJWT } from '../../../middleware/auth';

const router = Router();

router.get('/', getAllMatches);

router.get('/socket/info', authJWT, (req, res) => {
  res.json({
    socketUrl: process.env.SOCKET_URL || `http://localhost:${process.env.PORT || 3001}`,
    events: {
      // Room Management
      join_match: 'Join a specific match room for live updates and chat',
      leave_match: 'Leave a match room',
      user_count_update: 'Server broadcast of current match room listeners',
      
      // Live Data
      match_status_update: 'Live score and time updates',
      new_match_event: 'Live match events (Goals, Cards, Subs)',
      match_stats_update: 'Live statistics updates',

      // Chat
      send_message: 'Send a message to the match chat',
      new_message: 'Receive new chat message',
      typing_start: 'Notify others you are typing',
      typing_stop: 'Notify others you stopped typing',
      user_typing: 'Server broadcast: someone is typing'
    },
    authentication: {
      method: 'JWT token in socket.handshake.auth.token OR Authorization header',
      description: 'Include the Bearer token when connecting'
    }
  });
});

router.get('/:id', validateParams(idParamSchema), getMatchById);
router.get('/:id/events/stream', validateParams(idParamSchema), streamMatchEvents);
router.get('/:id/messages', validateParams(idParamSchema), getMatchMessages);

export const matchRouter = router;
