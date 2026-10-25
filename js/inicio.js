const productosGrid = document.querySelector("#productos-grid");

async function iniciarInicio() {
    try {
        await cargarProductos();
        // Selección de productos destacados o los primeros cuatro por defecto.
        const destacados = productos.filter((producto) => producto.destacado);
        renderizarProductos(destacados.length > 0 ? destacados : productos.slice(0, 4));
    } catch (error) {
        console.error(error);
        mostrarErrorProductos(productosGrid);
    }
}
iniciarInicio();
