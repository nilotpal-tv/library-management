import { IsNumber, IsPositive } from 'class-validator';

export class BorrowBookDto {
  @IsNumber()
  @IsPositive()
  bookId: number;
}
