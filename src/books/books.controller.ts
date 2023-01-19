import { Body, Controller, Get, Param, Query } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { Book } from '@prisma/client';
import { BooksService } from './books.service';
import { PaginationDto } from './dtos/pagination.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get('/')
  async getAllBooks(@Body() paginationDto: PaginationDto) {
    return await this.booksService.findAll(paginationDto);
  }

  @Get(':id')
  async getOneById(@Param('id', ParseIntPipe) id: number): Promise<Book> {
    return await this.booksService.findOneById(id);
  }

  @Get('by-category')
  async getManyByCategory(@Query('category') category: string) {
    return await this.booksService.findByCategory(category);
  }

  @Get('by-author')
  async getManyByAuthor(@Query('author') author: string) {
    return await this.booksService.findByAuthor(author);
  }
}
