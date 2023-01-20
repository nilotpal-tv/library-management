import { IsPositive, IsNumber } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @IsPositive()
  skip: number;

  @IsNumber()
  @IsPositive()
  limit: number;
}
