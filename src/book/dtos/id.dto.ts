import { IsNumberString, IsNotEmpty, IsEnum } from 'class-validator';
import { PersistenceMethods } from './persistenceMethods.enum';

export class IdDtoWithPersistenceMethod {
  @IsNotEmpty()
  @IsNumberString()
  id: number;

  @IsNotEmpty()
  @IsEnum(PersistenceMethods, { each: true })
  persistenceMethod: string;
}

export class IdDto {
  @IsNotEmpty()
  @IsNumberString()
  id: number;
}
