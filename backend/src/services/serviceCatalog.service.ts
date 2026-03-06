import { Service, ServiceCategory } from '../models';
import { ApiError } from '../utils/apiError';

export interface ServiceDto {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  category?: { name: string };
  createdAt: Date;
}

function toDto(service: Service & { category?: ServiceCategory }): ServiceDto {
  return service.get() as ServiceDto;
}

export async function listServices(categoryId?: number): Promise<ServiceDto[]> {
  const where = categoryId ? { categoryId } : {};
  const list = await Service.findAll({
    where,
    include: [{ model: ServiceCategory, as: 'category', attributes: ['name'] }]
  });
  return list.map((s) => toDto(s as Service & { category?: ServiceCategory }));
}

export async function getServiceById(id: number): Promise<ServiceDto> {
  const service = await Service.findByPk(id, {
    include: [{ model: ServiceCategory, as: 'category', attributes: ['name'] }]
  });
  if (!service) {
    throw ApiError.notFound('Service not found');
  }
  return toDto(service as Service & { category?: ServiceCategory });
}

export interface CreateServiceInput {
  name: string;
  description: string;
  price: number;
  categoryId: number;
}

export async function createService(input: CreateServiceInput): Promise<ServiceDto> {
  const category = await ServiceCategory.findByPk(input.categoryId);
  if (!category) {
    throw ApiError.badRequest('Category not found');
  }
  const service = await Service.create(input);
  return getServiceById(service.id);
}

export interface UpdateServiceInput {
  name?: string;
  description?: string;
  price?: number;
  categoryId?: number;
}

export async function updateService(id: number, input: UpdateServiceInput): Promise<ServiceDto> {
  const service = await Service.findByPk(id);
  if (!service) {
    throw ApiError.notFound('Service not found');
  }
  if (input.categoryId !== undefined) {
    const category = await ServiceCategory.findByPk(input.categoryId);
    if (!category) throw ApiError.badRequest('Category not found');
  }
  await service.update(input);
  return getServiceById(id);
}

export async function deleteService(id: number): Promise<void> {
  const service = await Service.findByPk(id);
  if (!service) {
    throw ApiError.notFound('Service not found');
  }
  await service.destroy();
}
