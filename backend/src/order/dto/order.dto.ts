import { EnumOrderStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class OrderDto {
  @IsOptional()
  @IsEnum(EnumOrderStatus, {
    message: 'Статус заказа обязателен',
  })
  status!: EnumOrderStatus;

  @IsArray({
    message: 'В заказе нет товаров',
  })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
export class OrderItemDto {
  @IsNumber(
    {},
    {
      message: 'Количество товара должно быть числом',
    },
  )
  quantity!: number;

  @IsNumber(
    {},
    {
      message: 'Цена должна быть числом',
    },
  )
  price!: number;

  @IsString({
    message: 'Id товара обязательно',
  })
  productId!: string;

  @IsString({
    message: 'Id магазина обязательно',
  })
  storeId!: string;
}
