import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface ServiceCategoryAttributes {
  id: number;
  name: string;
}

export type ServiceCategoryCreationAttributes = Optional<ServiceCategoryAttributes, 'id'>;

export class ServiceCategory
  extends Model<ServiceCategoryAttributes, ServiceCategoryCreationAttributes>
  implements ServiceCategoryAttributes
{
  public id!: number;
  public name!: string;
}

ServiceCategory.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    }
  },
  {
    sequelize,
    tableName: 'service_categories',
    modelName: 'ServiceCategory',
    underscored: true
  }
);

