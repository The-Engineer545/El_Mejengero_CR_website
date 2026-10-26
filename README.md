# El Mejenguero CR

El Mejenguero CR es una tienda en línea (e-commerce) dedicada a la venta de camisetas de fútbol en Costa Rica. Ofrece una amplia variedad de opciones, incluyendo camisetas de selecciones nacionales, clubes europeos, equipos nacionales y ediciones retro/clásicas en versiones fan y player.

Este proyecto web está diseñado para brindar una experiencia de usuario rápida y amigable, con un catálogo interactivo, carrito de compras integrado y un proceso de compra que redirige los pedidos directamente a través de WhatsApp.

## 🚀 Proyecto en Vivo (Prueba)

Puedes ver el proyecto y probar todas sus funcionalidades en vivo aquí:
**[El Mejenguero CR - Firebase Hosting](https://el-mejenguero-cr.web.app/)**

El sitio publicado solo cambia cuando los cambios se fusionan en `main` y se vuelven a publicar con Firebase.

## Características Principales

*   **Catálogo de Productos Dinámico:** Los productos se cargan desde `data/productos.json`, lo que facilita actualizar el inventario sin modificar el código HTML.
*   **Filtrado por Categorías:** Los usuarios pueden filtrar las camisetas por "Nacionales", "Selecciones", "Clubes Europeos" y "Retro / Clásicas". Los filtros se conservan en la URL, así que un enlace con `?categoria=` y `?q=` se puede compartir.
*   **Búsqueda Integrada:** Busca equipos o camisetas sin importar tildes, mayúsculas ni espacios de más (por ejemplo, `mexico` encuentra "México"). Incluye un botón "Limpiar filtros".
*   **Disponibilidad:** Cada camiseta puede marcarse como agotada con `"disponible": false` en el JSON. En ese caso el botón dice "Agotada" y no se puede comprar. Si el campo falta, la camiseta se considera disponible.
*   **Carrito de Compras:** Permite agregar productos por talla, cambiar cantidades (máximo 10 por talla), ver el total y eliminar artículos. El carrito se guarda en el navegador (`localStorage`) y se valida al cargar: el precio, el nombre y la imagen siempre se toman del catálogo, y se descartan los productos agotados, inexistentes o con tallas que ya no se venden.
*   **Integración con WhatsApp:** El "checkout" recopila nombre, cédula (9 dígitos) y teléfono (8 dígitos), y genera un mensaje preformateado para enviar el pedido al WhatsApp de la tienda.
*   **Diseño Responsivo y Accesible:** Funciona en celulares, tablets y computadoras (Tailwind CSS). El menú, el carrito y el formulario de compra se cierran con `Esc` o haciendo clic afuera, y están marcados como diálogos para lectores de pantalla.

## Tecnologías Utilizadas

*   **HTML5:** Estructura semántica de las páginas (`index.html`, `catalogo.html`, `producto.html`).
*   **JavaScript (Vanilla):** Lógica del lado del cliente para manejar el catálogo, el carrito, las interacciones del usuario y la conexión con WhatsApp.
*   **Tailwind CSS:** Framework de CSS utilizado a través de su CDN para un diseño rápido, moderno y completamente responsivo.
*   **JSON:** Almacenamiento de los datos de los productos (`data/productos.json`).
*   **Firebase Hosting:** Publicación del sitio de prueba (`firebase.json`).
*   **NestJS (backend, en desarrollo):** API de camisetas del Laboratorio 4, descrita en la sección [Backend](#backend-en-desarrollo).

## Estructura del Proyecto

*   `index.html`: Página de inicio con banner y productos destacados.
*   `catalogo.html`: Página principal de la tienda donde se muestran todos los productos, la búsqueda y los filtros.
*   `producto.html`: Página de detalle de un producto (`?id=`), con talla, versión Player y disponibilidad.
*   `js/`: Carpeta que contiene los scripts de JavaScript.
    *   `app.js`: Lógica general: menú, carrito, `localStorage`, ventanas (carrito y checkout) y mensaje de WhatsApp.
    *   `productos.js`: Lógica compartida para cargar el catálogo, mostrar errores y dibujar las tarjetas.
    *   `catalogo.js`: Lógica específica del catálogo (filtros, búsqueda y "Limpiar filtros").
    *   `inicio.js`: Lógica de la página de inicio (productos destacados).
    *   `producto.js`: Lógica de la página de detalle de un producto.
*   `data/`: Carpeta que contiene los datos.
    *   `productos.json`: Catálogo de productos en formato JSON.
*   `img/productos/`: Fotos locales de las camisetas. El banner de la página de inicio usa una imagen externa de Unsplash.
*   `firebase.json`: Configuración de Firebase Hosting (ignora la carpeta `backend/`).
*   `backend/`: API en NestJS (ver la sección de Backend).

## Cómo Agregar o Editar una Camiseta

Edita `data/productos.json`. Cada camiseta tiene esta forma:

```json
{
  "id": 14,
  "nombre": "Costa Rica",
  "categoria": "Selecciones",
  "descripcion": "Selección Nacional · Local",
  "precio": 18000,
  "imagen": "img/productos/costa-rica.jpg",
  "tallas": ["S", "M", "L", "XL"],
  "playerVersion": false,
  "disponible": true,
  "destacado": false
}
```

*   `id`: número entero único.
*   `categoria`: `Selecciones`, `Clubes`, `Nacionales` o `Retro`.
*   `tallas`: si falta o está vacío, el botón dice "Tallas pendientes" y no se puede comprar.
*   `disponible`: con `false` la camiseta aparece como "Agotada".
*   `destacado`: con `true` aparece en el inicio. Si ninguna está marcada, se muestran las primeras cuatro.

## Cómo Ejecutar el Proyecto Localmente

Debido a que el proyecto carga los productos mediante una petición `fetch()` a un archivo JSON local, **es necesario ejecutarlo a través de un servidor web local**. Si abres el HTML directamente (`file://`), el navegador bloquea la lectura del JSON y el sitio muestra un mensaje de error con el botón "Reintentar".

1.  **Clona o descarga el repositorio:**
    Obtén los archivos del proyecto en tu computadora.

2.  **Usa un servidor local.** La opción recomendada, con Node.js instalado, es ejecutar en la terminal, dentro de la carpeta donde está `index.html`:

    ```bash
    npx http-server -c-1
    ```

    Luego abre `http://localhost:8080` en tu navegador.

    **Importante:** el `-c-1` desactiva la caché. Sin esa bandera, `http-server` le dice al navegador que guarde los archivos durante 1 hora, y puedes seguir viendo un `app.js` viejo aunque ya lo hayas cambiado. Después de editar, usa `Ctrl+Shift+R` para recargar sin caché.

    Otras opciones:
    *   **VS Code con Live Server:** Instala la extensión "Live Server", haz clic derecho sobre `index.html` y selecciona "Open with Live Server".
    *   **Python:** Ejecuta `python3 -m http.server` en la carpeta del proyecto.

3.  **¡Listo!** Explora la tienda, prueba el carrito y los filtros.

## Backend (en desarrollo)

La carpeta `backend/` contiene una API de camisetas hecha con NestJS para el Laboratorio 4 de Programación III. **El sitio todavía no la usa:** el frontend lee `data/productos.json`.

Para ejecutarla:

```bash
cd backend
npm ci
npm run build
npm run start:dev
```

La API queda en `http://localhost:3000/camisetas`. Por ahora los datos se guardan en memoria y se pierden al reiniciar el servidor. Los endpoints, las pruebas de Postman y las versiones de Node y npm están en [`backend/README.md`](backend/README.md).

## Pendiente

*   Conectar el frontend con la API del backend.
*   Reemplazar el almacenamiento en memoria por una base de datos.
*   Consulta individual de una camiseta (`GET /camisetas/:id`) y protección de las operaciones administrativas.
