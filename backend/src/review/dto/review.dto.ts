import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class ReviewDto {
  @IsString({
    message: 'Текст отзыва должен быть строкой',
  })
  @IsNotEmpty({
    message: 'Текст отзыва не должен быть пустым',
  })
  text!: string;
  @IsNumber(
    {},
    {
      message: 'Рейтинг должен быть числом',
    },
  )
  @Min(1, {
    message: 'Рейтинг не может быть меньше 1',
  })
  @Max(5, {
    message: 'Рейтинг не может быть больше 5',
  })
  @IsNotEmpty({
    message: 'Рейтинг не должен быть пустым',
  })
  rating!: number;
}
