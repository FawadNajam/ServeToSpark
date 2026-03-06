import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { BookingStatus } from '../types/enums';

export interface BookingAttributes {
  id: number;
  userId: number;
  serviceId: number;
  providerId: number | null;
  bookingDate: Date;
  status: BookingStatus;
  notes: string | null;
  createdAt?: Date;
}

export type BookingCreationAttributes = Optional<BookingAttributes, 'id' | 'status' | 'notes' | 'providerId' | 'createdAt'>;

export class Booking extends Model<BookingAttributes, BookingCreationAttributes> implements BookingAttributes {
  public id!: number;
  public userId!: number;
  public serviceId!: number;
  public providerId!: number | null;
  public bookingDate!: Date;
  public status!: BookingStatus;
  public notes!: string | null;
  public readonly createdAt!: Date;
}

Booking.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'user_id'
    },
    serviceId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'services',
        key: 'id'
      },
      field: 'service_id'
    },
    providerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'provider_id'
    },
    bookingDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'booking_date'
    },
    status: {
      type: DataTypes.ENUM(...Object.values(BookingStatus)),
      allowNull: false,
      defaultValue: BookingStatus.PENDING
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
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
    tableName: 'bookings',
    modelName: 'Booking',
    underscored: true,
    updatedAt: false
  }
);

