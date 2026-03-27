import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}
  async getById(storeId: string, userId: string) {
    const store = await this.prisma.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
      include: {
        products: true,
      },
    });

    if (!store) {
      throw new Error('Store not found or you are not the owner');
    }

    return store;
  }
  async create(dto: CreateStoreDto, userId: string) {
    return this.prisma.store.create({
      data: {
        title: dto.title,
        userId,
      },
    });
  }
  async update(dto: UpdateStoreDto, userId: string, storeId: string) {
    await this.getById(storeId, userId);
    return this.prisma.store.update({
      where: { id: storeId },
      data: {
        ...dto,
        userId,
      },
    });
  }
  async delete(storeId: string, userId: string) {
    await this.getById(storeId, userId);
    return this.prisma.store.delete({
      where: { id: storeId },
    });
  }
}
