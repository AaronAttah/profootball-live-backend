import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database';

export enum MatchStatus {
  NOT_STARTED = 'NOT_STARTED',
  FIRST_HALF = 'FIRST_HALF',
  HALF_TIME = 'HALF_TIME',
  SECOND_HALF = 'SECOND_HALF',
  FULL_TIME = 'FULL_TIME',
}

export class Match extends Model {
  public id!: string;
  public homeTeam!: string;
  public awayTeam!: string;
  public homeScore!: number;
  public awayScore!: number;
  public minute!: number;
  public status!: MatchStatus;
  public startTime!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Match.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    homeTeam: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    awayTeam: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    homeScore: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    awayScore: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    minute: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(MatchStatus)),
      defaultValue: MatchStatus.NOT_STARTED,
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'matches',
  }
);
