# El Mejengero CR

Landing page y tienda demostrativa con HTML5, Tailwind CSS, JavaScript y JSON.

## Ejecutar

Abrir la carpeta en VS Code y usar Live Server, o ejecutar `python -m http.server 8000` y visitar `http://localhost:8000`. La carga con `fetch()` necesita HTTP; no abrir los HTML directamente con `file://`.

## Páginas

- `index.html`: inicio y tres productos destacados.
- `catalogo.html`: catálogo completo; `?categoria=clubes`, `selecciones`, `nacionales` o `retro` filtra los productos.
- `producto.html?id=3`: detalle obtenido del JSON, talla, versión y confirmación de agregado.
- `carrito.html`: cantidades, eliminación, subtotal y enlace al checkout.
- `checkout.html`: formulario según entrega, validación y resumen para revisar en WhatsApp.

El encabezado, menú y pie mantienen el mismo diseño en todos los HTML. Al cambiar estos elementos, actualizar las cinco páginas. `js/app.js` comparte las funciones y usa `data-pagina` para inicializar cada vista; `css/estilos.css` complementa Tailwind.

## Datos y pendientes del equipo

El archivo `data/productos.json` conserva los datos y rutas actuales. La interfaz no inventa existencias: para agregar una camiseta se necesita `disponible: true` y un arreglo `tallas` no vacío. Player requiere `playerVersion: true`. Argentina y Real Madrid todavía necesitan confirmar esos campos.

Faltan las fotografías de Brasil Retro, Italia Retro, Saprissa, Alajuelense y Manchester City. Se muestra un aviso mientras se completan en `img/productos/`. Las cinco fotografías existentes mantienen sus extensiones originales, incluyendo `.jpeg`, `.webp` y `.avif`.

La guía de tallas permite consultar a la tienda; falta recibir una tabla de medidas real. El logo sigue representado por las iniciales EM hasta que llegue el archivo definitivo. Cuenta y favoritos están deshabilitados con aviso de próxima disponibilidad.

## Carrito y pedido

`localStorage` utiliza `mejengero.carrito.v1`. Cada entrada guarda `id`, `talla`, `version` y `cantidad` (1 a 99). El precio se obtiene del JSON al cargar cada página. Las variantes de talla/versión se mantienen separadas. El subtotal excluye envío, que debe confirmar la tienda. El catálogo actual tiene un precio por camiseta, sin tarifa diferenciada para Player.

El checkout admite entrega personal en Nicoya/Santa Cruz o Correos de Costa Rica. La identificación para Correos valida 9 a 12 dígitos; es validación de formato, no verificación oficial. El teléfono valida 8 dígitos. El pedido se prepara para WhatsApp; el comprador debe enviarlo. No hay cobro automático ni confirmación de pago. Visa/Mastercard queda deshabilitado. El contacto del sitio es 8898-0038; el mensaje de comprobante conserva 6342-5133 del draft.

## Comprobación manual

1. Ver los destacados y entrar al catálogo; cambiar categorías.
2. Abrir Barcelona, elegir talla y Fan/Player; agregar al carrito.
3. Agregar otra talla y comprobar que sea una línea diferente.
4. Cambiar cantidad, recargar y eliminar una línea; verificar subtotal.
5. Abrir checkout y cambiar entre Correos y entrega personal; comprobar campos obligatorios.
6. Revisar el resumen en WhatsApp con datos de prueba, sin enviar un pedido real.
7. Probar un ID inexistente, carrito vacío, fotos faltantes y ancho de 390 px.
