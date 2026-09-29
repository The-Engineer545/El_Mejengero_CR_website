// ============================================================
// TAREA JOSUÉ: Selección de elementos del DOM y carrito
// ============================================================
const btnHamburguesa = document.querySelector("#btnHamburguesa");
const sidebarMenu = document.querySelector("#sidebarMenu");
const btnCarrito = document.querySelector("#btnCarrito");
const cerrarCarrito = document.querySelector("#cerrarCarrito");
const modalCarrito = document.querySelector("#carrito");
const productosGrid = document.querySelector("#productos-grid");
const contadorCarrito = document.querySelector("#contadorCarrito");
const carritoItemsContenedor = document.querySelector("#carrito-items");
const carritoTotalElement = document.querySelector("#carrito-total");
const btnCheckout = document.querySelector("#btnCheckout");

// ============================================================
// TAREA LUIS: Filtros y búsqueda
// ============================================================
const buscadorProductos = document.querySelector("#buscadorProductos");
const botonesCategoria = document.querySelectorAll(".btn-categoria");

// Variables globales
let productos = [];
let carrito = JSON.parse(localStorage.getItem("carrito_elmejenguero")) || [];
let categoriaActual = "todas";

// --- MENÚ HAMBURGUESA ---
btnHamburguesa.addEventListener("click", () => {
    sidebarMenu.classList.toggle("hidden");
    sidebarMenu.classList.toggle("flex");
});

// ============================================================
// TAREA LUIS: Lógica de filtros por categoría y búsqueda
// ============================================================
function filtrarProductos() {
    const textoBusqueda = buscadorProductos ? buscadorProductos.value.toLowerCase() : "";

    const productosFiltrados = productos.filter((producto) => {
        const coincideCategoria =
            categoriaActual === "todas" || producto.categoria === categoriaActual;
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

if (buscadorProductos) {
    buscadorProductos.addEventListener("input", filtrarProductos);
}

botonesCategoria.forEach((boton) => {
    boton.addEventListener("click", (e) => {
        botonesCategoria.forEach((b) => {
            b.classList.remove("font-bold", "text-black");
            b.classList.add("text-gray-700");
        });
        e.currentTarget.classList.remove("text-gray-700");
        e.currentTarget.classList.add("font-bold", "text-black");

        categoriaActual = e.currentTarget.getAttribute("data-categoria");
        if (buscadorProductos) buscadorProductos.value = "";
        filtrarProductos();

        sidebarMenu.classList.add("hidden");
        sidebarMenu.classList.remove("flex");
    });
});

// --- ABRIR / CERRAR CARRITO ---
btnCarrito.addEventListener("click", () => {
    modalCarrito.classList.remove("hidden");
    actualizarVistaCarrito();
});

cerrarCarrito.addEventListener("click", () => {
    modalCarrito.classList.add("hidden");
});

// ============================================================
// TAREA LUIS: Carga de productos con fetch() desde JSON
// ============================================================
async function cargarProductos() {
    try {
        const respuesta = await fetch("data/productos.json");
        productos = await respuesta.json();
        renderizarProductos(productos);
        actualizarBadgeCarrito();
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        const errorMsg = document.createElement("p");
        errorMsg.className = "text-red-500 col-span-full font-bold text-center mt-10";
        errorMsg.textContent =
            'Error al cargar el JSON. Asegúrate de usar la extensión "Live Server" en Visual Studio Code.';
        productosGrid.appendChild(errorMsg);
    }
}

// ============================================================
// TAREA LUIS: Renderizado usando createElement() y appendChild()
// (Sin innerHTML masivo — cumple la rúbrica)
// ============================================================
function renderizarProductos(listaProductos) {
    productosGrid.innerHTML = "";

    listaProductos.forEach((producto) => {
        // --- Tarjeta principal ---
        const article = document.createElement("article");
        article.className =
            "bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition flex flex-col justify-between";

        // --- Contenedor de imagen (clickeable) ---
        const divImagen = document.createElement("div");
        divImagen.className =
            "bg-gray-100 rounded-xl overflow-hidden relative h-64 flex items-center justify-center cursor-pointer group";
        divImagen.addEventListener("click", () => abrirModalProducto(producto.id));

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
        h3.textContent = producto.nombre;

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
        selectTalla.className =
            "block w-full mt-1 border-gray-300 rounded-md text-sm p-2 bg-gray-50 border";
        producto.tallas.forEach((talla) => {
            const option = document.createElement("option");
            option.value = talla;
            option.textContent = talla;
            selectTalla.appendChild(option);
        });

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
        btnAgregar.textContent = "Agregar al Carrito";
        btnAgregar.addEventListener("click", () => agregarAlCarrito(producto.id, false, btnAgregar));

        article.appendChild(divInfo);
        article.appendChild(btnAgregar);
        productosGrid.appendChild(article);
    });
}

// ============================================================
// TAREA JOSUÉ: Lógica completa del carrito y localStorage
// ============================================================
function agregarAlCarrito(idProducto, desdeModal = false, btnRef = null) {
    const producto = productos.find((p) => p.id === idProducto);
    let tallaSeleccionada;

    if (desdeModal) {
        tallaSeleccionada = document.querySelector("#modalTalla").value;
    } else {
        tallaSeleccionada = document.querySelector("#talla-" + idProducto).value;
    }

    const itemExistente = carrito.find(
        (item) => item.id === idProducto && item.talla === tallaSeleccionada
    );

    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            talla: tallaSeleccionada,
            cantidad: 1,
        });
    }

    guardarCarrito();
    actualizarBadgeCarrito();

    // Feedback visual en el botón
    const btn = desdeModal ? document.querySelector("#modalBtnAgregar") : btnRef;
    if (btn) {
        const textoOriginal = btn.textContent;
        btn.textContent = "¡Agregado! ✔️";
        btn.classList.replace("bg-black", "bg-green-600");
        setTimeout(() => {
            btn.textContent = textoOriginal;
            btn.classList.replace("bg-green-600", "bg-black");
        }, 1500);
    }
}

window.eliminarDelCarrito = (index) => {
    carrito.splice(index, 1);
    guardarCarrito();
    actualizarVistaCarrito();
    actualizarBadgeCarrito();
};

window.cambiarCantidad = (index, delta) => {
    if (carrito[index].cantidad + delta > 0) {
        carrito[index].cantidad += delta;
        guardarCarrito();
        actualizarVistaCarrito();
        actualizarBadgeCarrito();
    }
};

function guardarCarrito() {
    localStorage.setItem("carrito_elmejenguero", JSON.stringify(carrito));
}

function actualizarBadgeCarrito() {
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    contadorCarrito.innerText = totalItems;
    contadorCarrito.style.display = totalItems > 0 ? "flex" : "none";
}

function actualizarVistaCarrito() {
    carritoItemsContenedor.innerHTML = "";

    if (carrito.length === 0) {
        const pVacio = document.createElement("p");
        pVacio.className = "text-gray-500 text-center mt-10";
        pVacio.textContent = "El carrito está vacío por ahora.";
        carritoItemsContenedor.appendChild(pVacio);
        carritoTotalElement.innerText = "₡0";
        btnCheckout.disabled = true;
        btnCheckout.classList.add("opacity-50", "cursor-not-allowed");
        return;
    }

    btnCheckout.disabled = false;
    btnCheckout.classList.remove("opacity-50", "cursor-not-allowed");

    let total = 0;
    carrito.forEach((item, index) => {
        total += item.precio * item.cantidad;

        const divItem = document.createElement("div");
        divItem.className = "flex items-center gap-4 border-b py-4";

        const imgItem = document.createElement("img");
        imgItem.src = item.imagen;
        imgItem.alt = item.nombre;
        imgItem.className = "w-16 h-16 object-cover rounded-lg bg-gray-100 mix-blend-multiply";

        const divTexto = document.createElement("div");
        divTexto.className = "flex-1";

        const h4 = document.createElement("h4");
        h4.className = "font-bold text-sm leading-tight";
        h4.textContent = item.nombre;

        const pTalla = document.createElement("p");
        pTalla.className = "text-xs text-gray-500";
        pTalla.textContent = "Talla: " + item.talla;

        const divCantidad = document.createElement("div");
        divCantidad.className = "flex items-center gap-3 mt-2";

        const btnMenos = document.createElement("button");
        btnMenos.className =
            "w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center font-bold";
        btnMenos.textContent = "-";
        btnMenos.addEventListener("click", () => cambiarCantidad(index, -1));

        const spanCantidad = document.createElement("span");
        spanCantidad.className = "text-sm font-bold";
        spanCantidad.textContent = item.cantidad;

        const btnMas = document.createElement("button");
        btnMas.className =
            "w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center font-bold";
        btnMas.textContent = "+";
        btnMas.addEventListener("click", () => cambiarCantidad(index, 1));

        divCantidad.appendChild(btnMenos);
        divCantidad.appendChild(spanCantidad);
        divCantidad.appendChild(btnMas);

        divTexto.appendChild(h4);
        divTexto.appendChild(pTalla);
        divTexto.appendChild(divCantidad);

        const divPrecioEliminar = document.createElement("div");
        divPrecioEliminar.className = "text-right flex flex-col justify-between items-end h-full";

        const pSubtotal = document.createElement("p");
        pSubtotal.className = "font-black text-sm";
        pSubtotal.textContent = "₡" + (item.precio * item.cantidad).toLocaleString("es-CR");

        const btnEliminar = document.createElement("button");
        btnEliminar.className = "text-red-500 text-xs font-bold hover:underline mt-2";
        btnEliminar.textContent = "Eliminar";
        btnEliminar.addEventListener("click", () => eliminarDelCarrito(index));

        divPrecioEliminar.appendChild(pSubtotal);
        divPrecioEliminar.appendChild(btnEliminar);

        divItem.appendChild(imgItem);
        divItem.appendChild(divTexto);
        divItem.appendChild(divPrecioEliminar);
        carritoItemsContenedor.appendChild(divItem);
    });

    carritoTotalElement.innerText = "₡" + total.toLocaleString("es-CR");
}

// ============================================================
// TAREA DARÍO: Checkout con validación Regex
// ============================================================
const modalCheckout = document.querySelector("#modalCheckout");
const cerrarModalCheckout = document.querySelector("#cerrarModalCheckout");
const formCheckout = document.querySelector("#formCheckout");
const inputCedula = document.querySelector("#inputCedula");
const inputTelefono = document.querySelector("#inputTelefono");
const errorCedula = document.querySelector("#errorCedula");
const errorTelefono = document.querySelector("#errorTelefono");

// Expresiones regulares — Cédula CR: exactamente 9 dígitos numéricos
const regexCedula = /^\d{9}$/;
// Teléfono CR: exactamente 8 dígitos numéricos
const regexTelefono = /^\d{8}$/;

// Al hacer click en "Finalizar Compra" se abre el formulario de checkout
btnCheckout.addEventListener("click", () => {
    if (carrito.length === 0) return;
    modalCarrito.classList.add("hidden");
    modalCheckout.classList.remove("hidden");
    // Limpiar campos y errores anteriores
    formCheckout.reset();
    errorCedula.textContent = "";
    errorTelefono.textContent = "";
});

cerrarModalCheckout.addEventListener("click", () => {
    modalCheckout.classList.add("hidden");
});

// Cerrar checkout si click en el fondo oscuro
modalCheckout.addEventListener("click", (e) => {
    if (e.target === modalCheckout) modalCheckout.classList.add("hidden");
});

// Validación en tiempo real — Cédula
inputCedula.addEventListener("input", () => {
    if (!regexCedula.test(inputCedula.value)) {
        errorCedula.textContent = "La cédula debe tener exactamente 9 dígitos.";
    } else {
        errorCedula.textContent = "";
    }
});

// Validación en tiempo real — Teléfono
inputTelefono.addEventListener("input", () => {
    if (!regexTelefono.test(inputTelefono.value)) {
        errorTelefono.textContent = "El teléfono debe tener exactamente 8 dígitos.";
    } else {
        errorTelefono.textContent = "";
    }
});

// Envío del formulario — Solo si ambos campos pasan el Regex
formCheckout.addEventListener("submit", (e) => {
    e.preventDefault();
    const cedulaValida = regexCedula.test(inputCedula.value);
    const telefonoValido = regexTelefono.test(inputTelefono.value);

    if (!cedulaValida) {
        errorCedula.textContent = "La cédula debe tener exactamente 9 dígitos.";
    }
    if (!telefonoValido) {
        errorTelefono.textContent = "El teléfono debe tener exactamente 8 dígitos.";
    }
    if (!cedulaValida || !telefonoValido) return;

    // Si pasa la validación, enviar por WhatsApp
    const nombre = document.querySelector("#inputNombre").value;
    const telefonoWA = "50663425133";
    let mensaje = `🛒 *Nuevo Pedido - El Mejenguero CR*%0A%0A`;
    mensaje += `👤 *Cliente:* ${nombre}%0A`;
    mensaje += `🪪 *Cédula:* ${inputCedula.value}%0A`;
    mensaje += `📞 *Teléfono:* ${inputTelefono.value}%0A%0A`;

    let total = 0;
    carrito.forEach((item) => {
        mensaje += `⚽ ${item.nombre}%0A`;
        mensaje += `   Talla: ${item.talla} | Cantidad: ${item.cantidad}%0A`;
        mensaje += `   Subtotal: ₡${(item.precio * item.cantidad).toLocaleString("es-CR")}%0A%0A`;
        total += item.precio * item.cantidad;
    });

    mensaje += `💰 *TOTAL A PAGAR: ₡${total.toLocaleString("es-CR")}*%0A%0A`;
    mensaje += "Por favor indíquenme los métodos de pago disponibles y opciones de envío. ¡Pura vida!";

    carrito = [];
    guardarCarrito();
    actualizarVistaCarrito();
    actualizarBadgeCarrito();
    modalCheckout.classList.add("hidden");

    window.open(`https://wa.me/${telefonoWA}?text=${mensaje}`, "_blank");
});

// ============================================================
// Vista Rápida del Producto (Modal)
// ============================================================
const modalProducto = document.querySelector("#modalProducto");
const cerrarModalProducto = document.querySelector("#cerrarModalProducto");

function abrirModalProducto(idProducto) {
    const producto = productos.find((p) => p.id === idProducto);

    document.querySelector("#modalImagen").src = producto.imagen;
    document.querySelector("#modalCategoria").textContent = producto.categoria;
    document.querySelector("#modalTitulo").textContent = producto.nombre;
    document.querySelector("#modalDescripcion").textContent = producto.descripcion;
    document.querySelector("#modalPrecio").textContent =
        "₡" + producto.precio.toLocaleString("es-CR");

    const selectTalla = document.querySelector("#modalTalla");
    selectTalla.innerHTML = "";
    producto.tallas.forEach((talla) => {
        const option = document.createElement("option");
        option.value = talla;
        option.textContent = talla;
        selectTalla.appendChild(option);
    });

    const btnAgregar = document.querySelector("#modalBtnAgregar");
    // Clonar para eliminar listeners anteriores
    const btnNuevo = btnAgregar.cloneNode(true);
    btnAgregar.parentNode.replaceChild(btnNuevo, btnAgregar);
    btnNuevo.addEventListener("click", () => agregarAlCarrito(producto.id, true, btnNuevo));

    modalProducto.classList.remove("hidden");
}

if (cerrarModalProducto) {
    cerrarModalProducto.addEventListener("click", () => {
        modalProducto.classList.add("hidden");
    });
}

if (modalProducto) {
    modalProducto.addEventListener("click", (e) => {
        if (e.target === modalProducto) modalProducto.classList.add("hidden");
    });
}

// Arrancar
cargarProductos();