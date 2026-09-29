const productosGrid = document.querySelector("#productos-grid");
const buscadorProductos = document.querySelector("#buscadorProductos");
const botonesCategoria = document.querySelectorAll(".btn-categoria");
let categoriaActual = filtrosDeURL().categoria;
let catalogoCargado = false;
buscadorProductos.value = filtrosDeURL().q;

function filtrarProductos() {
    const textoBusqueda = buscadorProductos ? buscadorProductos.value.toLowerCase() : "";

    const productosFiltrados = productos.filter((producto) => {
        const coincideCategoria =
            categoriaActual === "todas" ||
            producto.categoria.trim().toLowerCase() === categoriaActual.trim().toLowerCase();
        const coincideTexto =
            producto.nombre.toLowerCase().includes(textoBusqueda) ||
            producto.descripcion.toLowerCase().includes(textoBusqueda);
        return coincideCategoria && coincideTexto;
    });

    renderizarProductos(productosFiltrados);

    if (productosFiltrados.length === 0) {
        const mensaje = document.createElement("p");
        mensaje.className = "col-span-full text-center text-gray-500 py-10 font-bold text-lg";
        mensaje.textContent = "No encontramos camisas con esos filtros ⚽";
        productosGrid.appendChild(mensaje);
    }
}

function actualizarFiltros() {
    const parametros = new URLSearchParams();
    if (categoriaActual !== "todas") parametros.set("categoria", categoriaActual);
    if (buscadorProductos.value) parametros.set("q", buscadorProductos.value);
    const consulta = parametros.toString();
    // Reemplazar el estado conserva los filtros sin llenar el historial por cada letra.
    history.replaceState(null, "", "catalogo.html" + (consulta ? "?" + consulta : ""));
    botonesCategoria.forEach((boton) => {
        const activo = boton.dataset.categoria === categoriaActual;
        boton.classList.toggle("font-bold", activo);
        boton.classList.toggle("text-black", activo);
        if (activo) boton.setAttribute("aria-current", "true");
        else boton.removeAttribute("aria-current");
    });
    if (catalogoCargado) filtrarProductos();
}

buscadorProductos.addEventListener("input", actualizarFiltros);
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
        mostrarErrorProductos(productosGrid);
    }
}
iniciarCatalogo();
