# Navegación por páginas — primera etapa

Abrí la carpeta completa del proyecto en VS Code y ejecutá **Open with Live Server** sobre `index.html`. Navegá siempre desde la dirección HTTP que abre Live Server: abrir los HTML con doble clic no permite cargar el JSON de forma fiable.

## Archivos

| Archivo | Responsabilidad |
| --- | --- |
| `index.html` + `js/inicio.js` | Presentación del negocio y cuatro productos destacados, tomados del orden del JSON. |
| `catalogo.html` + `js/catalogo.js` | Catálogo completo, búsqueda y categorías. |
| `producto.html` + `js/producto.js` | Detalle de una camiseta según `?id=3`, selección de talla y compra. |
| `js/app.js` | Menú, carrito compartido, almacenamiento y checkout. |
| `js/productos.js` | Carga del JSON, tarjetas y parámetros de navegación. |
| `data/productos.json` | Datos originales de las camisetas. |
| `img/productos/` | Fotografías de las camisetas. |

Los HTML están en la raíz para compartir las mismas rutas de scripts, datos e imágenes. Cada página carga primero `app.js`, después `productos.js` y por último su script específico. Las tarjetas siguen construyéndose con `createElement()` y `appendChild()`.

El encabezado, pie, carrito y checkout tienen el mismo marcado en las tres páginas. Si se modifica una de esas secciones, se debe aplicar el cambio en las tres. El comportamiento compartido se modifica únicamente en `app.js`.

## Regresar y conservar la compra

Los filtros se guardan en la dirección: `catalogo.html?categoria=clubes&q=Barcelona`. Los enlaces de las camisetas transportan esos filtros a `producto.html?id=3&categoria=clubes&q=Barcelona`.

Se puede regresar con el botón Atrás del navegador o con **Volver al catálogo**. El enlace explícito también funciona si se abre una camiseta directamente o en otra pestaña; no depende de que exista una página anterior.

El carrito conserva la clave `carrito_elmejenguero` de `localStorage`. Las tres páginas deben abrirse desde el mismo servidor y puerto para compartirlo. Al regresar a una página guardada en la caché del navegador, se vuelve a leer el carrito. El carrito y el formulario de compra continúan siendo ventanas modales.

## Verificación

1. En Inicio, abrir el catálogo y comprobar que aparecen las diez camisetas.
2. Abrir el menú, elegir Clubes Europeos y buscar Barcelona.
3. Abrir la camiseta, elegir M y agregarla. Regresar con Atrás: deben conservarse la búsqueda, categoría y carrito.
4. Repetir usando **Volver al catálogo**. Recargar y comprobar los filtros.
5. Abrir `producto.html?id=3` directamente: debe funcionar y permitir volver al catálogo completo.
6. Abrir `producto.html?id=999`: debe mostrar un aviso y permitir regresar.
7. Comprobar en móvil el menú, buscador, detalle y carrito.
8. Abrir el checkout y comprobar sus validaciones. Preparar un pedido no borra el carrito.

Pruebas automatizadas de DOM con Node.js y jsdom (no necesitan instalar dependencias en el proyecto):

```bash
npm install --prefix /tmp/mejengero-tests jsdom
NODE_PATH=/tmp/mejengero-tests/node_modules node tests/navegacion.cjs
```

La suite simula el JSON, almacenamiento, eventos y apertura de WhatsApp. No envía pedidos ni sustituye la revisión visual en un navegador.

Los datos y fotografías existentes se conservan. Las tallas pendientes de Argentina y Real Madrid continúan deshabilitando su compra; las cinco fotografías ausentes en el catálogo original siguen pendientes de completar.
