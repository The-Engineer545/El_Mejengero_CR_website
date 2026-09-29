// ============================================================
// TAREA JOSUÉ: Selección de elementos del DOM y carrito
// ============================================================
const btnHamburguesa = document.querySelector("#btnHamburguesa");
const sidebarMenu = document.querySelector("#sidebarMenu");
const btnCarrito = document.querySelector("#btnCarrito");
const cerrarCarrito = document.querySelector("#cerrarCarrito");
const modalCarrito = document.querySelector("#carrito");
const contadorCarrito = document.querySelector("#contadorCarrito");
const carritoItemsContenedor = document.querySelector("#carrito-items");
const carritoTotalElement = document.querySelector("#carrito-total");
const btnCheckout = document.querySelector("#btnCheckout");

// Variables globales
let productos = [];
let carrito = cargarCarritoGuardado();

// Un carrito dañado no debe impedir que arranque el resto de la página.
function cargarCarritoGuardado() {
    try {
        const datos = JSON.parse(localStorage.getItem("carrito_elmejenguero")) || [];
        if (!Array.isArray(datos)) return [];

        return datos.filter((item) =>
            item !== null && typeof item === "object" &&
            Number.isInteger(item.id) && item.id > 0 &&
            typeof item.nombre === "string" &&
            typeof item.imagen === "string" &&
            typeof item.talla === "string" && item.talla.trim() !== "" &&
            Number.isFinite(item.precio) && item.precio >= 0 &&
            Number.isSafeInteger(item.cantidad) && item.cantidad > 0
        );
    } catch (error) {
        console.warn("No se pudo recuperar el carrito guardado:", error);
        return [];
    }
}

// No inventar tallas para los productos que todavía tienen datos pendientes.
function obtenerTallas(producto) {
    return Array.isArray(producto.tallas)
        ? producto.tallas.filter((talla) => typeof talla === "string" && talla.trim() !== "")
        : [];
}

function cargarTallas(selectTalla, tallas) {
    selectTalla.innerHTML = "";
    selectTalla.disabled = tallas.length === 0;

    if (tallas.length === 0) {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "Tallas pendientes";
        selectTalla.appendChild(option);
        return;
    }

    tallas.forEach((talla) => {
        const option = document.createElement("option");
        option.value = talla;
        option.textContent = talla;
        selectTalla.appendChild(option);
    });
}

// --- MENÚ HAMBURGUESA ---
btnHamburguesa.addEventListener("click", () => {
    sidebarMenu.classList.toggle("hidden");
    sidebarMenu.classList.toggle("flex");
    btnHamburguesa.setAttribute("aria-expanded", !sidebarMenu.classList.contains("hidden"));
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
// TAREA JOSUÉ: Lógica completa del carrito y localStorage
// ============================================================
function agregarAlCarrito(idProducto, desdeDetalle = false, btnRef = null) {
    const producto = productos.find((p) => p.id === idProducto);
    if (!producto) return;
    let tallaSeleccionada;

    if (desdeDetalle) {
        tallaSeleccionada = document.querySelector("#productoTalla").value;
    } else {
        tallaSeleccionada = document.querySelector("#talla-" + idProducto).value;
    }

    // Validar también aquí para impedir agregar una talla inexistente.
    if (!obtenerTallas(producto).includes(tallaSeleccionada)) return;

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
    const btn = desdeDetalle ? document.querySelector("#productoBtnAgregar") : btnRef;
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
const inputNombre = document.querySelector("#inputNombre");
const errorNombre = document.querySelector("#errorNombre");
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
    errorNombre.textContent = "";
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

// El atributo required no se ejecuta automáticamente porque el formulario usa novalidate.
inputNombre.addEventListener("input", () => {
    errorNombre.textContent = inputNombre.value.trim() ? "" : "Ingresá tu nombre completo.";
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

// Preparar el pedido solo si el nombre y ambos campos con Regex son válidos.
formCheckout.addEventListener("submit", (e) => {
    e.preventDefault();
    if (carrito.length === 0) return;
    const nombre = inputNombre.value.trim();
    errorNombre.textContent = nombre ? "" : "Ingresá tu nombre completo.";
    const cedulaValida = regexCedula.test(inputCedula.value);
    const telefonoValido = regexTelefono.test(inputTelefono.value);

    if (!cedulaValida) {
        errorCedula.textContent = "La cédula debe tener exactamente 9 dígitos.";
    }
    if (!telefonoValido) {
        errorTelefono.textContent = "El teléfono debe tener exactamente 8 dígitos.";
    }
    if (!nombre || !cedulaValida || !telefonoValido) return;

    // Si pasa la validación, preparar el mensaje para WhatsApp.
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

    // Abrir WhatsApp no confirma que el cliente envió el mensaje.
    // Conservar el carrito y sus datos guardados, incluso si se bloquea la ventana.
    modalCheckout.classList.add("hidden");

    window.open(`https://wa.me/${telefonoWA}?text=${mensaje}`, "_blank");
});

// Actualizar también al regresar mediante el historial del navegador.
function sincronizarCarrito() {
    carrito = cargarCarritoGuardado();
    actualizarBadgeCarrito();
    actualizarVistaCarrito();
}
window.addEventListener("pageshow", sincronizarCarrito);
window.addEventListener("storage", (evento) => {
    if (evento.key === "carrito_elmejenguero" || evento.key === null) sincronizarCarrito();
});
actualizarBadgeCarrito();
