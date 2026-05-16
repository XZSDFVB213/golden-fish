import {
  Controller,
  UsePipes,
  ValidationPipe,
  Body,
  HttpCode,
  Post,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { OrderDto } from './dto/order.dto';
import { CurrentUser } from 'src/user/decorators/user.decorator';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('place')
  @Auth()
  async checkout(@Body() dto: OrderDto, @CurrentUser('id') userId: string) {
    return this.orderService.createPayment(dto, userId);
  }
}
