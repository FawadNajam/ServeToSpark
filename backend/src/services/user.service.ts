import { User, Role } from '../models';
import { ApiError } from '../utils/apiError';

export interface UserPublic {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  roleId: number;
  role?: { name: string };
  createdAt: Date;
  updatedAt: Date;
}

function toPublic(user: User & { role?: Role }): UserPublic {
  const { password: _p, ...rest } = user.get();
  return rest as UserPublic;
}

export async function listUsers(): Promise<UserPublic[]> {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
    include: [{ model: Role, as: 'role', attributes: ['name'] }]
  });
  return users.map((u) => toPublic(u as User & { role?: Role }));
}

export async function getUserById(id: number): Promise<UserPublic> {
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password'] },
    include: [{ model: Role, as: 'role', attributes: ['name'] }]
  });
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  return toPublic(user as User & { role?: Role });
}

export interface UpdateUserInput {
  name?: string;
  phone?: string;
}

export async function updateUser(userId: number, input: UpdateUserInput): Promise<UserPublic> {
  const user = await User.findByPk(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  if (input.name !== undefined) user.name = input.name;
  if (input.phone !== undefined) user.phone = input.phone;
  await user.save();
  return getUserById(userId);
}
