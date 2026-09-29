const productosGrid = document.querySelector("#productos-grid");

async function iniciarInicio() {
    try {
        await cargarProductos();
        // Selección inicial: cuatro productos en el orden del catálogo.
        renderizarProductos(productos.slice(0, 4));
    } catch (error) {
        console.error(error);
        mostrarErrorProductos(productosGrid);
    }
}
iniciarInicio();
