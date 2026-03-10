/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsString()
  @IsEmail({}, { message: 'Некорректная почта' })
  email: string;

  @IsString({ message: 'Пароль должен быть' })
  @MinLength(6, {
    message: 'Минимальная длина пароля 6 символов',
  })
  password: string;
}
