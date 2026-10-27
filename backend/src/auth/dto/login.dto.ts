import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  usuario!: string;

  // bcrypt solo usa los primeros 72 bytes de la contraseña.
  @IsString()
  @IsNotEmpty()
  @MaxLength(72)
  contrasena!: string;
}
