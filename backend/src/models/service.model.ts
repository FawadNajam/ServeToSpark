import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface ServiceAttributes {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  createdAt?: Date;
}

export type ServiceCreationAttributes = Optional<ServiceAttributes, 'id' | 'createdAt'>;

export class Service extends Model<ServiceAttributes, ServiceCreationAttributes> implements ServiceAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public categoryId!: number;
  public readonly createdAt!: Date;
}

Service.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    categoryId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'service_categories',
        key: 'id'
      },
      field: 'category_id'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    }
  },
  {
    sequelize,
    tableName: 'services',
    modelName: 'Service',
    underscored: true,
    updatedAt: false
  }
);

