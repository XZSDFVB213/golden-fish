import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJwtConfig = async (
  configService: ConfigService,
): Promise<JwtModuleOptions> => {
  const secret: string = (await configService.get('JWT_SECRET')) || 'secret';
  return { secret };
};
