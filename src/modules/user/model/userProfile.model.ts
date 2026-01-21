import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../../../config/database';

export class UserProfile extends Model<InferAttributes<UserProfile>, InferCreationAttributes<UserProfile, { omit: 'id' }>> {
  declare id: string;
  declare userId: string;
  declare displayName: string | null;
  declare bio: string | null;
  declare avatarUrl: string | null;
  declare coverUrl: string | null;
  declare notificationPrefs: Record<string, unknown>;
}

UserProfile.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    coverUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notificationPrefs: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
  },
  {
    sequelize,
    tableName: 'user_profiles',
    modelName: 'UserProfile',
    indexes: [
      { unique: true, fields: ['userId'] },
    ],
  }
);

// Associations are defined centrally in src/models/associations.ts

