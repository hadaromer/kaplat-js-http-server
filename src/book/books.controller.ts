import { Controller, Get, Query } from '@nestjs/common';
import { BookService } from './book.service';

@Controller('books')
export class BooksController {
  constructor(private bookService: BookService) {}

  @Get('health')
  public getHealth() {
    return 'OK';
  }

  @Get('total')
  public getBooksTotal(@Query() query) {
    const total = this.bookService.filterBooks(query).length;
    return { result: total };
  }

  @Get()
  public getBooks(@Query() query) {
    const books = this.bookService.filterBooks(query).sort(function (a, b) {
      return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
    });
    return { result: books };
  }
}
