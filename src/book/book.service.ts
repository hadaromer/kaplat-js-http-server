import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
// import { Book as BookInterface } from './book.interface';
import { Book } from './book.interface';
//import { BookPostgres } from './bookPostgres.entity';
//import { BookMongo } from './bookMongo.entity';
import { BookDto } from './dtos/book.dto';
import { MAX_YEAR, MIN_YEAR, GENRES } from 'src/utils/constants';
import { FilterBooksDto } from './dtos/filterBooks.dto';
import { Repository } from 'typeorm';
import { BookPostgres } from './bookPostgres.entity';
import { BookMongo } from './bookMongo.entity';
import {
  PersistenceMethod,
  PersistenceMethods,
} from './dtos/persistenceMethods.enum';

@Injectable()
export class BookService {
  constructor(
    @Inject('BOOK_REPOSITORY')
    private bookRepository: Repository<BookPostgres>,
    @Inject('BOOK_MONGO_REPOSITORY')
    private mongoRepository: Repository<BookMongo>,
  ) {
    this.setNextId();
  }

  private nextId = 1;

  private async setNextId() {
    const length = await this.bookRepository.count();
    this.nextId = length + 1;
  }

  public getTotalBooksCount(): Promise<number> {
    return this.bookRepository.count();
  }

  async filterBooks(query: FilterBooksDto): Promise<Book[]> {
    const genres = this.validateGenres(query?.genres);

    if (query.persistenceMethod === PersistenceMethods.MONGO) {
      return await this.filterBooksFromMongo(query, genres);
    } else {
      return await this.filterBooksFromPostgres(query, genres);
    }
  }

  private validateGenres(genresString?: string): string[] | null {
    if (!genresString) {
      return null;
    }

    const genres = genresString.split(',');
    if (!genres.every((genre) => GENRES.includes(genre))) {
      throw new HttpException(
        'Invalid genres provided',
        HttpStatus.BAD_REQUEST,
      );
    }
    return genres;
  }

  private async filterBooksFromPostgres(
    query: FilterBooksDto,
    genres: string[] | null,
  ): Promise<Book[]> {
    const queryBuilder = this.bookRepository.createQueryBuilder('book');

    if (query.author) {
      queryBuilder.andWhere('LOWER(book.author) = LOWER(:author)', {
        author: query.author,
      });
    }

    if (query['price-bigger-than']) {
      queryBuilder.andWhere('book.price >= :priceBiggerThan', {
        priceBiggerThan: +query['price-bigger-than'],
      });
    }

    if (query['price-less-than']) {
      queryBuilder.andWhere('book.price <= :priceLessThan', {
        priceLessThan: +query['price-less-than'],
      });
    }

    if (query['year-bigger-than']) {
      queryBuilder.andWhere('book.year >= :yearBiggerThan', {
        yearBiggerThan: +query['year-bigger-than'],
      });
    }

    if (query['year-less-than']) {
      queryBuilder.andWhere('book.year <= :yearLessThan', {
        yearLessThan: +query['year-less-than'],
      });
    }

    if (genres) {
      queryBuilder.andWhere('book.genres::jsonb ?| :genres', { genres });
    }

    const booksData = await queryBuilder.getMany();
    const books = booksData.map((book) => new Book(book));
    return books;
  }

  private async filterBooksFromMongo(
    query: FilterBooksDto,
    genres: string[] | null,
  ): Promise<Book[]> {
    const mongoQuery: any = {};

    if (query.author) {
      mongoQuery.author = { $regex: new RegExp(`^${query.author}$`, 'i') };
    }

    if (query['price-bigger-than']) {
      mongoQuery.price = {
        ...mongoQuery.price,
        $gte: +query['price-bigger-than'],
      };
    }

    if (query['price-less-than']) {
      mongoQuery.price = {
        ...mongoQuery.price,
        $lte: +query['price-less-than'],
      };
    }

    if (query['year-bigger-than']) {
      mongoQuery.year = {
        ...mongoQuery.year,
        $gte: +query['year-bigger-than'],
      };
    }

    if (query['year-less-than']) {
      mongoQuery.year = { ...mongoQuery.year, $lte: +query['year-less-than'] };
    }

    if (genres) {
      mongoQuery.genres = { $in: genres };
    }
    const booksData = await this.mongoRepository.find(mongoQuery);
    const books = booksData.map((book) => new Book(book));
    return books;
  }

  public async postBook(book: BookDto) {
    const existingBook: BookPostgres = await this.bookRepository
      .createQueryBuilder('book')
      .where('LOWER(book.title) = LOWER(:title)', { title: book.title })
      .getOne();

    if (existingBook) {
      throw new HttpException(
        `Error: Book with the title [${book.title}] already exists in the system`,
        HttpStatus.CONFLICT,
      );
    }

    if (book.year < MIN_YEAR || book.year > MAX_YEAR) {
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

    if (!book.genres.every((genere) => GENRES.includes(genere))) {
      throw new HttpException('', HttpStatus.BAD_REQUEST);
    }

    const newBook: BookPostgres = {
      rawid: this.nextId++,
      ...book,
    };

    await Promise.all([
      this.bookRepository.save(newBook),
      this.mongoRepository.save(newBook),
    ]);

    return newBook.rawid;
  }

  public async getBookById(
    id: number,
    persistenceMethod: PersistenceMethod = PersistenceMethods.POSTGRES,
  ): Promise<Book> {
    let book: BookPostgres | BookMongo;

    if (persistenceMethod === PersistenceMethods.MONGO) {
      book = await this.mongoRepository.findOneBy({
        rawid: id,
      });
    } else {
      book = await this.bookRepository.findOneBy({
        rawid: id,
      });
    }

    if (!book) {
      throw new HttpException(
        `Error: no such Book with id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    const res: Book = new Book(book);

    return res;
  }

  public async deleteBookById(id: number): Promise<any> {
    const book: Book = await this.getBookById(id);

    await Promise.all([
      this.bookRepository.delete({ rawid: id }),
      this.mongoRepository.delete({ rawid: id }),
    ]);

    const totalBooks: number = await this.getTotalBooksCount();
    return { title: book.title, currentLength: totalBooks };
  }

  public async updateBookById(id: number, price: number): Promise<any> {
    if (price <= 0) {
      throw new HttpException(
        `Error: price update for book ${id} must be a positive integer`,
        HttpStatus.CONFLICT,
      );
    }
    const book: Book = await this.getBookById(id);

    await Promise.all([
      this.bookRepository.update({ rawid: id }, { price }),
      this.mongoRepository.update({ rawid: id }, { price }),
    ]);

    const oldPrice = book.price;
    return { title: book.title, oldPrice: oldPrice };
  }
}
