import { Request, Response } from 'express';
import { MatchRepository } from '../repository/match.repository';
import { ok, sendError } from '../../../utils/response';
import { HttpStatus } from '../../../utils/status-codes';
import { matchEvents, MATCH_UPDATED, NEW_EVENT, STATS_UPDATED } from '../../../shared/eventBus';

const matchRepo = new MatchRepository();

export const getAllMatches = async (req: Request, res: Response) => {
  try {
    const matches = await matchRepo.findAll();
    return ok(res, matches);
  } catch (error: any) {
    return sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const getMatchById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const match = await matchRepo.findById(id);
    if (!match) {
      return sendError(res, HttpStatus.NOT_FOUND, 'Match not found');
    }
    return ok(res, match);
  } catch (error: any) {
    return sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const streamMatchEvents = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const match = await matchRepo.findById(id);
  if (!match) {
    return sendError(res, HttpStatus.NOT_FOUND, 'Match not found');
  }

  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const onUpdate = (data: any) => {
    if (data.id === id || data.matchId === id) {
      res.write(`data: ${JSON.stringify({ type: 'update', data })}\n\n`);
    }
  };

  const onEvent = (data: any) => {
    if (data.matchId === id) {
      res.write(`data: ${JSON.stringify({ type: 'event', data })}\n\n`);
    }
  };

  const onStats = (data: any) => {
    if (data.matchId === id) {
      res.write(`data: ${JSON.stringify({ type: 'stats', data })}\n\n`);
    }
  };

  matchEvents.on(MATCH_UPDATED, onUpdate);
  matchEvents.on(NEW_EVENT, onEvent);
  matchEvents.on(STATS_UPDATED, onStats);

  // Send initial state
  res.write(`data: ${JSON.stringify({ type: 'init', data: match })}\n\n`);

  req.on('close', () => {
    matchEvents.off(MATCH_UPDATED, onUpdate);
    matchEvents.off(NEW_EVENT, onEvent);
    matchEvents.off(STATS_UPDATED, onStats);
    res.end();
  });
};

export const getMatchMessages = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    
    // Check if match exists
    const match = await matchRepo.findById(id);
    if (!match) {
      return sendError(res, HttpStatus.NOT_FOUND, 'Match not found');
    }

    const messages = await matchRepo.getMessages(id, limit);
    return ok(res, messages);
  } catch (error: any) {
    return sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};
