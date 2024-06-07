import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { BookService } from './book.service';
import { BookDto } from './dtos/book.dto';
import { Response } from 'express';
import { UpadateBookDto } from './dtos/updateBook.dto';
import { IdDto } from './dtos/id.dto';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get()
  public getBookById(@Query() query: IdDto) {
    const book = this.bookService.getBookById(+query.id);
    return { result: book };
  }

  @Post()
  createBook(@Body() book: BookDto, @Res() response: Response) {
    const id = this.bookService.postBook(book);
    response.status(HttpStatus.OK).send({ result: id });
  }

  @Delete()
  public deleteBookById(@Query() query: IdDto) {
    const totalBooksAfterDelete = this.bookService.deleteBookById(+query.id);
    return { result: totalBooksAfterDelete };
  }

  @Put()
  public updateBookById(@Query() query: UpadateBookDto) {
    const lastPrice = this.bookService.updateBookById(query.id, query.price);
    return { result: lastPrice };
  }
}
