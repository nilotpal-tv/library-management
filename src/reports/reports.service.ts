import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Report } from '@prisma/client';
import { UpdateReport } from 'src/books/types/update-report.type';
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

  async findOneByUserId(
    reportId: number,
    readerId: number,
    filters?: Prisma.ReportFindFirstArgs,
  ): Promise<Report> {
    const report = await this.prisma.report.findFirst({
      where: {
        readerId,
        id: reportId,
        ...filters?.where,
      },
    });

    if (!report)
      throw new NotFoundException(`Report with id ${reportId} doesn't exist.`);
    return report;
  }

  async deleteReportByUserId(
    reportId: number,
    readerId: number,
  ): Promise<Report> {
    await this.findOneByUserId(readerId, readerId);
    return this.prisma.report.delete({
      where: { id: reportId },
    });
  }

  async createReport(readerId: number, bookId: number): Promise<Report> {
    return this.prisma.report.create({
      data: {
        bookId,
        readerId,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  async update(
    reportId: number,
    readerId: number,
    updatedData: UpdateReport,
    filters?: Prisma.ReportFindFirstArgs,
  ): Promise<Report> {
    const report = await this.findOneByUserId(reportId, readerId, filters);
    return this.prisma.report.update({
      where: { id: reportId },
      data: { ...report, ...updatedData },
    });
  }
}
