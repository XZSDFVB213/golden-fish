import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
  async getAll(searchTerm?: string) {
    if (searchTerm) return this.getSearchTermFilter(searchTerm);

    return await this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
      },
    });
  }
  private getSearchTermFilter(searchTerm: string) {
    return this.prisma.product.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
  }
  async getByStoreId(storeId: string) {
    return this.prisma.product.findMany({
      where: { storeId },
      include: {
        category: true,
      },
    });
  }
  async getById(id: string) {
    const product = await this.prisma.product.findUniqueOrThrow({
      where: { id },
      include: {
        category: true,
        reviews: true,
      },
    });
    if (!product) {
      throw new Error('product not found');
    }
    return product;
  }
  async getByCategory(categoryId: string) {
    const product = await this.prisma.product.findMany({
      where: {
        category: {
          id: categoryId,
        },
      },
      include: {
        category: true,
      },
    });
    if (!product) {
      throw new Error('product not found');
    }
    return product;
  }
  async getMostPopular() {
    const mostPopularProducts = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });
    const productIds = mostPopularProducts
      .map((item) => item.productId)
      .filter((id): id is string => id !== null);
    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      include: { category: true },
    });
    return products;
  }
  async getSimilar(id: string) {
    const currentProduct = await this.getById(id);
    if (!currentProduct) throw new NotFoundException('Текущий товар не найдет');
    const products = await this.prisma.product.findMany({
      where: {
        category: {
          id: currentProduct.category?.id,
        },
        NOT: {
          id: currentProduct.id,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
      },
    });
    return products;
  }
  async create(dto: ProductDto, storeId: string) {
    return this.prisma.product.create({
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        images: dto.images,
        categoryId: dto.categoryId,
        storeId,
      },
    });
  }
  async delete(id: string) {
    await this.getById(id);
    return this.prisma.product.delete({
      where: { id },
    });
  }
  async update(id: string, dto: ProductDto) {
    return this.prisma.product.update({
      where: {
        id,
      },
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        images: dto.images,
        categoryId: dto.categoryId,
      },
    });
  }
}
