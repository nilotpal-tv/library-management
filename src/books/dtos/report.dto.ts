import { IsNumber, IsPositive } from 'class-validator';

export class ReportDto {
  @IsNumber()
  @IsPositive()
  reportId: number;
}
