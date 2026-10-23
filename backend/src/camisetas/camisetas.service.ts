import { Injectable } from '@nestjs/common';
import type { Camiseta } from './models/camiseta.model';
import { CreateCamisetaDto } from './dto/create-camiseta.dto';

@Injectable()
export class CamisetasService {
  private camisetas: Camiseta[] = [];
  private siguienteId = 1;

  // Sin entradas. Devuelve el arreglo actual de camisetas.
  findAll(): Camiseta[] {
    return this.camisetas;
  }

  // Recibe datos validados. Guarda y devuelve el nuevo registro.
  create(datos: CreateCamisetaDto): Camiseta {
    const camiseta: Camiseta = {
      id: this.siguienteId++,
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      precio: datos.precio,
      categoria: datos.categoria,
      imagen: datos.imagen,
      tallas: datos.tallas ?? [],
      playerVersion: datos.playerVersion ?? false,
      disponible: datos.disponible ?? true,
    };
    this.camisetas.push(camiseta);
    return camiseta;
  }
}
