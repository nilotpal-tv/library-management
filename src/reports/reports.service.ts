import { Injectable } from '@nestjs/common';
import { Report } from '@prisma/client';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(paginationDto: PaginationDto): Promise<Report[]> {
    return this.prisma.report.findMany({
      skip: paginationDto.skip,
      take: paginationDto.limit <= 30 ? paginationDto.limit : 30,
    });
  }

  async findApprovedReports(paginationDto: PaginationDto): Promise<Report[]> {
    return this.prisma.report.findMany({
      skip: paginationDto.skip,
      where: { hasApproved: true },
      take: paginationDto.limit <= 30 ? paginationDto.limit : 30,
    });
  }

  async findAllByUserId(
    userId: number,
    paginationDto: PaginationDto,
  ): Promise<Report[]> {
    return this.prisma.report.findMany({
      skip: paginationDto.skip,
      where: { readerId: userId },
      take: paginationDto.limit <= 30 ? paginationDto.limit : 30,
    });
  }

  async findApprovedByUserId(
    userId: number,
    paginationDto: PaginationDto,
  ): Promise<Report[]> {
    return this.prisma.report.findMany({
      skip: paginationDto.skip,
      where: { readerId: userId, hasApproved: true },
      take: paginationDto.limit <= 30 ? paginationDto.limit : 30,
    });
  }
}
