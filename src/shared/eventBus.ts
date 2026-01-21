import { EventEmitter } from 'events';

class MatchEventEmitter extends EventEmitter {}

export const matchEvents = new MatchEventEmitter();

export const MATCH_UPDATED = 'MATCH_UPDATED';
export const NEW_EVENT = 'NEW_EVENT';
export const STATS_UPDATED = 'STATS_UPDATED';
