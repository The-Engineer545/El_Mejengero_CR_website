// Panel de administración: login, lista de camisetas y cambios con token.
// Todo lo que viene de la API se pinta con textContent, nunca con innerHTML.

const CLAVE_TOKEN = "token_admin_mejenguero";
const IMAGEN_VACIA = "favicon.svg";

// Elementos del DOM
const vistaLogin = document.querySelector("#vistaLogin");
const vistaPanel = document.querySelector("#vistaPanel");
const formLogin = document.querySelector("#formLogin");
const loginMensaje = document.querySelector("#loginMensaje");
const btnLogin = document.querySelector("#btnLogin");
const btnCerrarSesion = document.querySelector("#btnCerrarSesion");
const btnNueva = document.querySelector("#btnNueva");
const listaCamisetas = document.querySelector("#listaCamisetas");
const resumen = document.querySelector("#resumen");
const panelMensaje = document.querySelector("#panelMensaje");

const dialogoCamiseta = document.querySelector("#dialogoCamiseta");
const formCamiseta = document.querySelector("#formCamiseta");
const tituloFormulario = document.querySelector("#tituloFormulario");
const formMensaje = document.querySelector("#formMensaje");
const btnGuardar = document.querySelector("#btnGuardar");
const campoImagen = document.querySelector("#campoImagen");
const vistaPreviaImagen = document.querySelector("#vistaPreviaImagen");
const campoArchivoImagen = document.querySelector("#campoArchivoImagen");
const zonaImagen = document.querySelector("#zonaImagen");

const dialogoEliminar = document.querySelector("#dialogoEliminar");
const nombreEliminar = document.querySelector("#nombreEliminar");
const btnConfirmarEliminar = document.querySelector("#btnConfirmarEliminar");

let camisetas = [];
let idEnEdicion = null; // null = crear; número = editar esa camiseta
let idAEliminar = null;
let imagenActual = ""; // Ruta, dirección o foto en base64 de la camiseta en edición.

// ---------- Token (sessionStorage: se borra al cerrar la pestaña) ----------

// Sin entradas. Devuelve el token guardado o null.
function leerToken() {
    try {
        return sessionStorage.getItem(CLAVE_TOKEN);
    } catch {
        return null;
    }
}

// Recibe el token (o null para borrarlo). No devuelve nada.
function guardarToken(token) {
    try {
        if (token) sessionStorage.setItem(CLAVE_TOKEN, token);
        else sessionStorage.removeItem(CLAVE_TOKEN);
    } catch {
        // Si el navegador bloquea el almacenamiento, la sesión dura hasta recargar.
    }
}

// Recibe un token JWT. Devuelve true si ya venció o no se puede leer.
// Solo sirve para avisar antes; quien decide de verdad es el backend.
function tokenVencido(token) {
    try {
        const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        const datos = JSON.parse(atob(base64));
        return !datos.exp || datos.exp * 1000 <= Date.now();
    } catch {
        return true;
    }
}

// ---------- Comunicación con la API ----------

// Recibe ruta y opciones de fetch. Devuelve el JSON de la respuesta.
// Si el backend responde 401, cierra la sesión.
async function pedirApi(ruta, opciones = {}) {
    const encabezados = { "Content-Type": "application/json" };
    const token = leerToken();
    if (token) encabezados.Authorization = `Bearer ${token}`;

    let respuesta;
    try {
        respuesta = await fetch(`${API_URL}${ruta}`, { ...opciones, headers: encabezados });
    } catch {
        throw new Error("No se pudo conectar con el servidor. Revisá que el backend esté encendido.");
    }

    const datos = await respuesta.json().catch(() => ({}));

    if (respuesta.status === 401 && ruta !== "/auth/login") {
        cerrarSesion("Tu sesión venció. Volvé a iniciar sesión.");
        throw new Error("Sesión vencida");
    }
    if (!respuesta.ok) {
        // ValidationPipe devuelve message como arreglo; los demás errores, como texto.
        const detalle = Array.isArray(datos.message) ? datos.message.join(". ") : datos.message;
        throw new Error(detalle || `Error ${respuesta.status}`);
    }
    return datos;
}

// ---------- Vistas ----------

function mostrarLogin(mensaje = "") {
    vistaPanel.classList.add("hidden");
    vistaLogin.classList.remove("hidden");
    loginMensaje.textContent = mensaje;
    document.querySelector("#loginUsuario").focus();
}

async function mostrarPanel() {
    vistaLogin.classList.add("hidden");
    vistaPanel.classList.remove("hidden");
    await cargarCamisetas();
}

// Recibe un mensaje opcional. Borra el token y vuelve al login.
function cerrarSesion(mensaje = "") {
    guardarToken(null);
    camisetas = [];
    listaCamisetas.replaceChildren();
    if (dialogoCamiseta.open) dialogoCamiseta.close();
    if (dialogoEliminar.open) dialogoEliminar.close();
    mostrarLogin(mensaje);
}

// Recibe texto y si es error. Muestra el aviso arriba de la lista.
function avisar(texto, esError = false) {
    panelMensaje.textContent = texto;
    panelMensaje.className = `text-sm font-semibold min-h-[1.25rem] ${esError ? "text-red-600" : "text-green-700"}`;
}

// ---------- Login ----------

formLogin.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const usuario = document.querySelector("#loginUsuario").value.trim();
    const contrasena = document.querySelector("#loginContrasena").value;

    if (!usuario || !contrasena) {
        loginMensaje.textContent = "Escribí el usuario y la contraseña.";
        return;
    }

    btnLogin.disabled = true;
    loginMensaje.textContent = "";
    try {
        const datos = await pedirApi("/auth/login", {
            method: "POST",
            body: JSON.stringify({ usuario, contrasena }),
        });
        guardarToken(datos.access_token);
        formLogin.reset();
        await mostrarPanel();
    } catch (error) {
        loginMensaje.textContent = error.message;
    } finally {
        btnLogin.disabled = false;
    }
});

btnCerrarSesion.addEventListener("click", () => cerrarSesion());

// ---------- Lista de camisetas ----------

async function cargarCamisetas() {
    avisar("Cargando camisetas...");
    try {
        camisetas = await pedirApi("/camisetas");
        dibujarLista();
        avisar("");
    } catch (error) {
        if (error.message !== "Sesión vencida") avisar(error.message, true);
    }
}

function dibujarLista() {
    listaCamisetas.replaceChildren();
    const agotadas = camisetas.filter((c) => !c.disponible).length;
    const plural = (n, singular, varias) => `${n} ${n === 1 ? singular : varias}`;
    resumen.textContent = [
        plural(camisetas.length, "camiseta", "camisetas"),
        plural(camisetas.length - agotadas, "disponible", "disponibles"),
        plural(agotadas, "agotada", "agotadas"),
    ].join(" · ");

    if (camisetas.length === 0) {
        const vacio = document.createElement("li");
        vacio.className = "text-center text-gray-500 py-10";
        vacio.textContent = "No hay camisetas. Creá la primera con el botón “Nueva camiseta”.";
        listaCamisetas.appendChild(vacio);
        return;
    }

    camisetas.forEach((camiseta) => listaCamisetas.appendChild(crearFila(camiseta)));
}

// Recibe una camiseta. Devuelve el <li> con su foto, datos y botones.
function crearFila(camiseta) {
    const li = document.createElement("li");
    li.className = "bg-white border border-gray-200 rounded-2xl p-4 flex flex-wrap items-center gap-4";

    const img = document.createElement("img");
    img.src = camiseta.imagen;
    img.alt = "";
    img.className = "h-16 w-16 rounded-lg object-contain bg-gray-100 shrink-0";
    img.addEventListener("error", () => { img.src = IMAGEN_VACIA; }, { once: true });

    const info = document.createElement("div");
    info.className = "flex-1 min-w-[12rem]";
    const nombre = document.createElement("p");
    nombre.className = "font-bold";
    nombre.textContent = camiseta.nombre;
    const detalle = document.createElement("p");
    detalle.className = "text-sm text-gray-500";
    const etiquetas = [camiseta.categoria, "₡" + Number(camiseta.precio).toLocaleString("es-CR")];
    if (camiseta.playerVersion) etiquetas.push("Player");
    if (camiseta.destacado) etiquetas.push("★ Destacada");
    detalle.textContent = etiquetas.join(" · ");
    info.append(nombre, detalle);

    // Interruptor Disponible / Agotada
    const interruptor = document.createElement("button");
    interruptor.type = "button";
    interruptor.setAttribute("aria-pressed", String(camiseta.disponible));
    interruptor.setAttribute("aria-label", `${camiseta.nombre}: ${camiseta.disponible ? "disponible" : "agotada"}. Cambiar estado`);
    interruptor.className = camiseta.disponible
        ? "px-4 py-1.5 rounded-full text-sm font-bold bg-green-100 text-green-800 hover:bg-green-200 disabled:opacity-50"
        : "px-4 py-1.5 rounded-full text-sm font-bold bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50";
    interruptor.textContent = camiseta.disponible ? "● Disponible" : "● Agotada";
    interruptor.addEventListener("click", () => cambiarDisponible(camiseta, interruptor));

    const btnEditar = document.createElement("button");
    btnEditar.type = "button";
    btnEditar.className = "px-4 py-1.5 rounded-full text-sm font-bold border border-gray-300 hover:bg-gray-100";
    btnEditar.textContent = "Editar";
    btnEditar.addEventListener("click", () => abrirFormulario(camiseta));

    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.className = "px-4 py-1.5 rounded-full text-sm font-bold text-red-600 hover:bg-red-50";
    btnEliminar.textContent = "Eliminar";
    btnEliminar.addEventListener("click", () => pedirConfirmacion(camiseta));

    const acciones = document.createElement("div");
    acciones.className = "flex flex-wrap items-center gap-2";
    acciones.append(interruptor, btnEditar, btnEliminar);

    li.append(img, info, acciones);
    return li;
}

// Recibe la camiseta y su botón. Cambia disponible en la API y redibuja.
async function cambiarDisponible(camiseta, boton) {
    boton.disabled = true;
    try {
        const actualizada = await pedirApi(`/camisetas/${camiseta.id}`, {
            method: "PATCH",
            body: JSON.stringify({ disponible: !camiseta.disponible }),
        });
        reemplazarEnLista(actualizada);
        avisar(`${actualizada.nombre} ahora está ${actualizada.disponible ? "disponible" : "agotada"}.`);
    } catch (error) {
        if (error.message !== "Sesión vencida") avisar(error.message, true);
        boton.disabled = false;
    }
}

function reemplazarEnLista(actualizada) {
    camisetas = camisetas.map((c) => (c.id === actualizada.id ? actualizada : c));
    dibujarLista();
}

// ---------- Crear y editar ----------

// Recibe una camiseta para editar, o nada para crear una nueva.
function abrirFormulario(camiseta = null) {
    idEnEdicion = camiseta ? camiseta.id : null;
    tituloFormulario.textContent = camiseta ? "Editar camiseta" : "Nueva camiseta";
    formMensaje.textContent = "";

    document.querySelector("#campoNombre").value = camiseta?.nombre ?? "";
    document.querySelector("#campoDescripcion").value = camiseta?.descripcion ?? "";
    document.querySelector("#campoPrecio").value = camiseta?.precio ?? "";
    document.querySelector("#campoCategoria").value = camiseta?.categoria ?? "Selecciones";
    imagenActual = camiseta?.imagen ?? "";
    // Si es una foto subida (base64), no se mete en el campo de texto; solo se ve en la vista previa.
    campoImagen.value = imagenActual.startsWith("data:") ? "" : imagenActual;
    campoArchivoImagen.value = "";
    const tallas = camiseta?.tallas ?? ["S", "M", "L", "XL"];
    document.querySelectorAll("#campoTallas input").forEach((casilla) => {
        casilla.checked = tallas.includes(casilla.value);
    });
    document.querySelector("#campoDisponible").checked = camiseta ? camiseta.disponible : true;
    document.querySelector("#campoPlayer").checked = camiseta ? camiseta.playerVersion : false;
    document.querySelector("#campoDestacado").checked = camiseta ? camiseta.destacado : false;

    vistaPreviaImagen.src = imagenActual || IMAGEN_VACIA;
    dialogoCamiseta.showModal();
    document.querySelector("#campoNombre").focus();
}

// Recibe un texto (ruta, dirección o foto en base64). Lo guarda como imagen actual
// y actualiza la vista previa. No devuelve nada.
function fijarImagen(valor) {
    imagenActual = valor;
    vistaPreviaImagen.src = valor || IMAGEN_VACIA;
}

// Al escribir una ruta o dirección, esa pasa a ser la imagen de la camiseta.
campoImagen.addEventListener("input", () => fijarImagen(campoImagen.value.trim()));
vistaPreviaImagen.addEventListener("error", () => {
    if (!vistaPreviaImagen.src.endsWith(IMAGEN_VACIA)) vistaPreviaImagen.src = IMAGEN_VACIA;
});

// Recibe un archivo de imagen. Lo achica a 600px, lo convierte a JPEG (base64)
// y lo deja como foto de la camiseta. No devuelve nada; avisa si algo falla.
function cargarArchivoImagen(archivo) {
    if (!archivo || !archivo.type.startsWith("image/")) {
        formMensaje.textContent = "El archivo debe ser una imagen (jpg, png...).";
        return;
    }
    const lector = new FileReader();
    lector.onload = () => {
        const img = new Image();
        img.onload = () => {
            // Reduce la foto para que no pese mucho en la base de datos.
            const MAX = 600;
            const escala = Math.min(1, MAX / Math.max(img.width, img.height));
            const lienzo = document.createElement("canvas");
            lienzo.width = Math.round(img.width * escala);
            lienzo.height = Math.round(img.height * escala);
            const ctx = lienzo.getContext("2d");
            // Rellena de blanco antes de dibujar: así una PNG con fondo transparente
            // no queda con fondo negro al convertirla a JPEG.
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, lienzo.width, lienzo.height);
            ctx.drawImage(img, 0, 0, lienzo.width, lienzo.height);
            fijarImagen(lienzo.toDataURL("image/jpeg", 0.8));
            campoImagen.value = ""; // La foto subida manda; se limpia el campo de ruta.
            formMensaje.textContent = "";
        };
        img.onerror = () => { formMensaje.textContent = "No se pudo leer la imagen."; };
        img.src = lector.result;
    };
    lector.onerror = () => { formMensaje.textContent = "No se pudo leer el archivo."; };
    lector.readAsDataURL(archivo);
}

// Elegir un archivo desde el explorador.
campoArchivoImagen.addEventListener("change", () => {
    if (campoArchivoImagen.files[0]) cargarArchivoImagen(campoArchivoImagen.files[0]);
});

// Arrastrar y soltar una foto sobre la zona.
["dragover", "dragleave", "drop"].forEach((evento) => {
    zonaImagen.addEventListener(evento, (e) => e.preventDefault());
});
zonaImagen.addEventListener("dragover", () => zonaImagen.classList.add("border-black"));
zonaImagen.addEventListener("dragleave", () => zonaImagen.classList.remove("border-black"));
zonaImagen.addEventListener("drop", (e) => {
    zonaImagen.classList.remove("border-black");
    if (e.dataTransfer.files[0]) cargarArchivoImagen(e.dataTransfer.files[0]);
});

// Sin entradas. Devuelve los datos del formulario o un texto de error.
function leerFormulario() {
    const datos = {
        nombre: document.querySelector("#campoNombre").value.trim(),
        descripcion: document.querySelector("#campoDescripcion").value.trim(),
        precio: Number(document.querySelector("#campoPrecio").value),
        categoria: document.querySelector("#campoCategoria").value,
        imagen: imagenActual,
        tallas: [...document.querySelectorAll("#campoTallas input:checked")].map((c) => c.value),
        disponible: document.querySelector("#campoDisponible").checked,
        playerVersion: document.querySelector("#campoPlayer").checked,
        destacado: document.querySelector("#campoDestacado").checked,
    };

    // Las mismas reglas que valida el backend, para avisar antes de enviar.
    if (datos.nombre.length < 2) return { error: "El nombre debe tener al menos 2 caracteres." };
    if (datos.descripcion.length < 2) return { error: "La descripción debe tener al menos 2 caracteres." };
    if (!Number.isInteger(datos.precio) || datos.precio <= 0) return { error: "El precio debe ser un número entero mayor que 0." };
    if (datos.imagen.length < 2) return { error: "Agregá una imagen: subí una foto o escribí una ruta." };
    return { datos };
}

formCamiseta.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const { datos, error } = leerFormulario();
    if (error) {
        formMensaje.textContent = error;
        return;
    }

    btnGuardar.disabled = true;
    formMensaje.textContent = "";
    try {
        if (idEnEdicion === null) {
            const nueva = await pedirApi("/camisetas", { method: "POST", body: JSON.stringify(datos) });
            camisetas.push(nueva);
            dibujarLista();
            avisar(`${nueva.nombre} se agregó al catálogo.`);
        } else {
            const actualizada = await pedirApi(`/camisetas/${idEnEdicion}`, { method: "PATCH", body: JSON.stringify(datos) });
            reemplazarEnLista(actualizada);
            avisar(`Se guardaron los cambios de ${actualizada.nombre}.`);
        }
        dialogoCamiseta.close();
    } catch (err) {
        if (err.message !== "Sesión vencida") formMensaje.textContent = err.message;
    } finally {
        btnGuardar.disabled = false;
    }
});

btnNueva.addEventListener("click", () => abrirFormulario());

// ---------- Eliminar ----------

function pedirConfirmacion(camiseta) {
    idAEliminar = camiseta.id;
    nombreEliminar.textContent = camiseta.nombre;
    dialogoEliminar.showModal();
}

btnConfirmarEliminar.addEventListener("click", async () => {
    btnConfirmarEliminar.disabled = true;
    try {
        await pedirApi(`/camisetas/${idAEliminar}`, { method: "DELETE" });
        const eliminada = camisetas.find((c) => c.id === idAEliminar);
        camisetas = camisetas.filter((c) => c.id !== idAEliminar);
        dibujarLista();
        avisar(`${eliminada ? eliminada.nombre : "La camiseta"} se eliminó.`);
        dialogoEliminar.close();
    } catch (error) {
        if (error.message !== "Sesión vencida") {
            dialogoEliminar.close();
            avisar(error.message, true);
        }
    } finally {
        btnConfirmarEliminar.disabled = false;
    }
});

// Botones "Cancelar" y "×" de los dos diálogos. Esc los cierra solo.
document.querySelectorAll("[data-cerrar]").forEach((boton) => {
    boton.addEventListener("click", () => boton.closest("dialog").close());
});

// ---------- Arranque ----------

const tokenGuardado = leerToken();
if (tokenGuardado && !tokenVencido(tokenGuardado)) {
    mostrarPanel();
} else {
    guardarToken(null);
    mostrarLogin();
}
