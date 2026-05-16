import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { YooCheckout } from '@a2seven/yoo-checkout';
import { OrderDto } from './dto/order.dto';
const chekout = new YooCheckout({
  shopId: process.env.YOOKASSA_SHOP_ID ?? 'defaultShopId',
  secretKey: process.env.YOOKASSA_SECRET_KEY ?? 'defaultSecretKey',
});
@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createPayment(dto: OrderDto, userId: string) {
    const orderItems = dto.items.map((item) => ({
      price: item.price,
      quantity: item.quantity,
      product: {
        connect: {
          id: item.productId,
        },
      },
      store: {
        connect: {
          id: item.storeId,
        },
      },
    }));
    const total = dto.items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);
    const order = await this.prisma.order.create({
      data: {
        status: dto.status,
        total,
        user: {
          connect: {
            id: userId,
          },
        },
        items: {
          create: orderItems,
        },
      },
    });
    const payment = await chekout.createPayment({
      amount: {
        value: total.toFixed(2),
        currency: 'RUB',
      },
      payment_method_data: {
        type: 'bank_card',
      },
      confirmation: {
        type: 'redirect',
        return_url: `${process.env.CLIENT_URL}/thanks`,
      },
      description: `Оплата заказа в магазине. ID платежа #${order.id}`,
    });
    return payment;
  }
}
