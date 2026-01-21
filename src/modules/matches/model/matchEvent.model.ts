import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database';

export enum EventType {
  GOAL = 'GOAL',
  YELLOW_CARD = 'YELLOW_CARD',
  RED_CARD = 'RED_CARD',
  SUBSTITUTION = 'SUBSTITUTION',
  FOUL = 'FOUL',
  SHOT = 'SHOT',
}

export class MatchEvent extends Model {
  public id!: string;
  public matchId!: string;
  public type!: EventType;
  public minute!: number;
  public team!: string;
  public playerMain!: string;
  public playerSub!: string | null;
  public detail!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MatchEvent.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    matchId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(EventType)),
      allowNull: false,
    },
    minute: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    team: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    playerMain: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    playerSub: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    detail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'match_events',
  }
);
