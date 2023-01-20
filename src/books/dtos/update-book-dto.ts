import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsPositive, IsOptional } from 'class-validator';
import { AddBookDto } from './add-book.dto';

export class UpdateBookDto extends PartialType(AddBookDto) {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  count?: number;
}
