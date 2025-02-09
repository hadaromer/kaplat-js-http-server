import { DataSource } from 'typeorm';
import { BookPostgres } from './bookPostgres.entity';
import { BookMongo } from './bookMongo.entity';

export const bookProviders = [
  {
    provide: 'BOOK_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(BookPostgres),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'BOOK_MONGO_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getMongoRepository(BookMongo),
    inject: ['MONGO_DATA_SOURCE'],
  },
];
