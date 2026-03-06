import { User, Role } from '../models';
import { RoleName } from '../types/enums';
import { ApiError } from '../utils/apiError';
import { hashPassword, comparePassword } from '../utils/password';
import { signToken } from '../utils/jwt';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: RoleName;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult {
  user: { id: number; name: string; email: string; role: RoleName };
  token: string;
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  const existing = await User.findOne({ where: { email: input.email } });
  if (existing) {
    throw ApiError.conflict('Email already registered');
  }

  const roleName = input.role ?? RoleName.USER;
  const role = await Role.findOne({ where: { name: roleName } });
  if (!role) {
    throw ApiError.badRequest('Invalid role');
  }

  const hashedPassword = await hashPassword(input.password);
  const user = await User.create({
    name: input.name,
    email: input.email,
    password: hashedPassword,
    phone: input.phone ?? null,
    roleId: role.id
  });

  const token = signToken({ sub: user.id, role: roleName });
  return {
    user: { id: user.id, name: user.name, email: user.email, role: roleName },
    token
  };
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const user = await User.findOne({ where: { email: input.email } });
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const role = await Role.findByPk(user.roleId);
  if (!role) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const valid = await comparePassword(input.password, user.password);
  if (!valid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const token = signToken({ sub: user.id, role: role.name as RoleName });
  return {
    user: { id: user.id, name: user.name, email: user.email, role: role.name as RoleName },
    token
  };
}
