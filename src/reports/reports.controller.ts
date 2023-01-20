import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Reports } from '@prisma/client';
import { Auth } from 'src/iam/authentication/decorators/auth-type.decorator';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enum';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('/')
  async getAll(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return await this.reportsService.findAll({ skip, limit });
  }

  @Get('approved')
  async getApproved(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<Reports[]> {
    return await this.reportsService.findApprovedReports({
      limit,
      skip,
    });
  }

  @Get(':userId')
  async getAllByUserId(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Reports[]> {
    return await this.reportsService.findAllByUserId(userId, {
      limit,
      skip,
    });
  }

  @Get('approved/:userId')
  async getApprovedByUserId(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Reports[]> {
    return await this.reportsService.findApprovedByUserId(userId, {
      limit,
      skip,
    });
  }
}
