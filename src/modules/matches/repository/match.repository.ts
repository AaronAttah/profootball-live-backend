import { Match } from '../model/match.model';
import { MatchEvent } from '../model/matchEvent.model';
import { MatchStats } from '../model/matchStats.model';
import { ChatMessage } from '../model/chatMessage.model';

export class MatchRepository {
  async findAll() {
    return Match.findAll({
      attributes: ['id', 'homeTeam', 'awayTeam', 'homeScore', 'awayScore', 'minute', 'status'],
      order: [['startTime', 'DESC']],
    });
  }

  async findById(id: string) {
    return Match.findByPk(id, {
      include: [
        { model: MatchEvent, as: 'events', order: [['minute', 'ASC']] },
        { model: MatchStats, as: 'stats' },
      ],
    });
  }

  async update(id: string, data: any) {
    const match = await Match.findByPk(id);
    if (!match) return null;
    return match.update(data);
  }

  async createEvent(data: any) {
    return MatchEvent.create(data);
  }

  async updateStats(matchId: string, data: any) {
    const stats = await MatchStats.findOne({ where: { matchId } });
    if (!stats) return MatchStats.create({ matchId, ...data });
    return stats.update(data);
  }

  async getMessages(matchId: string, limit: number = 50) {
    return ChatMessage.findAll({
      where: { matchId },
      order: [['createdAt', 'DESC']],
      limit: limit,
    });
  }
}
