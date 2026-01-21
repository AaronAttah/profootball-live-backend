/* Sequelize doesn't know models exists When sequelize.sync() runs for developmenet environment, from the index.ts file(entryapp) where its implemented , 
it only syncs models that have been imported and initialized.  So we decided to import all models here just for development purpose
and once we want to switch to production we ensure that what we now run is the migrations, by disabling the sequelize.sync using the NODE_ENV enviromemnt check (production only)
*/
export { User } from '../modules/user/model/user.model';
export { UserOtp } from '../modules/user/model/userOtp.model';
export { UserProfile } from '../modules/user/model/userProfile.model';
export { Match } from '../modules/matches/model/match.model';
export { MatchEvent } from '../modules/matches/model/matchEvent.model';
export { MatchStats } from '../modules/matches/model/matchStats.model';
export { ChatMessage } from '../modules/matches/model/chatMessage.model';

import './associations';