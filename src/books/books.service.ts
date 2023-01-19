import { Injectable, NotFoundException } from '@nestjs/common';
import { Book } from '@prisma/client';
import { Auth } from 'src/iam/authentication/decorators/auth-type.decorator';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from './dtos/pagination.dto';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  @Auth(AuthType.None)
  async findAll(paginationDto: PaginationDto): Promise<Book[]> {
    return this.prisma.book.findMany({
      skip: paginationDto.skip,
      take: paginationDto.limit <= 30 ? paginationDto.limit : 30,
    });
  }

  @Auth(AuthType.None)
  async findOneById(id: number): Promise<Book> {
    const book = await this.prisma.book.findUnique({ where: { id } });
    if (!book) throw new NotFoundException(`Book with id ${id} doesn't exist.`);
    return book;
  }

  @Auth(AuthType.None)
  async findByCategory(category: string): Promise<Book[]> {
    return this.prisma.book.findMany({
      where: {
        categories: { hasSome: category },
      },
    });
  }

  @Auth(AuthType.None)
  async findByAuthor(author: string): Promise<Book[]> {
    return this.prisma.book.findMany({
      where: {
        authors: { hasSome: author },
      },
    });
  }
}
