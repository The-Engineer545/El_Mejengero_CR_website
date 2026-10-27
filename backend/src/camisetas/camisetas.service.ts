import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Camiseta } from './models/camiseta.model';
import { CreateCamisetaDto } from './dto/create-camiseta.dto';
import { UpdateCamisetaDto } from './dto/update-camiseta.dto';
import { CAMISETAS_INICIALES } from './seed/camisetas.seed';

@Injectable()
export class CamisetasService implements OnModuleInit {
  constructor(
    @InjectRepository(Camiseta)
    private readonly camisetasRepository: Repository<Camiseta>,
  ) {}

  // Se ejecuta al arrancar. Si la tabla está vacía, carga las 12 camisetas.
  async onModuleInit(): Promise<void> {
    const total = await this.camisetasRepository.count();
    if (total === 0) {
      await this.camisetasRepository.save(CAMISETAS_INICIALES);
    }
  }

  // Sin entradas. Devuelve todas las camisetas ordenadas por id.
  findAll(): Promise<Camiseta[]> {
    return this.camisetasRepository.find({ order: { id: 'ASC' } });
  }

  // Recibe el id. Devuelve la camiseta o lanza 404 si no existe.
  async findOne(id: number): Promise<Camiseta> {
    const camiseta = await this.camisetasRepository.findOneBy({ id });
    if (!camiseta) {
      throw new NotFoundException('Camiseta no encontrada');
    }
    return camiseta;
  }

  // Recibe datos validados. Guarda y devuelve el nuevo registro.
  create(datos: CreateCamisetaDto): Promise<Camiseta> {
    const camiseta = this.camisetasRepository.create({
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      precio: datos.precio,
      categoria: datos.categoria,
      imagen: datos.imagen,
      tallas: datos.tallas ?? [],
      playerVersion: datos.playerVersion ?? false,
      disponible: datos.disponible ?? true,
      destacado: datos.destacado ?? false,
    });
    return this.camisetasRepository.save(camiseta);
  }

  // Recibe id y cambios. Devuelve el registro actualizado.
  async update(id: number, datos: UpdateCamisetaDto): Promise<Camiseta> {
    const camiseta = await this.findOne(id);
    const cambios = Object.fromEntries(
      Object.entries(datos).filter(
        ([, valor]) => valor !== undefined && valor !== null,
      ),
    );
    Object.assign(camiseta, cambios);
    return this.camisetasRepository.save(camiseta);
  }

  // Recibe el id. Elimina el registro y devuelve confirmación.
  async remove(id: number): Promise<{ mensaje: string }> {
    const camiseta = await this.findOne(id);
    await this.camisetasRepository.remove(camiseta);
    return { mensaje: 'Camiseta eliminada' };
  }
}
