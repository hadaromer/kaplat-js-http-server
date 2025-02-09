import { Controller, Get, Inject, Query, Req } from '@nestjs/common';
import { BookService } from './book.service';
import { FilterBooksDto } from './dtos/filterBooks.dto';
import { Logger } from 'winston';
import { Request } from 'express';

@Controller('books')
export class BooksController {
  constructor(
    private bookService: BookService,
    @Inject('BOOKS_LOGGER') private readonly logger: Logger,
  ) {}

  @Get('health')
  public getHealth() {
    return 'OK';
  }

  @Get('total')
  public async getBooksTotal(
    @Query() query: FilterBooksDto,
    @Req() request: Request,
  ) {
    const total = (await this.bookService.filterBooks(query)).length;
    const requestNumber = request['requestId'];
    this.logger.info(
      `Total Books found for requested filters is ${total} | request #${requestNumber}`,
    );
    return { result: total };
  }

  @Get()
  public async getBooks(
    @Query() query: FilterBooksDto,
    @Req() request: Request,
  ) {
    const books = (await this.bookService.filterBooks(query)).sort(
      function (a, b) {
        return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
      },
    );
    const requestNumber = request['requestId'];
    this.logger.info(
      `Total Books found for requested filters is ${books.length} | request #${requestNumber}`,
    );
    return { result: books };
  }
}
