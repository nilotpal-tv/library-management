import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Book, Report } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReportsService } from 'src/reports/reports.service';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { AddBookDto } from './dtos/add-book.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { BorrowBookDto } from './dtos/borrow-book.dto';
import { ReportDto } from './dtos/report.dto';
import { UpdateBookDto } from './dtos/update-book-dto';

@Injectable()
export class BooksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reportService: ReportsService,
  ) {}

  async findAll(paginationDto: PaginationDto): Promise<Book[]> {
    return this.prisma.book.findMany({
      skip: paginationDto.skip,
      take: paginationDto.limit <= 30 ? paginationDto.limit : 30,
    });
  }

  async findOneById(id: number): Promise<Book> {
    const book = await this.prisma.book.findUnique({ where: { id } });
    if (!book) throw new NotFoundException(`Book with id ${id} doesn't exist.`);
    return book;
  }

  async findOneByTitle(title: string): Promise<Book> {
    return this.prisma.book.findUnique({ where: { title } });
  }

  async findByCategory(category: string): Promise<Book[]> {
    return this.prisma.book.findMany({
      where: {
        categories: { hasSome: category },
      },
    });
  }

  async findByAuthor(author: string): Promise<Book[]> {
    return this.prisma.book.findMany({
      where: {
        authors: { hasSome: author },
      },
    });
  }

  async addBook(addBookDto: AddBookDto): Promise<Book> {
    if (addBookDto.categories.length === 0)
      throw new BadRequestException('At least one category is required.');

    if (addBookDto.authors.length === 0)
      throw new BadRequestException('At least one author is required.');

    const book = await this.findOneByTitle(addBookDto.title);
    if (book) return this.update(book.id, { count: book.count + 1 });

    return this.prisma.book.create({
      data: addBookDto,
    });
  }

  async removeBook(id: number): Promise<Book> {
    await this.findOneById(id);
    return this.prisma.book.delete({ where: { id } });
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    await this.findOneById(id);
    return this.prisma.book.update({ where: { id }, data: updateBookDto });
  }

  async borrow(
    borrowBookDto: BorrowBookDto,
    readerId: number,
  ): Promise<Report> {
    await this.findOneById(borrowBookDto.bookId);

    const notReturnedBooks = await this.prisma.report.findMany({
      where: { readerId: readerId, hasReturned: false },
    });

    if (notReturnedBooks.length > 3) {
      throw new BadRequestException(
        'You have to return the previously borrowed books.',
      );
    }

    const existBook = notReturnedBooks.find(
      (report) => report.bookId === borrowBookDto.bookId,
    );

    if (existBook) {
      throw new BadRequestException(
        "You've borrowed the same book but hasn't returned it.",
      );
    }

    return this.reportService.createReport(readerId, borrowBookDto.bookId);
  }

  async returnBook(
    returnReportDto: ReportDto,
    readerId: number,
  ): Promise<Report> {
    return this.reportService.update(returnReportDto.reportId, readerId, {
      hasReturned: true,
      returnedDate: new Date(),
    });
  }

  async approveReport(reportDto: ApproveReportDto, approverId: number) {
    return this.reportService.update(
      reportDto.reportId,
      reportDto.readerId,
      { hasApproved: true, approverId },
      { where: { hasApproved: false, hasReturned: false } },
    );
  }
}
