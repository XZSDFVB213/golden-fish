import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class ProductDto {
  @IsString({
    message: 'Название обязательно',
  })
  @IsNotEmpty({
    message: 'Название не должно быть пустым',
  })
  title!: string;

  @IsString({
    message: 'Описание обязательно',
  })
  @IsNotEmpty({
    message: 'Описание не должно быть пустым',
  })
  description!: string;

  @IsBoolean({
    message: 'isWeighted должен быть boolean',
  })
  isWeighted!: boolean;

  @IsArray({
    message: 'Изображения должны быть массивом',
  })
  @ArrayMinSize(1, {
    message: 'Хотя бы 1 картинка',
  })
  @IsString({
    each: true,
    message: 'Каждое изображение должно быть строкой',
  })
  @IsNotEmpty({
    each: true,
    message: 'Ссылка на изображение не должна быть пустой',
  })
  images!: string[];

  @IsNumber(
    {},
    {
      message: 'Цена обязательна',
    },
  )
  price!: number;

  @IsString({
    message: 'Категория обязательна',
  })
  @IsNotEmpty({
    message: 'Id категории не должно быть пустым',
  })
  categoryId!: string;
}
