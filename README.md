# El Mejenguero CR

El Mejenguero CR es una tienda en línea (e-commerce) dedicada a la venta de camisetas de fútbol en Costa Rica. Ofrece una amplia variedad de opciones, incluyendo camisetas de selecciones nacionales, clubes europeos, equipos nacionales y ediciones retro/clásicas en versiones fan y player.

Este proyecto web está diseñado para brindar una experiencia de usuario rápida y amigable, con un catálogo interactivo, carrito de compras integrado y un proceso de compra que redirige los pedidos directamente a través de WhatsApp.

## Características Principales

*   **Catálogo de Productos Dinámico:** Los productos se cargan dinámicamente desde un archivo JSON, lo que facilita la actualización del inventario sin necesidad de modificar el código HTML.
*   **Filtrado por Categorías:** Los usuarios pueden filtrar fácilmente las camisetas por categorías como "Nacionales", "Selecciones", "Clubes Europeos" y "Retro / Clásicas".
*   **Búsqueda Integrada:** Permite a los usuarios buscar equipos o camisetas específicas de forma rápida.
*   **Carrito de Compras:** Un carrito de compras funcional que permite agregar productos, seleccionar tallas, ver el total y gestionar los artículos antes de finalizar la compra.
*   **Integración con WhatsApp:** El proceso de "checkout" recopila los datos básicos del usuario (con validación de cédula y teléfono) y genera un mensaje preformateado para enviar el pedido directamente al WhatsApp de la tienda.
*   **Diseño Responsivo:** La interfaz está adaptada para funcionar perfectamente en dispositivos móviles, tablets y computadoras de escritorio, utilizando Tailwind CSS.

## Tecnologías Utilizadas

*   **HTML5:** Estructura semántica de las páginas (`index.html`, `catalogo.html`, `producto.html`).
*   **JavaScript (Vanilla):** Lógica del lado del cliente para manejar el catálogo, el carrito, las interacciones del usuario y la conexión con WhatsApp.
*   **Tailwind CSS:** Framework de CSS utilizado a través de su CDN para un diseño rápido, moderno y completamente responsivo.
*   **JSON:** Almacenamiento de los datos de los productos (`data/productos.json`).

## Estructura del Proyecto

*   `index.html`: Página de inicio con banners destacados y productos principales.
*   `catalogo.html`: Página principal de la tienda donde se muestran todos los productos y opciones de filtrado.
*   `producto.html`: Página de detalle para un producto individual, permitiendo seleccionar talla y agregar al carrito.
*   `js/`: Carpeta que contiene los scripts de JavaScript.
    *   `app.js`: Lógica general, manejo del carrito, modales y checkout por WhatsApp.
    *   `productos.js`: Lógica compartida para cargar y renderizar los productos.
    *   `catalogo.js`: Lógica específica para la página del catálogo (filtros, búsqueda).
    *   `inicio.js`: Lógica específica para la página de inicio.
    *   `producto.js`: Lógica específica para mostrar los detalles de un solo producto.
*   `data/`: Carpeta que contiene los datos.
    *   `productos.json`: Base de datos de los productos en formato JSON.
*   `img/`: Carpeta para imágenes locales (si se utilizan, actualmente el proyecto usa URLs externas).

## Cómo Ejecutar el Proyecto Localmente

Debido a que el proyecto carga los productos mediante una petición `fetch()` a un archivo JSON local, **es necesario ejecutarlo a través de un servidor web local** para evitar errores de CORS (Cross-Origin Resource Sharing).

1.  **Clona o descarga el repositorio:**
    Obtén los archivos del proyecto en tu computadora.

2.  **Usa un servidor local:**
    Puedes usar varias herramientas para esto. Algunas opciones populares:
    *   **VS Code con Live Server:** Instala la extensión "Live Server" en Visual Studio Code, haz clic derecho sobre `index.html` y selecciona "Open with Live Server".
    *   **Node.js (http-server):** Si tienes Node.js instalado, abre tu terminal en la carpeta del proyecto y ejecuta: `npx http-server`. Luego abre la URL proporcionada en tu navegador (usualmente `http://localhost:8080`).
    *   **Python:** Si tienes Python instalado, abre tu terminal en la carpeta y ejecuta `python3 -m http.server` (o `python -m SimpleHTTPServer` para Python 2).

3.  **¡Listo!** Explora la tienda, prueba el carrito y los filtros.
