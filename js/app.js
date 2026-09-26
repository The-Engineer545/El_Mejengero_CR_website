// Buscamos el botón y el menú en el HTML
const btnHamburguesa = document.querySelector("#btnHamburguesa");
const sidebarMenu = document.querySelector("#sidebarMenu");

// Le decimos al botón que escuche cuando le hacen "click"
btnHamburguesa.addEventListener("click", function () {
    // Intercambia las clases: si está oculto lo muestra, si está visible lo oculta
    sidebarMenu.classList.toggle("hidden");
    sidebarMenu.classList.toggle("flex");
});