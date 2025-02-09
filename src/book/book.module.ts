import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/providers/database.module';
import { bookProviders } from './book.providers';
import { BookController } from './book.controller';
import { BooksController } from './books.controller';
import { BookService } from './book.service';

@Module({
  imports: [DatabaseModule],
  controllers: [BookController, BooksController],
  providers: [...bookProviders, BookService],
})
export class BookModule {}
