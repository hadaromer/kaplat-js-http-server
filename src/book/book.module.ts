import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BooksController } from './books.controller';
import { BookService } from './book.service';

@Module({
  controllers: [BookController, BooksController],
  providers: [BookService],
})
export class BookModule {}
