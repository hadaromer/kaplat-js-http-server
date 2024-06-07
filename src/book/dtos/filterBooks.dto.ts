import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterBooksDto {
  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  'price-bigger-than'?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  'price-less-than'?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  'year-bigger-than'?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  'year-less-than'?: number;

  @IsOptional()
  @IsString()
  genres?: string;
}
