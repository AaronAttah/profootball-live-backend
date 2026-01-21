import { User } from '../modules/user/model/user.model';
import { UserProfile } from '../modules/user/model/userProfile.model';
import { UserOtp } from '../modules/user/model/userOtp.model';
import { Match } from '../modules/matches/model/match.model';
import { MatchEvent } from '../modules/matches/model/matchEvent.model';
import { MatchStats } from '../modules/matches/model/matchStats.model';
import { ChatMessage } from '../modules/matches/model/chatMessage.model';

// User ↔ UserProfile (1—1)
User.hasOne(UserProfile, { foreignKey: 'userId', as: 'profile', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
UserProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User ↔ UserOtp (1—*)
User.hasMany(UserOtp, { foreignKey: 'userId', as: 'otps', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
UserOtp.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Match ↔ MatchEvent (1—*)
Match.hasMany(MatchEvent, { foreignKey: 'matchId', as: 'events', onDelete: 'CASCADE' });
MatchEvent.belongsTo(Match, { foreignKey: 'matchId', as: 'match' });

// Match ↔ MatchStats (1—1)
Match.hasOne(MatchStats, { foreignKey: 'matchId', as: 'stats', onDelete: 'CASCADE' });
MatchStats.belongsTo(Match, { foreignKey: 'matchId', as: 'match' });

// Match ↔ ChatMessage (1—*)
Match.hasMany(ChatMessage, { foreignKey: 'matchId', as: 'messages', onDelete: 'CASCADE' });
ChatMessage.belongsTo(Match, { foreignKey: 'matchId', as: 'match' });

// User ↔ ChatMessage (1—*)
User.hasMany(ChatMessage, { foreignKey: 'userId', as: 'messages', onDelete: 'CASCADE' });
ChatMessage.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { User, UserProfile, UserOtp, Match, MatchEvent, MatchStats, ChatMessage };

