import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../../../config/database';

export class Follow extends Model<InferAttributes<Follow>, InferCreationAttributes<Follow, { omit: 'id' }>> {
  declare id: string;
  declare followerId: string;
  declare followingId: string;
}

Follow.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    followerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    followingId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'follows',
    modelName: 'Follow',
    indexes: [
      { unique: true, fields: ['followerId', 'followingId'] },
    ],
  }
);

// Associations are defined centrally in src/models/associations.ts

