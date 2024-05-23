import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Book } from './book.interface';
import { BookDto } from './book.dto';
//import { BOOKS } from './book.mock';

@Injectable()
export class BookService {
  private;
  private books = [];
  private nextId = 1;

  public getBooks() {
    return this.books;
  }

  public filterBooks(query): Book[] {
    const genres = query?.genres?.split(',');
    if (genres && !genres.every((genere) => genere === genere.toUpperCase())) {
      throw new HttpException('', HttpStatus.BAD_REQUEST);
    }
    return this.books.filter((book) => {
      if (
        query.author &&
        book.author.toLowerCase() !== query.author.toLowerCase()
      )
        return false;
      if (
        query['price-bigger-than'] &&
        book.price < +query['price-bigger-than']
      )
        return false;
      if (query['price-less-than'] && book.price > +query['price-less-than'])
        return false;
      if (query['year-bigger-than'] && book.year < +query['year-bigger-than'])
        return false;
      if (query['year-less-than'] && book.year > +query['year-less-than'])
        return false;
      if (genres && !genres.some((genre) => book.genres.includes(genre)))
        return false;

      return true;
    });
  }

  public postBook(book: BookDto) {
    const existingBook = this.books.find(
      (b) => b.title.toUpperCase() === book.title.toUpperCase(),
    );
    if (existingBook) {
      throw new HttpException(
        `Error: Book with the title [${book.title}] already exists in the system`,
        HttpStatus.CONFLICT,
      );
    }

    if (book.year < 1940 || book.year > 2100) {
      throw new HttpException(
        `Error: Can't create new Book that its year [${book.year}] is not in the accepted range [1940 -> 2100]`,
        HttpStatus.CONFLICT,
      );
    }

    if (book.price <= 0) {
      throw new HttpException(
        `Error: Can't create new Book with negative price`,
        HttpStatus.CONFLICT,
      );
    }

    if (!book.genres.every((genere) => genere === genere.toUpperCase())) {
      throw new HttpException(
        `Error: Can't create new Book with lower case geners`,
        HttpStatus.CONFLICT,
      );
    }

    const newBook: Book = {
      id: this.nextId++,
      ...book,
    };
    this.books.push(newBook);
    return newBook.id;
  }

  public getBookById(id: number) {
    const book = this.books.find((book) => book.id === id);
    if (!book) {
      throw new HttpException(
        `Error: no such Book with id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return book;
  }

  public deleteBookById(id: number) {
    const index = this.books.findIndex((book) => book.id === id);
    if (index === -1) {
      throw new HttpException(
        `Error: no such Book with id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    this.books.splice(index, 1);
    return this.books.length;
  }

  public updateBookById(id: number, price: number) {
    if (price <= 0) {
      throw new HttpException(
        `Error: price update for book ${id} must be positive integer`,
        HttpStatus.CONFLICT,
      );
    }
    const book = this.getBookById(id);
    const oldPrice = book.price;
    book.price = price;

    return oldPrice;
  }
}