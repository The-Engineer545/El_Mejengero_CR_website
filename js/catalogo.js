const productosGrid = document.querySelector("#productos-grid");
const buscadorProductos = document.querySelector("#buscadorProductos");
const btnLimpiarFiltros = document.querySelector("#btnLimpiarFiltros");
const botonesCategoria = document.querySelectorAll(".btn-categoria");
let categoriaActual = filtrosDeURL().categoria;
let catalogoCargado = false;
buscadorProductos.value = filtrosDeURL().q;

function normalizarTexto(texto) {
    return (texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");
}

function limpiarFiltros() {
    if (buscadorProductos) buscadorProductos.value = "";
    categoriaActual = "todas";
    actualizarFiltros();
}

function filtrarProductos() {
    if (productos.length === 0) {
        mostrarCatalogoVacio(productosGrid);
        return;
    }

    const textoBusqueda = buscadorProductos ? normalizarTexto(buscadorProductos.value) : "";

    const productosFiltrados = productos.filter((producto) => {
        const coincideCategoria =
            categoriaActual === "todas" ||
            categoriaActual === "novedades" ||
            normalizarTexto(producto.categoria) === normalizarTexto(categoriaActual);
        const coincideTexto =
            normalizarTexto(producto.nombre).includes(textoBusqueda) ||
            normalizarTexto(producto.descripcion).includes(textoBusqueda);
        return coincideCategoria && coincideTexto;
    });

    renderizarProductos(productosFiltrados);

    if (productosFiltrados.length === 0) {
        const contenedorVacio = document.createElement("div");
        contenedorVacio.className = "col-span-full text-center py-12 flex flex-col items-center justify-center";

        const mensaje = document.createElement("p");
        mensaje.className = "text-gray-500 font-bold text-lg mb-4";
        mensaje.textContent = "No encontramos camisetas con esos filtros ⚽";

        const btnLimpiar = document.createElement("button");
        btnLimpiar.type = "button";
        btnLimpiar.className =
            "bg-black text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-800 transition";
        btnLimpiar.textContent = "Limpiar filtros";
        btnLimpiar.addEventListener("click", limpiarFiltros);

        contenedorVacio.appendChild(mensaje);
        contenedorVacio.appendChild(btnLimpiar);
        productosGrid.appendChild(contenedorVacio);
    }
}

function actualizarFiltros() {
    const parametros = new URLSearchParams();
    if (categoriaActual !== "todas" && categoriaActual !== "novedades") {
        parametros.set("categoria", categoriaActual);
    }
    if (buscadorProductos.value) parametros.set("q", buscadorProductos.value);
    const consulta = parametros.toString();
    // Reemplazar el estado conserva los filtros sin llenar el historial por cada letra.
    history.replaceState(null, "", "catalogo.html" + (consulta ? "?" + consulta : ""));

    const hayFiltrosActivos =
        (categoriaActual !== "todas" && categoriaActual !== "novedades") ||
        (buscadorProductos && buscadorProductos.value.trim() !== "");
    if (btnLimpiarFiltros) {
        btnLimpiarFiltros.classList.toggle("hidden", !hayFiltrosActivos);
    }

    botonesCategoria.forEach((boton) => {
        const catBoton = boton.dataset.categoria;
        const activo =
            catBoton === categoriaActual ||
            ((categoriaActual === "todas" || categoriaActual === "novedades") &&
                (catBoton === "todas" || catBoton === "novedades"));
        boton.classList.toggle("font-bold", activo);
        boton.classList.toggle("text-black", activo);
        if (activo) boton.setAttribute("aria-current", "true");
        else boton.removeAttribute("aria-current");
    });
    if (catalogoCargado) filtrarProductos();
}

if (btnLimpiarFiltros) {
    btnLimpiarFiltros.addEventListener("click", limpiarFiltros);
}
buscadorProductos.addEventListener("input", actualizarFiltros);
buscadorProductos.addEventListener("search", actualizarFiltros);
// El formulario también funciona al presionar Enter, sin perder la categoría.
document.querySelector("#formBusqueda").addEventListener("submit", (evento) => {
    evento.preventDefault();
    actualizarFiltros();
});
botonesCategoria.forEach((boton) => {
    boton.addEventListener("click", (evento) => {
        if (evento.ctrlKey || evento.metaKey || evento.shiftKey || evento.altKey) return;
        evento.preventDefault();
        categoriaActual = boton.dataset.categoria;
        actualizarFiltros();
        sidebarMenu.classList.add("hidden");
        sidebarMenu.classList.remove("flex");
        btnHamburguesa.setAttribute("aria-expanded", "false");
    });
});

async function iniciarCatalogo() {
    actualizarFiltros();
    try {
        await cargarProductos();
        catalogoCargado = true;
        filtrarProductos();
    } catch (error) {
        console.error(error);
        mostrarErrorProductos(productosGrid, iniciarCatalogo);
    }
}
iniciarCatalogo();
