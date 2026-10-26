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
        if (productos.length === 0) {
            estadoProducto.textContent =
                "El catálogo está vacío en este momento. Podés volver más tarde.";
            estadoProducto.classList.remove("hidden");
            detalleProducto.classList.add("hidden");
            return;
        }
        const producto = productos.find((p) => p.id === id);
        if (!producto) {
            estadoProducto.textContent = "Producto no encontrado. Podés volver al catálogo para elegir una camiseta.";
            estadoProducto.classList.remove("hidden");
            detalleProducto.classList.add("hidden");
            return;
        }
        document.title = producto.nombre.trim() + " | El Mejenguero CR";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", `${producto.nombre} - ${producto.descripcion}. Disponible en El Mejenguero CR.`);
        }
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute("content", `${producto.nombre} | El Mejenguero CR`);
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute("content", producto.descripcion);
        document.querySelector("#productoImagen").src = producto.imagen;
        document.querySelector("#productoImagen").alt = producto.nombre;
        document.querySelector("#productoCategoria").textContent = producto.categoria;
        document.querySelector("#productoTitulo").textContent = producto.nombre;
        document.querySelector("#productoDescripcion").textContent = producto.descripcion;
        document.querySelector("#productoPrecio").textContent = "₡" + producto.precio.toLocaleString("es-CR");
        const tallas = obtenerTallas(producto);
        cargarTallas(document.querySelector("#productoTalla"), tallas);
        const agotado = !estaDisponible(producto);

        const estado = document.querySelector("#productoEstado");
        estado.textContent = (producto.playerVersion ? "Versión Player · " : "") + (agotado ? "Agotada" : "Disponible");
        estado.classList.add(agotado ? "text-red-600" : "text-green-600");

        const btnAgregar = document.querySelector("#productoBtnAgregar");
        btnAgregar.disabled = agotado || tallas.length === 0;
        if (agotado) {
            btnAgregar.textContent = "Agotada";
        } else {
            btnAgregar.textContent = tallas.length > 0 ? "Agregar al Carrito" : "Tallas pendientes";
        }
        btnAgregar.classList.toggle("opacity-50", btnAgregar.disabled);
        btnAgregar.classList.toggle("cursor-not-allowed", btnAgregar.disabled);
        btnAgregar.addEventListener("click", () => agregarAlCarrito(producto.id, true, btnAgregar));
        estadoProducto.classList.add("hidden");
        detalleProducto.classList.remove("hidden");
    } catch (error) {
        console.error(error);
        detalleProducto.classList.add("hidden");
        estadoProducto.classList.remove("hidden");
        mostrarErrorProductos(estadoProducto, iniciarProducto);
    }
}
iniciarProducto();
