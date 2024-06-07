import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpadateBookDto {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  id: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  price: number;
}
