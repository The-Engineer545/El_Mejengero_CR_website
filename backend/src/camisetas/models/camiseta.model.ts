import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// Entidad: cada propiedad es una columna de la tabla "camisetas".
@Entity('camisetas')
export class Camiseta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 255 })
  descripcion: string;

  // MySQL devuelve los DECIMAL como texto; el transformer los pasa a número.
  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: {
      to: (valor: number) => valor,
      from: (valor: string) => Number(valor),
    },
  })
  precio: number;

  @Column({ length: 50 })
  categoria: string;

  // Texto largo: guarda una ruta corta (img/productos/x.jpg) o una foto
  // subida desde el panel, que se almacena como texto base64 (mucho más largo).
  @Column('mediumtext')
  imagen: string;

  // Guarda el arreglo como texto JSON, por ejemplo ["S","M","L"].
  @Column('simple-json')
  tallas: string[];

  @Column({ default: false })
  playerVersion: boolean;

  @Column({ default: true })
  disponible: boolean;

  @Column({ default: false })
  destacado: boolean;
}
