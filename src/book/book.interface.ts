import { Column } from 'typeorm';
import { BookPostgres } from './bookPostgres.entity';
import { BookMongo } from './bookMongo.entity';

export class Book {
  id: number;
  title: string;
  author: string;
  year: number;
  price: number;
  genres: string[];

  constructor(book: BookPostgres | BookMongo) {
    this.id = book.rawid;
    this.title = book.title;
    this.author = book.author;
    this.year = book.year;
    this.price = book.price;
    this.genres = book.genres;
  }
}

export abstract class MutualBookColumns {
  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  year: number;

  @Column()
  price: number;
}
