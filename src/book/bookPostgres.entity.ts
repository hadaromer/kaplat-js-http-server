import { Entity, Column, PrimaryColumn } from 'typeorm';
import { MutualBookColumns } from './book.interface';

@Entity('books')
export class BookPostgres extends MutualBookColumns {
  @PrimaryColumn()
  rawid: number;

  @Column({
    type: 'varchar',
    length: 255,
    transformer: {
      from: (value) => JSON.parse(value),
      to: (value) => JSON.stringify(value),
    },
  })
  genres: string[];
}
