import { Controller, Get, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { FilterBooksDto } from './dtos/filterBooks.dto';

@Controller('books')
export class BooksController {
  constructor(private bookService: BookService) {}

  @Get('health')
  public getHealth() {
    return 'OK';
  }

  @Get('total')
  public getBooksTotal(@Query() query: FilterBooksDto) {
    const total = this.bookService.filterBooks(query).length;
    return { result: total };
  }

  @Get()
  public getBooks(@Query() query: FilterBooksDto) {
    const books = this.bookService.filterBooks(query).sort(function (a, b) {
      return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
    });
    return { result: books };
  }
}
