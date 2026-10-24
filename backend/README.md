# Backend de El Mejengero CR

Avance del Proyecto 2 para el Laboratorio 4 de Programación III.
Repositorio: https://github.com/The-Engineer545/El_Mejengero_CR_website

## Instalar y ejecutar

1. Abrir la carpeta `El_Mejengero_CR_website` en VS Code.
2. En la terminal de la raíz ejecutar:

```bash
cd backend
npm ci
npm run build
npm run start:dev
```

- API local: http://localhost:3000/camisetas
- Almacenamiento: arreglo en memoria, vacío al iniciar.
- Los cambios se pierden al reiniciar el servidor.
- El frontend aún consulta `data/productos.json`.

## Recurso

Recurso: `camisetas`.

- `id` lo genera el servidor.
- Obligatorios: `nombre`, `descripcion`, `precio`, `categoria`, `imagen`.
- Opcionales: `tallas`, `playerVersion`, `disponible`.

## Endpoints

- `GET /camisetas`: listar; 200.
- `POST /camisetas`: crear; 201.
- `PATCH /camisetas/:id`: modificar parcialmente; 200.
- `DELETE /camisetas/:id`: eliminar; 200.

Datos inválidos: 400. Id inexistente al cambiar o borrar: 404.

## Pruebas

- Importar `postman/El Mejenguero CR.postman_collection.json`.
- `baseUrl`: http://localhost:3000.
- Actualizar `idCamiseta` con el id devuelto por POST.
- Las capturas están en `evidencias/`.

## Versiones

- Node: v24.22.1
- npm: 11.19.1

## Ejemplo de POST

```json
{
  "nombre": "Costa Rica",
  "descripcion": "Selección Nacional · Local",
  "precio": 18000,
  "categoria": "Selecciones",
  "imagen": "img/productos/costa-rica.jpg",
  "tallas": ["S", "M", "L", "XL"],
  "playerVersion": true,
  "disponible": true
}
```

## Ejemplo de PATCH

```json
{ "precio": 19500 }
```

## Resultados de las pruebas
| Caso | Solicitud | Resultado |
|---|---|---|
| A | GET antes de crear | 200 y [] |
| B | POST completo de Costa Rica | 201 y objeto con id |
| C | GET después de POST | 200; aparece el id creado |
| D | PATCH solo precio y luego GET | 200; precio 19500 y demás datos conservados |
| E | PATCH con disponible false y luego GET | 200; disponible se conserva en false |
| F | POST sin nombre | 400; no se crea el registro |
| G | POST con precio -1 | 400; no se crea el registro |
| H | PATCH con tallas "M" | 400; tallas debe ser un arreglo |
| I | PATCH /camisetas/999999 | 404; Camiseta no encontrada |
| J | DELETE del id creado y luego GET | 200 con mensaje; el registro desaparece |
| K | DELETE del mismo id otra vez | 404; no elimina otro registro |
| L | PATCH /camisetas/abc | 400; el id debe ser un entero |
