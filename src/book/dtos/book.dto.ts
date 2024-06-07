import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BookDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly author: string;

  @IsNotEmpty()
  @IsNumber()
  readonly year: number;

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsNotEmpty()
  @IsArray()
  readonly genres: string[];
}
