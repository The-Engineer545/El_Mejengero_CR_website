import { Injectable, NotFoundException } from '@nestjs/common';
import type { Camiseta } from './models/camiseta.model';
import { CreateCamisetaDto } from './dto/create-camiseta.dto';
import { UpdateCamisetaDto } from './dto/update-camiseta.dto';

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

  // Recibe id y cambios. Devuelve el registro actualizado.
  update(id: number, datos: UpdateCamisetaDto): Camiseta {
    const camiseta = this.camisetas.find((item) => item.id === id);
    if (!camiseta) {
      throw new NotFoundException('Camiseta no encontrada');
    }
    const cambios = Object.fromEntries(
      Object.entries(datos).filter(
        ([clave, valor]) => valor !== undefined && valor !== null,
      ),
    );
    Object.assign(camiseta, cambios);
    return camiseta;
  }

  // Recibe el id. Elimina el registro y devuelve confirmación.
  remove(id: number): { mensaje: string } {
    const indice = this.camisetas.findIndex((item) => item.id === id);
    if (indice === -1) {
      throw new NotFoundException('Camiseta no encontrada');
    }
    this.camisetas.splice(indice, 1);
    return { mensaje: 'Camiseta eliminada' };
  }
}
