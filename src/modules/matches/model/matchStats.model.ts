import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database';

export class MatchStats extends Model {
  public id!: string;
  public matchId!: string;
  public homeShots!: number;
  public awayShots!: number;
  public homeShotsOnTarget!: number;
  public awayShotsOnTarget!: number;
  public homePossession!: number;
  public awayPossession!: number;
  public homeCorners!: number;
  public awayCorners!: number;
  public homeFouls!: number;
  public awayFouls!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MatchStats.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    matchId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },
    homeShots: { type: DataTypes.INTEGER, defaultValue: 0 },
    awayShots: { type: DataTypes.INTEGER, defaultValue: 0 },
    homeShotsOnTarget: { type: DataTypes.INTEGER, defaultValue: 0 },
    awayShotsOnTarget: { type: DataTypes.INTEGER, defaultValue: 0 },
    homePossession: { type: DataTypes.INTEGER, defaultValue: 50 },
    awayPossession: { type: DataTypes.INTEGER, defaultValue: 50 },
    homeCorners: { type: DataTypes.INTEGER, defaultValue: 0 },
    awayCorners: { type: DataTypes.INTEGER, defaultValue: 0 },
    homeFouls: { type: DataTypes.INTEGER, defaultValue: 0 },
    awayFouls: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    sequelize,
    tableName: 'match_stats',
  }
);
