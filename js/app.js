// app.js

// Evento principal para inicializar scripts al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  inicializarMenu();
  inicializarCarrito();
  cargarProductos();
});

// 1. Control del Sidebar / Menú hamburguesa
function inicializarMenu() {
  const btnHamburguesa = document.getElementById("btnHamburguesa");
  const sidebarMenu = document.getElementById("sidebarMenu");

  if (btnHamburguesa && sidebarMenu) {
    btnHamburguesa.addEventListener("click", () => {
      sidebarMenu.classList.toggle("hidden");
      sidebarMenu.classList.toggle("flex");
    });
  }
}

// 2. Control de visibilidad del modal del Carrito
function inicializarCarrito() {
  const btnCarrito = document.getElementById("btnCarrito");
  const cerrarCarrito = document.getElementById("cerrarCarrito");
  const carritoModal = document.getElementById("carrito");

  if (btnCarrito && carritoModal) {
    btnCarrito.addEventListener("click", () => {
      carritoModal.classList.remove("hidden");
    });
  }

  if (cerrarCarrito && carritoModal) {
    cerrarCarrito.addEventListener("click", () => {
      carritoModal.classList.add("hidden");
    });
  }
}

// 3. Carga y renderizado de productos con imágenes
async function cargarProductos() {
  try {
    // Se corrigió la ruta para apuntar a la carpeta data/
    const respuesta = await fetch("data/productos.json");

    if (!respuesta.ok) throw new Error("No se pudo cargar productos.json");

    const productos = await respuesta.json();
    renderizarProductos(productos);
  } catch (error) {
    console.error("Error al cargar los productos:", error);
  }
}

// 4. Renderizado dinámico del catálogo
function renderizarProductos(productos) {
  const contenedor = document.getElementById("listaProductos");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  productos.forEach((producto) => {
    const tarjeta = document.createElement("div");
    tarjeta.className =
      "bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition flex flex-col justify-between";

    tarjeta.innerHTML = `
      <div>
        <div class="relative bg-gray-100 aspect-square overflow-hidden">
          <img 
            src="${producto.imagen}" 
            alt="${producto.nombre}" 
            class="w-full h-full object-cover object-center hover:scale-105 transition duration-300"
          />
          <span class="absolute top-3 right-3 bg-black text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase">
            ${producto.categoria || "Oficial"}
          </span>
        </div>
        <div class="p-5">
          <h3 class="font-bold text-lg text-gray-900 leading-snug mb-1">${producto.nombre}</h3>
          <p class="text-sm text-gray-500 mb-3">${producto.descripcion || ""}</p>
          <span class="text-xl font-black text-black">₡${producto.precio ? producto.precio.toLocaleString() : "0"}</span>
        </div>
      </div>
      <div class="px-5 pb-5">
        <button 
          onclick="agregarAlCarrito(${producto.id})"
          class="w-full bg-black text-white py-3 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-gray-800 transition flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Agregar al Carrito
        </button>
      </div>
    `;

    contenedor.appendChild(tarjeta);
  });
}

// 5. Función auxiliar para manejar la adición al carrito
function agregarAlCarrito(idProducto) {
  console.log(`Producto ${idProducto} agregado al carrito`);
  // Lógica para incrementar contador o guardar en LocalStorage
}
