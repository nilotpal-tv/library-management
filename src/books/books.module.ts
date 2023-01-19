import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

@Module({
  imports: [PrismaModule],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
