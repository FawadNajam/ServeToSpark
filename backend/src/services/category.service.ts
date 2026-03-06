import { ServiceCategory } from '../models';
import { ApiError } from '../utils/apiError';

export interface CategoryDto {
  id: number;
  name: string;
}

export async function listCategories(): Promise<CategoryDto[]> {
  const list = await ServiceCategory.findAll({ order: [['name', 'ASC']] });
  return list.map((c) => ({ id: c.id, name: c.name }));
}

export async function createCategory(name: string): Promise<CategoryDto> {
  const existing = await ServiceCategory.findOne({ where: { name } });
  if (existing) {
    throw ApiError.conflict('Category name already exists');
  }
  const category = await ServiceCategory.create({ name });
  return { id: category.id, name: category.name };
}
