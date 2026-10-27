import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  // Recibe usuario y contraseña. Devuelve un token si son correctos o lanza 401.
  async login(usuario: string, contrasena: string): Promise<{ access_token: string }> {
    const usuarioAdmin = this.config.getOrThrow<string>('ADMIN_USER');
    const hashAdmin = this.config.getOrThrow<string>('ADMIN_PASSWORD_HASH');

    // Se compara la contraseña siempre, aunque el usuario esté mal,
    // para que la respuesta tarde lo mismo y no revele cuál dato falló.
    const contrasenaValida = await bcrypt.compare(contrasena, hashAdmin);
    const usuarioValido = usuario === usuarioAdmin;

    if (!usuarioValido || !contrasenaValida) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    const access_token = await this.jwtService.signAsync({ sub: usuarioAdmin, rol: 'admin' });
    return { access_token };
  }
}
