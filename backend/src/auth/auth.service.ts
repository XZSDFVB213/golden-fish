/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  EXPIRE_DAY_REFRESH_TOKEN = 1;
  REFRESH_TOKEN_NAME = 'refreshToken';
  constructor(
    private jwt: JwtService,
    private userService: UserService,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}
  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);
    const tokens = this.issueTokens(user.id);
    return {
      user,
      ...tokens,
    };
  }
  async register(dto: AuthDto) {
    const oldUser = await this.userService.getByEmail(dto.email);
    if (oldUser) {
      throw new BadRequestException('Пользователь уже есть');
    }
    const user = await this.userService.create(dto);
    const tokens = this.issueTokens(user.id);
    return {
      user,
      ...tokens,
    };
  }
  async getNewTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);
    if (!result) {
      throw new UnauthorizedException('Невалидный токен');
    }
    const user = await this.userService.getById(result.id);
    const tokens = this.issueTokens(user!.id);
    return {
      user,
      ...tokens,
    };
  }
  issueTokens(userId: string) {
    const data = { id: userId };
    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h',
    });
    const refreshToken = this.jwt.sign(data, {
      expiresIn: '7d',
    });
    return {
      accessToken,
      refreshToken,
    };
  }
  private async validateUser(dto: AuthDto) {
    const user = await this.userService.getByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }
  async validateOAuthLogin(req: any) {
    let user = await this.userService.getByEmail(req.user.email);
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: req.user.email,
          name: req.user.name,
          picture: req.user.picture,
        },
        include: {
          stores: true,
          favorites: true,
          orders: true,
        },
      });
    }
    const tokens = this.issueTokens(user.id);
    return {
      user,
      ...tokens,
    };
  }
  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);
    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      domain: this.configService.get('SERVER_DOMAIN'),
      expires: expiresIn,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
  }
  removeRefreshTokenToResponse(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      domain: this.configService.get('SERVER_DOMAIN'),
      expires: new Date(0),
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
  }
}
