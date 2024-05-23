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
import { BookDto } from './book.dto';
import { Response } from 'express';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get()
  public getBookById(@Query('id') id: string) {
    const book = this.bookService.getBookById(parseInt(id));
    return { result: book };
  }

  @Post()
  createBook(@Body() book: BookDto, @Res() response: Response) {
    const id = this.bookService.postBook(book);
    response.status(HttpStatus.OK).send({ result: id });
  }

  @Delete()
  public deleteBookById(@Query('id') id: string) {
    const totalBooksAfterDelete = this.bookService.deleteBookById(parseInt(id));
    return { result: totalBooksAfterDelete };
  }

  @Put()
  public updateBookById(
    @Query('id') id: string,
    @Query('price') price: string,
  ) {
    const lastPrice = this.bookService.updateBookById(
      parseInt(id),
      parseInt(price),
    );
    return { result: lastPrice };
  }
}
