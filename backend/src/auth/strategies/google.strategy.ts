import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      clientID: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL:
        configService.getOrThrow<string>('SERVER_URL') +
        '/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }
  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { displayName, emails, photos } = profile;

    const user = await this.prisma.user.upsert({
      where: { email: emails?.[0]?.value },
      update: {},
      create: {
        email: emails?.[0]?.value || '',
        name: displayName,
        picture: photos?.[0]?.value,
      },
    });

    done(null, user);
  }
}
