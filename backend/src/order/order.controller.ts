import {
  Controller,
  UsePipes,
  ValidationPipe,
  Body,
  HttpCode,
  Post,
  Get,
  UseGuards,
  Param,
  Patch,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { OrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { PaymentStatusDto } from './dto/payment.status.dto';
import { RoleUser } from '@prisma/client';
import { RolesGuard } from 'src/auth/guards/role.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
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

  @HttpCode(200)
  @Post('status')
  async updateStatus(@Body() dto: PaymentStatusDto) {
    return this.orderService.updateStatus(dto);
  }
  @Get()
  @Auth()
  async getUserOrders(@CurrentUser('id') userId: string) {
    return this.orderService.getUserOrders(userId);
  }
  @Get('manager/all')
  @Roles(RoleUser.MANAGER, RoleUser.ADMIN)
  @UseGuards(RolesGuard)
  @Auth()
  async getManagerOrders(@CurrentUser() user: any) {
    console.log(user);

    return this.orderService.getAll();
  }
  @Patch(':id/status')
  @Roles(RoleUser.MANAGER, RoleUser.ADMIN)
  @UseGuards(RolesGuard)
  @Auth()
  async updateStatusOrder(
    @Param('id') orderId: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateStatusOrder(orderId, dto.status);
  }
}
