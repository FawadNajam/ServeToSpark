import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { RoleName } from '../types/enums';

export interface RoleAttributes {
  id: number;
  name: RoleName;
  createdAt?: Date;
  updatedAt?: Date;
}

export type RoleCreationAttributes = Optional<RoleAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  public id!: number;
  public name!: RoleName;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.ENUM(...Object.values(RoleName)),
      allowNull: false,
      unique: true
    }
  },
  {
    sequelize,
    tableName: 'roles',
    modelName: 'Role',
    underscored: true
  }
);

