import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ObjectId } from 'mongodb';
import { MutualBookColumns } from './book.interface';

@Entity('books')
export class BookMongo extends MutualBookColumns {
  @ObjectIdColumn({ select: false })
  _id: ObjectId;

  @Column()
  rawid: number;

  @Column()
  genres: string[];
}
