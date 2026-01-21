import { Match, MatchStatus } from '../modules/matches/model/match.model';
import { MatchEvent, EventType } from '../modules/matches/model/matchEvent.model';
import { MatchStats } from '../modules/matches/model/matchStats.model';
import { matchEvents, MATCH_UPDATED, NEW_EVENT, STATS_UPDATED } from '../shared/eventBus';

export class MatchSimulator {
  private activeMatches: Map<string, any> = new Map();

  constructor() {
    this.startSimulation();
  }

  private async startSimulation() {
    // Periodically update all active matches
    // 1 real second = 1 match minute
    setInterval(async () => {
      const matches = await Match.findAll({
        where: {
          status: [MatchStatus.FIRST_HALF, MatchStatus.SECOND_HALF, MatchStatus.HALF_TIME]
        }
      });

      for (const match of matches) {
        await this.simulateMatchStep(match);
      }
    }, 1000); 
  }

  private async simulateMatchStep(match: Match) {
    if (match.status === MatchStatus.HALF_TIME) {
      // Half time lasts for 15 "minutes" (seconds)
      (match as any).htCounter = ((match as any).htCounter || 0) + 1;
      if ((match as any).htCounter >= 15) {
        match.status = MatchStatus.SECOND_HALF;
        match.minute = 46;
        await match.save();
        matchEvents.emit(MATCH_UPDATED, match.toJSON());
      }
      return;
    }

    // Increment minute
    match.minute += 1;
    
    // Check for transitions
    if (match.minute === 45 && match.status === MatchStatus.FIRST_HALF) {
      match.status = MatchStatus.HALF_TIME;
    } else if (match.minute >= 90 && match.status === MatchStatus.SECOND_HALF) {
      match.status = MatchStatus.FULL_TIME;
    }

    await match.save();
    matchEvents.emit(MATCH_UPDATED, match.toJSON());

    // Random Event Generation
    // Average 90 minutes. 
    // Goals: 2.5/90 = ~0.027 per min
    // Fouls: Every 2-3 mins = ~0.4 per min
    // Shots: Every 3-5 mins = ~0.25 per min
    const rand = Math.random();
    
    if (rand < 0.03) await this.generateEvent(match, EventType.GOAL);
    else if (rand < 0.10) await this.generateEvent(match, EventType.SHOT);
    else if (rand < 0.25) await this.generateEvent(match, EventType.FOUL);
    else if (rand < 0.28) await this.generateEvent(match, EventType.YELLOW_CARD);
    else if (rand < 0.281) await this.generateEvent(match, EventType.RED_CARD); // Extremely rare
    else if (match.minute > 60 && rand < 0.32) await this.generateEvent(match, EventType.SUBSTITUTION);
  }

  private async generateEvent(match: Match, type: EventType) {
    const team = Math.random() > 0.5 ? match.homeTeam : match.awayTeam;

    const eventData: any = {
      matchId: match.id,
      type,
      minute: match.minute,
      team,
      playerMain: 'Player ' + Math.floor(Math.random() * 22),
    };

    if (type === EventType.GOAL) {
      if (team === match.homeTeam) match.homeScore += 1;
      else match.awayScore += 1;
      await match.save();
      matchEvents.emit(MATCH_UPDATED, match.toJSON());
    }

    const event = await MatchEvent.create(eventData);
    matchEvents.emit(NEW_EVENT, event.toJSON());

    await this.updateStats(match, type, team);
  }

  private async updateStats(match: Match, type: EventType, team: string) {
    const stats = await MatchStats.findOne({ where: { matchId: match.id } });
    if (!stats) return;

    if (type === EventType.SHOT) {
      if (team === match.homeTeam) stats.homeShots += 1;
      else stats.awayShots += 1;
    } else if (type === EventType.FOUL) {
      if (team === match.homeTeam) stats.homeFouls += 1;
      else stats.awayFouls += 1;
    }

    await stats.save();
    matchEvents.emit(STATS_UPDATED, stats.toJSON());
  }

  public async seedInitialMatches() {
    const count = await Match.count();
    if (count > 0) return;

    const matches = [
      { homeTeam: 'Arsenal', awayTeam: 'Chelsea', startTime: new Date(), status: MatchStatus.FIRST_HALF, minute: 10 },
      { homeTeam: 'Real Madrid', awayTeam: 'Barcelona', startTime: new Date(), status: MatchStatus.NOT_STARTED, minute: 0 },
      { homeTeam: 'Man City', awayTeam: 'Liverpool', startTime: new Date(), status: MatchStatus.SECOND_HALF, minute: 65 },
    ];

    for (const m of matches) {
      const match = await Match.create(m);
      await MatchStats.create({ matchId: match.id });
    }
  }
}
