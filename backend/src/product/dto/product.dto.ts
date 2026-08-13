import {
  ArrayMinSize,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class ProductDto {
  @IsString({
    message: 'Название обязательно',
  })
  @IsNotEmpty({ message: 'Название не должно быть пустым' })
  title!: string;

  @IsString({
    message: 'Описание обязательно',
  })
  @IsNotEmpty({ message: 'Описание не должно быть пустым' })
  description!: string;

  @IsString({
    message: 'Изображение обязательно',
    each: true,
  })
  @IsBoolean({ message: 'isWeighted обязательно' })
  isWeighted!: boolean;

  @ArrayMinSize(1, { message: 'Хотя бы 1 картинка' })
  @IsNotEmpty({ message: 'Изображение не должно быть пустым', each: true })
  images!: string[];
  @IsNumber({}, { message: 'Цена обязательна' })
  @IsNotEmpty({ message: 'Цена не должна быть пустой' })
  price!: number;
  @IsString({
    message: 'Категория обязательна',
  })
  @IsNotEmpty({ message: 'Id Категории не должно быть пустым' })
  categoryId!: string;
}
