import { IsNumberString, IsNotEmpty } from 'class-validator';

export class IdDto {
  @IsNotEmpty()
  @IsNumberString()
  id: number;
}
