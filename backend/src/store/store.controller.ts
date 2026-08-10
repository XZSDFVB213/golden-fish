import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleUser } from '@prisma/client';
import { RolesGuard } from 'src/auth/guards/role.guards';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}
  @Get('manager/all')
  @Roles(RoleUser.MANAGER, RoleUser.ADMIN)
  @UseGuards(RolesGuard)
  @Auth()
  getAllManager() {
    return this.storeService.getAllManager();
  }
  @Auth()
  @Get('by-id/:id')
  async getById(
    @Param('id') storeId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.storeService.getById(storeId, userId);
  }
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post()
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateStoreDto) {
    return this.storeService.create(dto, userId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(':id')
  async update(
    @Param('id') storeId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateStoreDto,
  ) {
    return this.storeService.update(dto, userId, storeId);
  }
  @HttpCode(200)
  @Auth()
  @Delete(':id')
  async delete(
    @Param('id') storeId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.storeService.delete(storeId, userId);
  }
}
