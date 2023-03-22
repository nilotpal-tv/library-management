import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Book, Reader, Report } from '@prisma/client';
import { ActiveUser } from 'src/iam/authentication/decorators/active-user.decorator';
import { Auth } from 'src/iam/authentication/decorators/auth-type.decorator';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enum';
import { User } from 'src/iam/authorization/decorators/user-type.decorator';
import { UserType } from 'src/iam/authorization/enums/user-type.enum';
import { BooksService } from './books.service';
import { AddBookDto } from './dtos/add-book.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { BorrowBookDto } from './dtos/borrow-book.dto';
import { ReportDto } from './dtos/report.dto';
import { UpdateBookDto } from './dtos/update-book-dto';

@Auth(AuthType.None)
@User(UserType.Librarian, UserType.Reader)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get('/')
  async getAllBooks(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return await this.booksService.findAll({ skip, limit });
  }

  @Get(':id')
  async getOneById(@Param('id', ParseIntPipe) id: number): Promise<Book> {
    return await this.booksService.findOneById(id);
  }

  @Get('category')
  async getManyByCategory(@Query('category') category: string) {
    return await this.booksService.findByCategory(category);
  }

  @Get('author')
  async getManyByAuthor(@Query('author') author: string) {
    return await this.booksService.findByAuthor(author);
  }

  @Auth(AuthType.Bearer)
  @User(UserType.Librarian)
  @Post('new')
  async addBook(@Body() addBookDto: AddBookDto): Promise<Book> {
    return await this.booksService.addBook(addBookDto);
  }

  @Auth(AuthType.Bearer)
  @User(UserType.Librarian)
  @Delete(':id')
  async removeBook(@Param('id', ParseIntPipe) id: number): Promise<Book> {
    return await this.booksService.removeBook(id);
  }

  @Auth(AuthType.Bearer)
  @User(UserType.Librarian)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    return await this.booksService.update(id, updateBookDto);
  }

  @User(UserType.Reader)
  @Auth(AuthType.Bearer)
  @Post('borrow')
  async borrow(
    // @ActiveUser() reader: Reader,
    @Body() borrowBookDto: BorrowBookDto,
  ): Promise<Report> {
    return await this.booksService.borrow(borrowBookDto, 1);
  }

  @User(UserType.Reader)
  @Auth(AuthType.Bearer)
  @Post('return')
  async return(
    // @ActiveUser() reader: Reader,
    @Body() returnReportDto: ReportDto,
  ): Promise<Report> {
    return await this.booksService.returnBook(returnReportDto, 1);
  }

  @User(UserType.Librarian)
  @Auth(AuthType.Bearer)
  @Post('approve')
  async approve(
    // @ActiveUser() reader: Reader,
    @Body() approveReportDto: ApproveReportDto,
  ): Promise<Report> {
    return await this.booksService.approveReport(approveReportDto, 1);
  }
}
