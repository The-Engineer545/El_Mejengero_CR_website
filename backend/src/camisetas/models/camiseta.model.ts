export interface Camiseta {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen: string;
  tallas?: string[];
  playerVersion?: boolean;
  disponible?: boolean;
}