import { IsNotEmpty, IsNumberString } from 'class-validator';

export class UpadateBookDto {
  @IsNotEmpty()
  @IsNumberString()
  id: number;

  @IsNotEmpty()
  @IsNumberString()
  price: number;
}
