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
import { Book } from '@prisma/client';
import { Auth } from 'src/iam/authentication/decorators/auth-type.decorator';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enum';
import { User } from 'src/iam/authorization/decorators/user-type.decorator';
import { UserType } from 'src/iam/authorization/enums/user-type.enum';
import { BooksService } from './books.service';
import { AddBookDto } from './dtos/add-book.dto';
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
}
