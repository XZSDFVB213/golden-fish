/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-yandex';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy, 'yandex') {
  constructor(
    private configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      clientID: configService.getOrThrow<string>('YANDEX_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('YANDEX_CLIENT_SECRET'),
      callbackURL:
        configService.getOrThrow<string>('SERVER_URL') +
        '/auth/yandex/callback',
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: any,
  ) {
    const { username, emails, photos } = profile;

    const user = await this.prisma.user.upsert({
      where: { email: emails?.[0]?.value },
      update: {},
      create: {
        email: emails?.[0]?.value || '',
        name: username,
        picture: photos?.[0]?.value,
      },
    });

    done(null, user);
  }
}
