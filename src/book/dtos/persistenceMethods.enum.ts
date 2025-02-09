export enum PersistenceMethods {
  POSTGRES = 'POSTGRES',
  MONGO = 'MONGO',
}

export type PersistenceMethod = keyof typeof PersistenceMethods;
