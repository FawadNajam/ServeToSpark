import { sequelize } from '../config/database';
import { Role } from './role.model';
import { User } from './user.model';
import { ServiceCategory } from './serviceCategory.model';
import { Service } from './service.model';
import { Booking } from './booking.model';
import { RoleName } from '../types/enums';

// Associations
Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

ServiceCategory.hasMany(Service, { foreignKey: 'categoryId', as: 'services' });
Service.belongsTo(ServiceCategory, { foreignKey: 'categoryId', as: 'category' });

User.hasMany(Booking, { foreignKey: 'userId', as: 'userBookings' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Booking, { foreignKey: 'providerId', as: 'providerBookings' });
Booking.belongsTo(User, { foreignKey: 'providerId', as: 'provider' });

Service.hasMany(Booking, { foreignKey: 'serviceId', as: 'bookings' });
Booking.belongsTo(Service, { foreignKey: 'serviceId', as: 'service' });

export async function initDb(sync = true): Promise<void> {
  await sequelize.authenticate();

  if (sync) {
    await sequelize.sync();
  }

  // Seed default roles if they do not exist
  const roleNames = Object.values(RoleName);
  // eslint-disable-next-line no-restricted-syntax
  for (const name of roleNames) {
    // eslint-disable-next-line no-await-in-loop
    await Role.findOrCreate({ where: { name }, defaults: { name } });
  }
}

export { sequelize, Role, User, ServiceCategory, Service, Booking };

