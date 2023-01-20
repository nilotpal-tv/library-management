import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Reports } from '@prisma/client';
import { Auth } from 'src/iam/authentication/decorators/auth-type.decorator';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enum';
import { User } from 'src/iam/authorization/decorators/user-type.decorator';
import { UserType } from 'src/iam/authorization/enums/user-type.enum';
import { ReportsService } from './reports.service';

@Auth(AuthType.Bearer)
@User(UserType.Librarian, UserType.Reader)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @User(UserType.Librarian)
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

  @User(UserType.Reader)
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

  @User(UserType.Reader)
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
