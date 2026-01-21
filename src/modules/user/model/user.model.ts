import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../../../config/database';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User, { omit: 'id' }>> {
  declare id: string;
  declare email: string;
  declare passwordHash: string;
  declare firstName: string | null;
  declare lastName: string | null;
  // declare address: string | null;
  
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(320),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // address: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
    indexes: [
      { unique: true, fields: ['email'] },
    ],
  }
);

// Associations are defined centrally in src/models/associations.ts