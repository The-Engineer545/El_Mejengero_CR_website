import {
  IsArray, IsBoolean, IsNumber, IsOptional,
  IsString, Min, MinLength,
} from 'class-validator';

export class CreateCamisetaDto {
  @IsString()
  @MinLength(2)
  nombre!: string;

  @IsString()
  @MinLength(2)
  descripcion!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  precio!: number;

  @IsString()
  @MinLength(2)
  categoria!: string;

  @IsString()
  @MinLength(2)
  imagen!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tallas?: string[];

  @IsOptional()
  @IsBoolean()
  playerVersion?: boolean;

  @IsOptional()
  @IsBoolean()
  disponible?: boolean;
}