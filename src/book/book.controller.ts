import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { BookService } from './book.service';
import { BookDto } from './dtos/book.dto';
import { Response, Request } from 'express';
import { UpadateBookDto } from './dtos/updateBook.dto';
import { IdDto, IdDtoWithPersistenceMethod } from './dtos/id.dto';
import { Logger } from 'winston';
import { PersistenceMethod } from './dtos/persistenceMethods.enum';

@Controller('book')
export class BookController {
  constructor(
    private bookService: BookService,
    @Inject('BOOKS_LOGGER') private readonly logger: Logger,
  ) {}

  @Get()
  public async getBookById(
    @Query() query: IdDtoWithPersistenceMethod,
    @Req() request: Request,
  ) {
    const requestNumber = request['requestId'];
    this.logger.debug(
      `Fetching book id ${query.id} details | request #${requestNumber}`,
    );
    const book = await this.bookService.getBookById(
      +query.id,
      query.persistenceMethod as PersistenceMethod,
    );
    return { result: book };
  }

  @Post()
  async createBook(
    @Body() book: BookDto,
    @Res() response: Response,
    @Req() request: Request,
  ) {
    const id = await this.bookService.postBook(book);

    const totalBooks: number = await this.bookService.getTotalBooksCount();
    const requestNumber = request['requestId'];
    this.logger.info(
      `Creating new Book with Title [${book.title}] | request #${requestNumber}`,
    );

    this.logger.debug(
      `Currently there are ${totalBooks - 1} Books in the system. New Book will be assigned with id ${id} | request #${requestNumber}`,
    );

    response.status(HttpStatus.OK).send({ result: id });
  }

  @Delete()
  public async deleteBookById(@Query() query: IdDto, @Req() request: Request) {
    const res = await this.bookService.deleteBookById(+query.id);
    const requestNumber = request['requestId'];
    this.logger.info(
      `Removing book [${res.title}] | request #${requestNumber}`,
    );
    this.logger.debug(
      `After removing book [${res.title}] id: [${query.id}] there are ${res.currentLength} books in the system | request #${requestNumber}`,
    );
    return { result: res.currentLength };
  }

  @Put()
  public async updateBookById(
    @Query() query: UpadateBookDto,
    @Req() request: Request,
  ) {
    const book = await this.bookService.updateBookById(+query.id, +query.price);
    const requestNumber = request['requestId'];
    this.logger.info(
      `Update Book id [${query.id}] price to ${query.price} | request #${requestNumber}`,
    );
    this.logger.debug(
      `Book [${book.title}] price change: ${book.oldPrice} --> ${query.price} | request #${requestNumber}`,
    );
    return { result: book.oldPrice };
  }
}
