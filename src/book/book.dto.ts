import { IsNotEmpty } from 'class-validator';

export class BookDto {
  @IsNotEmpty()
  readonly title: string;
  @IsNotEmpty()
  readonly author: string;
  @IsNotEmpty()
  readonly year: number;
  @IsNotEmpty()
  readonly price: number;
  @IsNotEmpty()
  readonly genres: string[];
}
