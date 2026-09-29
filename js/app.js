// Funciones compartidas por las cinco páginas. Cada página inicializa solo su apartado.
let productos = [];
const claveCarrito = "mejengero.carrito.v1";
const moneda = new Intl.NumberFormat("es-CR", {
  style: "currency",
  currency: "CRC",
  maximumFractionDigits: 0,
});

function escapar(texto) {
  return String(texto ?? "").replace(
    /[&<>"']/g,
    (caracter) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        caracter
      ],
  );
}

function avisar(texto) {
  const aviso = document.getElementById("avisoGeneral");
  aviso.textContent = texto;
  aviso.hidden = false;
}

// Se guardan identificadores y opciones; nombres y precios siempre se leen del catálogo.
function leerCarrito() {
  try {
    const datos = JSON.parse(localStorage.getItem(claveCarrito) || "[]");
    if (!Array.isArray(datos)) return [];
    return datos.filter(
      (item) =>
        item &&
        Number.isInteger(item.id) &&
        Number.isInteger(item.cantidad) &&
        item.cantidad > 0 &&
        item.cantidad <= 99 &&
        typeof item.talla === "string" &&
        ["Fan", "Player"].includes(item.version),
    );
  } catch {
    avisar(
      "No se pudo recuperar el carrito guardado. Podés volver a seleccionar tus productos.",
    );
    return [];
  }
}

function carritoValido() {
  return leerCarrito().filter((item) => {
    const producto = productos.find((producto) => producto.id === item.id);
    return (
      producto &&
      producto.disponible === true &&
      producto.tallas?.includes(item.talla) &&
      (item.version === "Fan" || producto.playerVersion === true)
    );
  });
}

function guardarCarrito(carrito) {
  try {
    localStorage.setItem(claveCarrito, JSON.stringify(carrito));
    actualizarContador(carrito);
    return true;
  } catch {
    avisar(
      "No se pudo guardar el carrito. Habilitá el almacenamiento del navegador e intentá nuevamente.",
    );
    return false;
  }
}

function actualizarContador(carrito) {
  document.getElementById("contadorCarrito").textContent = carrito.reduce(
    (total, item) => total + item.cantidad,
    0,
  );
}

function inicializarMenu() {
  const boton = document.getElementById("btnHamburguesa");
  const menu = document.getElementById("sidebarMenu");
  boton.addEventListener("click", () => {
    menu.classList.toggle("hidden");
    boton.setAttribute(
      "aria-expanded",
      String(!menu.classList.contains("hidden")),
    );
  });
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && !menu.classList.contains("hidden")) {
      menu.classList.add("hidden");
      boton.setAttribute("aria-expanded", "false");
      boton.focus();
    }
  });
}

// Si falta una fotografía, el catálogo continúa funcionando con un aviso visible.
function prepararImagenes() {
  document.querySelectorAll("img[data-producto]").forEach((imagen) => {
    const mostrarAviso = () => {
      const aviso = document.createElement("p");
      aviso.className = "p-10 text-center text-gray-500";
      aviso.textContent = "Fotografía pendiente · " + imagen.alt;
      imagen.replaceWith(aviso);
    };
    imagen.addEventListener("error", mostrarAviso, { once: true });
    if (imagen.complete && imagen.naturalWidth === 0) mostrarAviso();
  });
}

function imagenProducto(producto) {
  // Se aceptan únicamente recursos locales de la carpeta de productos.
  const ruta = /^img\/productos\/[\w.-]+$/.test(producto.imagen)
    ? producto.imagen
    : "";
  return `<img data-producto src="${escapar(ruta)}" alt="${escapar(producto.nombre.trim())}" class="w-full aspect-square object-contain bg-gray-100" loading="lazy">`;
}

function renderizarProductos(lista) {
  document.getElementById("listaProductos").innerHTML = lista
    .map(
      (producto) => `
    <article class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
      <a href="producto.html?id=${producto.id}">${imagenProducto(producto)}</a>
      <div class="p-5 flex flex-col flex-1"><p class="text-xs uppercase text-gray-500">${escapar(producto.categoria)}</p>
      <h2 class="text-xl font-bold mt-2">${escapar(producto.nombre.trim())}</h2><p class="text-gray-500 my-3">${escapar(producto.descripcion)}</p>
      <p class="text-xl font-black mb-4">${moneda.format(producto.precio)}</p>
      <a class="boton mt-auto" href="producto.html?id=${producto.id}">Ver producto</a></div></article>`,
    )
    .join("");
  document.getElementById("estadoProductos").textContent = lista.length
    ? `${lista.length} productos`
    : "No hay productos en esta categoría.";
  prepararImagenes();
}

function mostrarProducto() {
  const id = Number(new URLSearchParams(location.search).get("id"));
  const producto = productos.find((producto) => producto.id === id);
  const estado = document.getElementById("estadoProductos");
  if (!producto) {
    estado.textContent =
      "No encontramos ese producto. Volvé al catálogo para elegir una camiseta.";
    return;
  }
  estado.textContent = "";
  document.title = `${producto.nombre.trim()} | El Mejengero CR`;
  const tallas = Array.isArray(producto.tallas) ? producto.tallas : [];
  const disponible = producto.disponible === true && tallas.length > 0;
  document.getElementById("detalleProducto").innerHTML =
    `<div class="grid md:grid-cols-2 gap-8">
    <div class="rounded-2xl overflow-hidden">${imagenProducto(producto)}</div><div class="panel">
    <h1 class="text-3xl font-black">${escapar(producto.nombre.trim())}</h1><p class="my-4">${escapar(producto.descripcion)}</p>
    <p class="text-2xl font-bold mb-6">${moneda.format(producto.precio)}</p>
    <form id="seleccionProducto" class="space-y-6"><fieldset><legend class="font-bold mb-3">Versión</legend>
    <label><input type="radio" name="version" value="Fan" checked> Fan</label>
    <label class="${producto.playerVersion === true ? "" : "text-gray-500 line-through"}"><input type="radio" name="version" value="Player" ${producto.playerVersion === true ? "" : "disabled"}> Player${producto.playerVersion === true ? "" : " (no disponible)"}</label></fieldset>
    <label class="font-bold">Talla<select name="talla" required ${disponible ? "" : "disabled"}><option value="">Seleccioná una talla</option>${tallas.map((talla) => `<option>${escapar(talla)}</option>`).join("")}</select></label>
    <details><summary class="enlace cursor-pointer">Guía de tallas</summary><p class="mt-3">Consultá las medidas de esta camiseta con la tienda antes de elegir. La tabla de medidas está pendiente de confirmación.</p><a class="enlace" href="https://wa.me/50688980038" target="_blank" rel="noopener">Consultar medidas</a></details>
    ${disponible ? "" : '<p role="status">Tallas o disponibilidad pendientes de confirmar. Consultá con la tienda.</p>'}
    <button id="btnAgregarCarrito" class="boton" ${disponible ? "" : "disabled"}>Agregar al carrito</button></form></div></div>`;
  prepararImagenes();
  document
    .getElementById("seleccionProducto")
    .addEventListener("submit", (evento) => {
      evento.preventDefault();
      const datos = new FormData(evento.target);
      const talla = datos.get("talla");
      const version = datos.get("version");
      if (
        !disponible ||
        !tallas.includes(talla) ||
        !["Fan", "Player"].includes(version) ||
        (version === "Player" && producto.playerVersion !== true)
      )
        return;
      const carrito = carritoValido();
      const existente = carrito.find(
        (item) =>
          item.id === id && item.talla === talla && item.version === version,
      );
      if (existente?.cantidad >= 99)
        return avisar("El máximo por variante es 99 unidades.");
      if (existente) existente.cantidad++;
      else carrito.push({ id, talla, version, cantidad: 1 });
      if (guardarCarrito(carrito))
        document.getElementById("confirmacionCarrito").showModal();
    });
  document
    .getElementById("seguirComprando")
    .addEventListener("click", () => location.assign("catalogo.html"));
}

function subtotal(carrito) {
  return carrito.reduce(
    (total, item) =>
      total +
      productos.find((producto) => producto.id === item.id).precio *
        item.cantidad,
    0,
  );
}

function mostrarCarrito() {
  const carrito = carritoValido();
  document.getElementById("estadoProductos").textContent = carrito.length
    ? ""
    : "Tu carrito está vacío.";
  document.getElementById("resumenCarrito").hidden = carrito.length === 0;
  document.getElementById("subtotalCarrito").textContent = moneda.format(
    subtotal(carrito),
  );
  document.getElementById("listaCarrito").innerHTML = carrito
    .map((item, indice) => {
      const producto = productos.find((producto) => producto.id === item.id);
      return `<article class="panel"><a class="enlace font-bold" href="producto.html?id=${item.id}">${escapar(producto.nombre.trim())}</a>
      <p class="my-3">Talla ${escapar(item.talla)} · ${item.version} · ${moneda.format(producto.precio)} por unidad</p>
      <div class="flex flex-wrap items-end gap-4"><label>Cantidad<input type="number" min="1" max="99" step="1" value="${item.cantidad}" data-cantidad="${indice}" style="width:6rem"></label>
      <button class="boton-secundario" data-eliminar="${indice}">Eliminar</button><p>${moneda.format(producto.precio * item.cantidad)}</p></div></article>`;
    })
    .join("");
  document.querySelectorAll("[data-cantidad]").forEach((campo) =>
    campo.addEventListener("change", () => {
      const cantidad = Number(campo.value);
      if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 99) {
        campo.value = carrito[Number(campo.dataset.cantidad)].cantidad;
        return avisar("La cantidad debe ser un número entero entre 1 y 99.");
      }
      carrito[Number(campo.dataset.cantidad)].cantidad = cantidad;
      guardarCarrito(carrito);
      mostrarCarrito();
    }),
  );
  document.querySelectorAll("[data-eliminar]").forEach((boton) =>
    boton.addEventListener("click", () => {
      carrito.splice(Number(boton.dataset.eliminar), 1);
      guardarCarrito(carrito);
      mostrarCarrito();
    }),
  );
}

function inicializarCheckout() {
  const carrito = carritoValido();
  const formulario = document.getElementById("formularioPedido");
  formulario.hidden = !carrito.length;
  document.getElementById("estadoProductos").textContent = carrito.length
    ? ""
    : "Agregá productos desde el catálogo para preparar un pedido.";
  document.getElementById("resumenPedido").textContent = carrito.length
    ? `Subtotal: ${moneda.format(subtotal(carrito))}. El costo de entrega se coordina con la tienda.`
    : "Tu carrito está vacío.";
  const cambiarEntrega = () => {
    const correos = formulario.elements.entrega.value === "correos";
    document.getElementById("datosCorreos").hidden = !correos;
    document.getElementById("datosCorreos").disabled = !correos;
    document.getElementById("datosPersonal").hidden = correos;
    formulario.elements.lugar.disabled = correos;
  };
  document
    .getElementById("tipoEntrega")
    .addEventListener("change", cambiarEntrega);
  cambiarEntrega();
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    if (!formulario.reportValidity()) return;
    if (!formulario.elements.nombre.value.trim())
      return avisar("Ingresá tu nombre completo.");
    const actual = carritoValido();
    if (!actual.length) return inicializarCheckout();
    const datos = new FormData(formulario);
    const lineas = actual.map(
      (item) =>
        `${productos.find((producto) => producto.id === item.id).nombre.trim()} | ${item.version} | Talla ${item.talla} | Cantidad ${item.cantidad}`,
    );
    let mensaje = `Hola, quisiera confirmar este pedido:\n${lineas.join("\n")}\nSubtotal: ${moneda.format(subtotal(actual))}\nEntrega por confirmar.\nNombre: ${datos.get("nombre").trim()}\nTeléfono: ${datos.get("telefono")}\nPago: SINPE Móvil\n`;
    if (datos.get("entrega") === "correos")
      mensaje += `Correos de Costa Rica\nIdentificación: ${datos.get("cedula")}\n${datos.get("provincia")}, ${datos.get("canton")}, ${datos.get("distrito")}\nDirección o sucursal: ${datos.get("direccion")}`;
    else mensaje += `Entrega personal: ${datos.get("lugar")}`;
    // El comprador decide enviar el mensaje en WhatsApp; el formulario no confirma pagos.
    window.open(
      "https://wa.me/50688980038?text=" + encodeURIComponent(mensaje),
      "_blank",
      "noopener",
    );
  });
}

async function cargarProductos() {
  try {
    const respuesta = await fetch("data/productos.json");
    if (!respuesta.ok) throw new Error("No se pudo cargar productos.json");
    const datos = await respuesta.json();
    if (
      !Array.isArray(datos) ||
      datos.some(
        (producto) =>
          !Number.isInteger(producto.id) ||
          typeof producto.nombre !== "string" ||
          !Number.isFinite(producto.precio) ||
          producto.precio < 0,
      )
    )
      throw new Error("El catálogo tiene datos inválidos");
    productos = datos;
    const guardado = leerCarrito();
    const valido = carritoValido();
    if (guardado.length !== valido.length) {
      avisar(
        "Algunos productos del carrito ya no tienen disponibilidad confirmada. Revisá tu selección.",
      );
      guardarCarrito(valido);
    }
    actualizarContador(valido);
    const pagina = document.body.dataset.pagina;
    if (pagina === "index") renderizarProductos(productos.slice(0, 3));
    if (pagina === "catalogo") {
      const categoria =
        new URLSearchParams(location.search).get("categoria") || "todos";
      document.querySelectorAll("[data-categoria]").forEach((enlace) => {
        if (enlace.dataset.categoria === categoria)
          enlace.setAttribute("aria-current", "true");
      });
      renderizarProductos(
        categoria === "todos"
          ? productos
          : productos.filter(
              (producto) =>
                String(producto.categoria).toLowerCase() ===
                categoria.toLowerCase(),
            ),
      );
    }
    if (pagina === "producto") mostrarProducto();
    if (pagina === "carrito") mostrarCarrito();
    if (pagina === "checkout") inicializarCheckout();
  } catch (error) {
    document.getElementById("estadoProductos").textContent =
      "No pudimos cargar el catálogo. Revisá la conexión y recargá la página.";
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  inicializarMenu();
  actualizarContador(leerCarrito());
  cargarProductos();
});
window.addEventListener("storage", (evento) => {
  if (evento.key === claveCarrito || evento.key === null) {
    actualizarContador(carritoValido());
    if (document.body.dataset.pagina === "carrito") mostrarCarrito();
    // Recargar evita registrar dos veces el envío del formulario.
    if (document.body.dataset.pagina === "checkout") location.reload();
  }
});
