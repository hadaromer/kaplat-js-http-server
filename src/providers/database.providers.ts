import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'postgres',
        port: 5432,
        username: 'postgres',
        password: 'docker',
        database: 'books',
        entities: [__dirname + '/../**/*Postgres.entity{.ts,.js}'],
        synchronize: false,
      });

      return dataSource.initialize();
    },
  },
  {
    provide: 'MONGO_DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mongodb',
        host: 'mongo',
        port: 27017,
        database: 'books',
        useNewUrlParser: true,
        useUnifiedTopology: true,
        entities: [__dirname + '/../**/*Mongo.entity{.ts,.js}'],
        synchronize: false,
      });

      return dataSource.initialize();
    },
  },
];
