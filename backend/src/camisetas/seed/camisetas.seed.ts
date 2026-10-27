import { Camiseta } from '../models/camiseta.model';

// Datos iniciales: las 12 camisetas de data/productos.json.
// Se cargan una sola vez, cuando la tabla está vacía.
export const CAMISETAS_INICIALES: Camiseta[] = [
  { id: 1, nombre: 'Argentina', categoria: 'Selecciones', descripcion: 'Camiseta Argentina 2022 · Campeón del Mundo', precio: 25000, imagen: 'img/productos/argentina.jpg', tallas: ['S', 'M', 'L', 'XL'], playerVersion: true, disponible: true, destacado: true },
  { id: 2, nombre: 'Real Madrid', categoria: 'Clubes', descripcion: 'Camiseta Real Madrid Temporada 2026 · Local', precio: 28000, imagen: 'img/productos/real-madrid.jpg', tallas: ['S', 'M', 'L', 'XL'], playerVersion: true, disponible: true, destacado: true },
  { id: 3, nombre: 'FC Barcelona', categoria: 'Clubes', descripcion: 'Camiseta del Barcelona Temporada 2026 · Local', precio: 18000, imagen: 'img/productos/barcelona.jpg', tallas: ['S', 'M', 'L'], playerVersion: true, disponible: true, destacado: true },
  { id: 4, nombre: 'AC Milan', categoria: 'Clubes', descripcion: 'Camiseta del Milan Temporada 2026 · Local', precio: 17000, imagen: 'img/productos/ac-milan.jpg', tallas: ['M', 'L', 'XL'], playerVersion: false, disponible: true, destacado: true },
  { id: 5, nombre: 'Costa Rica', categoria: 'Selecciones', descripcion: 'Selección Nacional · Local', precio: 18000, imagen: 'img/productos/costa-rica.jpg', tallas: ['S', 'M', 'L', 'XL'], playerVersion: true, disponible: true, destacado: false },
  { id: 6, nombre: 'Brasil Retro', categoria: 'Retro', descripcion: 'Edición Clásica · 1970', precio: 22000, imagen: 'img/productos/brasil-retro.jpg', tallas: ['S', 'M', 'L'], playerVersion: false, disponible: true, destacado: false },
  { id: 7, nombre: 'Italia Retro', categoria: 'Retro', descripcion: 'Edición Clásica · 2006', precio: 22000, imagen: 'img/productos/italia-retro.jpg', tallas: ['M', 'L', 'XL'], playerVersion: false, disponible: true, destacado: false },
  { id: 8, nombre: 'Saprissa', categoria: 'Nacionales', descripcion: 'Temporada 2026 · Local', precio: 15000, imagen: 'img/productos/saprissa.jpg', tallas: ['S', 'M', 'L', 'XL'], playerVersion: false, disponible: true, destacado: false },
  { id: 9, nombre: 'Liga Deportiva Alajuelense', categoria: 'Nacionales', descripcion: 'Temporada 2026 · Local', precio: 15000, imagen: 'img/productos/lda.jpg', tallas: ['M', 'L'], playerVersion: false, disponible: true, destacado: false },
  { id: 10, nombre: 'Manchester City', categoria: 'Clubes', descripcion: 'Temporada 2026 · Local', precio: 18000, imagen: 'img/productos/man-city.jpg', tallas: ['S', 'M', 'L', 'XL'], playerVersion: true, disponible: true, destacado: false },
  { id: 11, nombre: 'México', categoria: 'Selecciones', descripcion: 'Selección Nacional · Local', precio: 18000, imagen: 'img/productos/mexico.jpg', tallas: ['S', 'M', 'L', 'XL'], playerVersion: false, disponible: true, destacado: false },
  { id: 12, nombre: 'Juventus', categoria: 'Clubes', descripcion: 'Temporada 2026 · Local', precio: 18000, imagen: 'img/productos/juventus.jpg', tallas: ['S', 'M', 'L', 'XL'], playerVersion: false, disponible: true, destacado: false },
];
