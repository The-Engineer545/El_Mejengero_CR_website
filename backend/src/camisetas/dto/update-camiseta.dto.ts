import {
  IsArray, IsBoolean, IsNumber, IsOptional,
  IsString, Min, MinLength,
} from 'class-validator';

export class UpdateCamisetaDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  nombre?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  descripcion?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  precio?: number;

  @IsOptional()
  @IsString()
  @MinLength(2)
  categoria?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  imagen?: string;

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