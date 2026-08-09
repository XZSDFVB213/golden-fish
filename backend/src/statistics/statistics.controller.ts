import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/role.guards';
import { RoleUser } from '@prisma/client';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}
  @Get('manager/dashboard')
  @Roles(RoleUser.ADMIN, RoleUser.MANAGER)
  @UseGuards(RolesGuard)
  @Auth()
  getManagerDashboard() {
    return this.statisticsService.getManagerDashboard();
  }
  @Auth()
  @Roles(RoleUser.ADMIN, RoleUser.MANAGER)
  @Get('main/:storeId')
  async getMainStatistics(@Param('storeId') storeId: string) {
    return this.statisticsService.getMainStatistics(storeId);
  }

  @Auth()
  @Roles(RoleUser.ADMIN, RoleUser.MANAGER)
  @Get('middle/:storeId')
  async getStatistics(@Param('storeId') storeId: string) {
    return this.statisticsService.getMiddleStatistics(storeId);
  }
}
