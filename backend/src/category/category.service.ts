import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}
  async getByStoreId(storeId: string) {
    return this.prisma.category.findMany({
      where: { storeId },
    });
  }
  async getById(id: string) {
    const category = await this.prisma.category.findUniqueOrThrow({
      where: { id },
    });
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }
  async create(dto: CategoryDto, storeId: string) {
    return this.prisma.category.create({
      data: {
        title: dto.title,
        description: dto.description,
        storeId,
      },
    });
  }
  async delete(id: string) {
    await this.getById(id);
    return this.prisma.category.delete({
      where: { id },
    });
  }
  async update(id: string, dto: CategoryDto) {
    await this.getById(id);
    return this.prisma.category.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
      },
    });
  }
}
