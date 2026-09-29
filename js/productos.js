// Datos y tarjetas compartidos por inicio y catálogo.
async function cargarProductos() {
    const respuesta = await fetch("data/productos.json");
    if (!respuesta.ok) throw new Error("No se pudo cargar el catálogo");
    productos = await respuesta.json();
    if (!Array.isArray(productos)) throw new Error("El catálogo no es una lista");
    return productos;
}

function mostrarErrorProductos(contenedor) {
    contenedor.replaceChildren();
    const mensaje = document.createElement("p");
    mensaje.className = "text-red-500 col-span-full font-bold text-center py-10";
    mensaje.setAttribute("role", "alert");
    mensaje.textContent = 'No pudimos cargar los productos. Recargá la página. Si estás trabajando localmente, abrí el proyecto con Live Server.';
    contenedor.appendChild(mensaje);
}

function filtrosDeURL() {
    const parametros = new URLSearchParams(window.location.search);
    const categoria = (parametros.get("categoria") || "todas").trim().toLowerCase();
    return {
        categoria: ["todas", "nacionales", "selecciones", "clubes", "retro"].includes(categoria) ? categoria : "todas",
        q: parametros.get("q") || ""
    };
}

function parametrosFiltros() {
    const filtros = filtrosDeURL();
    const parametros = new URLSearchParams();
    if (filtros.categoria !== "todas") parametros.set("categoria", filtros.categoria);
    if (filtros.q) parametros.set("q", filtros.q);
    return parametros;
}

function enlaceProducto(id) {
    const parametros = parametrosFiltros();
    parametros.set("id", id);
    return "producto.html?" + parametros.toString();
}

function renderizarProductos(listaProductos) {
    productosGrid.innerHTML = "";

    listaProductos.forEach((producto) => {
        // --- Tarjeta principal ---
        const article = document.createElement("article");
        article.className =
            "bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition flex flex-col justify-between";

        // --- Contenedor de imagen (clickeable) ---
        const divImagen = document.createElement("a");
        divImagen.className =
            "bg-gray-100 rounded-xl overflow-hidden relative h-64 flex items-center justify-center cursor-pointer group";
        divImagen.href = enlaceProducto(producto.id);
        divImagen.setAttribute("aria-label", "Ver detalles de " + producto.nombre);

        const img = document.createElement("img");
        img.src = producto.imagen;
        img.alt = producto.nombre;
        img.className =
            "object-cover w-full h-full mix-blend-multiply group-hover:scale-110 transition-transform duration-300";

        const spanCategoria = document.createElement("span");
        spanCategoria.className =
            "absolute top-3 left-3 bg-black text-white px-3 py-1 rounded-full text-xs font-bold uppercase z-10";
        spanCategoria.textContent = producto.categoria;

        divImagen.appendChild(img);
        divImagen.appendChild(spanCategoria);

        if (producto.playerVersion) {
            const spanPlayer = document.createElement("span");
            spanPlayer.className =
                "absolute top-3 right-3 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold uppercase z-10";
            spanPlayer.textContent = "Player";
            divImagen.appendChild(spanPlayer);
        }

        const divOverlay = document.createElement("div");
        divOverlay.className =
            "absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity";
        const spanVerDetalle = document.createElement("span");
        spanVerDetalle.className = "bg-white text-black px-4 py-2 rounded-full font-bold text-sm";
        spanVerDetalle.textContent = "Ver Detalles";
        divOverlay.appendChild(spanVerDetalle);
        divImagen.appendChild(divOverlay);

        // --- Textos de la tarjeta ---
        const divInfo = document.createElement("div");

        const h3 = document.createElement("h3");
        h3.className = "text-lg font-black mt-4";
        const enlaceTitulo = document.createElement("a");
        enlaceTitulo.href = enlaceProducto(producto.id);
        enlaceTitulo.textContent = producto.nombre;
        h3.appendChild(enlaceTitulo);

        const pDesc = document.createElement("p");
        pDesc.className = "text-gray-500 text-sm mt-1";
        pDesc.textContent = producto.descripcion;

        const pPrecio = document.createElement("p");
        pPrecio.className = "text-xl font-black mt-3";
        pPrecio.textContent = "₡" + producto.precio.toLocaleString("es-CR");

        // --- Selector de talla ---
        const divTalla = document.createElement("div");
        divTalla.className = "mt-3";

        const labelTalla = document.createElement("label");
        labelTalla.className = "text-xs text-gray-500 font-bold uppercase";
        labelTalla.textContent = "Talla:";

        const selectTalla = document.createElement("select");
        selectTalla.id = "talla-" + producto.id;
        labelTalla.htmlFor = selectTalla.id;
        selectTalla.className =
            "block w-full mt-1 border-gray-300 rounded-md text-sm p-2 bg-gray-50 border";
        const tallas = obtenerTallas(producto);
        cargarTallas(selectTalla, tallas);

        divTalla.appendChild(labelTalla);
        divTalla.appendChild(selectTalla);

        divInfo.appendChild(divImagen);
        divInfo.appendChild(h3);
        divInfo.appendChild(pDesc);
        divInfo.appendChild(pPrecio);
        divInfo.appendChild(divTalla);

        // --- Botón Agregar al Carrito ---
        const btnAgregar = document.createElement("button");
        btnAgregar.className =
            "bg-black text-white w-full px-4 py-3 rounded-full mt-4 font-bold uppercase text-sm hover:bg-gray-800 transition";
        btnAgregar.textContent = tallas.length > 0 ? "Agregar al Carrito" : "Tallas pendientes";
        btnAgregar.disabled = tallas.length === 0;
        if (btnAgregar.disabled) btnAgregar.classList.add("opacity-50", "cursor-not-allowed");
        btnAgregar.addEventListener("click", () => agregarAlCarrito(producto.id, false, btnAgregar));

        article.appendChild(divInfo);
        article.appendChild(btnAgregar);
        productosGrid.appendChild(article);
    });
}

