import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../../../config/database';

export class UserOtp extends Model<InferAttributes<UserOtp>, InferCreationAttributes<UserOtp, { omit: 'id' }>> {
  declare id: string;
  declare userId: string;
  declare otp: string;
}

UserOtp.init(
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
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'user_otps',
    modelName: 'UserOtp',
    indexes: [
      { fields: ['userId'] },
    ],
  }
);

// Associations are defined centrally in src/models/associations.ts
