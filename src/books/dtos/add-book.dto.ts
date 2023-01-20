import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class AddBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  authors: string[];

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  categories: string[];

  @IsString()
  @IsNotEmpty()
  publisher: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsDateString()
  publicationDate: Date;
}
