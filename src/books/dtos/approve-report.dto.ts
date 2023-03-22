import { IsNumber, IsPositive } from 'class-validator';

export class ApproveReportDto {
  @IsNumber()
  @IsPositive()
  reportId: number;

  @IsNumber()
  @IsPositive()
  readerId: number;
}
