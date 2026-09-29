const estadoProducto = document.querySelector("#estadoProducto");
const detalleProducto = document.querySelector("#detalleProducto");
const parametrosRegreso = parametrosFiltros().toString();
document.querySelector("#volverCatalogo").href = "catalogo.html" + (parametrosRegreso ? "?" + parametrosRegreso : "");

async function iniciarProducto() {
    const id = Number(new URLSearchParams(window.location.search).get("id"));
    if (!Number.isSafeInteger(id) || id <= 0) {
        estadoProducto.textContent = "Producto no encontrado. Podés volver al catálogo para elegir una camiseta.";
        return;
    }
    try {
        await cargarProductos();
        const producto = productos.find((p) => p.id === id);
        if (!producto) {
            estadoProducto.textContent = "Producto no encontrado. Podés volver al catálogo para elegir una camiseta.";
            return;
        }
        document.title = producto.nombre.trim() + " | El Mejenguero CR";
        document.querySelector("#productoImagen").src = producto.imagen;
        document.querySelector("#productoImagen").alt = producto.nombre;
        document.querySelector("#productoCategoria").textContent = producto.categoria;
        document.querySelector("#productoTitulo").textContent = producto.nombre;
        document.querySelector("#productoDescripcion").textContent = producto.descripcion;
        document.querySelector("#productoPrecio").textContent = "₡" + producto.precio.toLocaleString("es-CR");
        const tallas = obtenerTallas(producto);
        cargarTallas(document.querySelector("#productoTalla"), tallas);
        const btnAgregar = document.querySelector("#productoBtnAgregar");
        btnAgregar.disabled = tallas.length === 0;
        btnAgregar.textContent = tallas.length > 0 ? "Agregar al Carrito" : "Tallas pendientes";
        btnAgregar.classList.toggle("opacity-50", btnAgregar.disabled);
        btnAgregar.classList.toggle("cursor-not-allowed", btnAgregar.disabled);
        btnAgregar.addEventListener("click", () => agregarAlCarrito(producto.id, true, btnAgregar));
        estadoProducto.classList.add("hidden");
        detalleProducto.classList.remove("hidden");
    } catch (error) {
        console.error(error);
        mostrarErrorProductos(estadoProducto);
    }
}
iniciarProducto();
