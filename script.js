

// 🔵 SUPABASE
const supabaseUrl = "https://akezoxfgidmbemwtmtci.supabase.co"; 
const supabaseKey = "sb_publishable_3isSu0UrNor0Jxh4HbBKhA_Q3p3UxrJ";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// 🔐 ADMIN
let adminActivo = false;

// DATOS
let categorias = [];
let productos = [];

// MENU
function toggleMenu(e){
  e.stopPropagation();
  document.getElementById("dropdownMenu").classList.toggle("show");
}

document.addEventListener("click", ()=>{
  document.getElementById("dropdownMenu")?.classList.remove("show");
});

// 🔐 ACTIVAR ADMIN (VERSIÓN ÚNICA Y CORRECTA)
function activarAdmin() {
  let mail = prompt("Ingresá tu mail de administrador:");

  if (mail && mail.toLowerCase().trim() === "genarobriigante741@gmail.com") {
    adminActivo = true;
    localStorage.setItem("adminActivo", "true");
    alert("Modo admin activado");
    render();
  } else {
    adminActivo = false;
    localStorage.removeItem("adminActivo");
    alert("No autorizado");
    ocultarPanelAdmin();
  }
}

function cerrarAdmin() {
  adminActivo = false;
  localStorage.removeItem("adminActivo");
  render();
}

function mostrarPanelAdmin() {
  if (!adminActivo) return;
  let panel = document.getElementById("panelAdmin");
  if (panel) panel.style.display = "block";
}

function ocultarPanelAdmin() {
  let panel = document.getElementById("panelAdmin");
  if (panel) panel.style.display = "none";
}

// BASE64
function fileToBase64(file) {
  return new Promise((res) => {
    let reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.readAsDataURL(file);
  });
}

// 🔵 CARGAR DESDE SUPABASE
async function cargarProductos() {
  let { data, error } = await supabaseClient.from("productos").select("*");

  if (error) {
    console.error(error);
    alert("Error cargando productos");
    return;
  }

  productos = data || [];
  categorias = [...new Set(productos.map(p => p.categoria))];

  render();
}

// CREAR PRODUCTO
async function crearProducto() {
  if(!adminActivo) return alert("No autorizado");

  let f1 = document.getElementById("foto1")?.files[0];
  let f2 = document.getElementById("foto2")?.files[0];

  if (!f1 || !f2) return alert("Faltan imágenes");

  let img1 = await fileToBase64(f1);
  let img2 = await fileToBase64(f2);

  let prod = {
    nombre: document.getElementById("nombre")?.value,
    precio: Number(document.getElementById("precio")?.value),
    descripcion: document.getElementById("descripcion")?.value,
    categoria: document.getElementById("categoriaSelect")?.value,
    estacion: document.getElementById("estacion")?.value,
    foto1: img1,
    foto2: img2
  };

  let { error } = await supabaseClient.from("productos").insert([prod]);

  if (error) {
    console.error(error);
    return alert("Error al guardar");
  }

  cargarProductos();
}

// ELIMINAR PRODUCTO
async function eliminarProducto() {
  if(!adminActivo) return alert("No autorizado");

  let n = document.getElementById("eliminarProducto")?.value;

  let { error } = await supabaseClient
    .from("productos")
    .delete()
    .eq("nombre", n);

  if (error) {
    console.error(error);
    return alert("Error al eliminar");
  }

  cargarProductos();
}

// CATEGORIAS
function crearCategoria() {
  if(!adminActivo) return alert("No autorizado");
  let n = document.getElementById("nuevaCategoria")?.value;
  if (!n) return;
  categorias.push(n);
  render();
}

function eliminarCategoria() {
  if(!adminActivo) return alert("No autorizado");
  let c = document.getElementById("eliminarCategoria")?.value;
  categorias = categorias.filter(x => x !== c);
  render();
}

// UI
function flipCard(card) {
  document.querySelectorAll(".flip-card").forEach(c => {
    if (c !== card) c.classList.remove("flipped");
  });
  card.classList.toggle("flipped");
}

function filtrarEstacion(estacion) {
  render(document.getElementById("busqueda")?.value || "", estacion);
}

// RENDER
function render(filtro = "", estacionFiltro = "") {

  let cont = document.getElementById("categorias");
  if (!cont) return;

  cont.innerHTML = "";

  let catSel = document.getElementById("categoriaSelect");
  let elimCat = document.getElementById("eliminarCategoria");
  let elimProd = document.getElementById("eliminarProducto");

  if (catSel) catSel.innerHTML = "";
  if (elimCat) elimCat.innerHTML = "";
  if (elimProd) elimProd.innerHTML = "";

  categorias.forEach(cat => {

    if (catSel) catSel.add(new Option(cat, cat));
    if (elimCat) elimCat.add(new Option(cat, cat));

    let div = document.createElement("div");
    div.innerHTML = `<h2>${cat}</h2>`;

    let prods = document.createElement("div");
    prods.className = "productos";

    productos
      .filter(p =>
        p.categoria === cat &&
        p.nombre.toLowerCase().includes(filtro.toLowerCase()) &&
        (estacionFiltro === "" || p.estacion === estacionFiltro)
      )
      .forEach(p => {

        if (elimProd) elimProd.add(new Option(p.nombre, p.nombre));

        let card = document.createElement("div");
        card.className = "producto";

        card.innerHTML = `
          <div class="flip-card" onclick="flipCard(this)">
            <div class="flip-inner">
              <div class="flip-front">
                <img src="${p.foto1}">
              </div>
              <div class="flip-back">
                <img src="${p.foto2}">
              </div>
            </div>
          </div>

          <h4>${p.nombre}</h4>
          <p>$${p.precio}</p>

          <a href="producto.html?nombre=${encodeURIComponent(p.nombre)}">Ver</a>
        `;

        prods.appendChild(card);
      });

    div.appendChild(prods);
    cont.appendChild(div);
  });

  if (adminActivo) {
    mostrarPanelAdmin();
  } else {
    ocultarPanelAdmin();
  }
}

// INIT
document.addEventListener("DOMContentLoaded", () => {

  if (localStorage.getItem("adminActivo") === "true") {
    adminActivo = true;
  }

  cargarProductos();

  let buscador = document.getElementById("busqueda");
  if (buscador) {
    buscador.addEventListener("input", e => {
      render(e.target.value);
    });
  }
});
// 🔵 BANNER

let banners = JSON.parse(localStorage.getItem("banners")) || [];
let bannerIndex = 0;

// convertir imagen
function fileToBase64Banner(file) {
  return new Promise((res) => {
    let reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.readAsDataURL(file);
  });
}

// agregar imagen
async function agregarBanner() {
  if (!adminActivo) return alert("No autorizado");

  let file = document.getElementById("bannerInput").files[0];
  if (!file) return alert("Seleccioná una imagen");

  let img = await fileToBase64Banner(file);

  banners.push(img);
  localStorage.setItem("banners", JSON.stringify(banners));

  renderBanner();
}

// eliminar imagen
function eliminarBanner() {
  if (!adminActivo) return alert("No autorizado");

  let index = document.getElementById("eliminarBannerSelect").value;

  banners.splice(index, 1);
  localStorage.setItem("banners", JSON.stringify(banners));

  renderBanner();
}

// render banner
function renderBanner() {
  const cont = document.getElementById("bannerCarousel");
  const select = document.getElementById("eliminarBannerSelect");

  if (!cont) return;

  cont.innerHTML = "";
  if (select) select.innerHTML = "";

  banners.forEach((img, i) => {
    let el = document.createElement("img");
    el.src = img;
    el.className = "banner-img" + (i === 0 ? " active" : "");
    cont.appendChild(el);

    if (select) {
      select.add(new Option("Imagen " + (i + 1), i));
    }
  });

  iniciarCarrusel();
}

// carrusel automático
function iniciarCarrusel() {
  setInterval(() => {
    let imgs = document.querySelectorAll(".banner-img");
    if (imgs.length === 3000) return;

    imgs[bannerIndex].classList.remove("active");
    bannerIndex = (bannerIndex + 1) % imgs.length;
    imgs[bannerIndex].classList.add("active");

  }, 3000);
}

// mostrar panel admin banner
function actualizarBannerAdmin() {
  const panel = document.getElementById("adminBanner");
  if (!panel) return;

  panel.style.display = adminActivo ? "block" : "none";
}

// 🔁 integrar con tu render
const renderOriginal = render;
render = function(...args) {
  renderOriginal.apply(this, args);
  actualizarBannerAdmin();
};

// INIT BANNER
document.addEventListener("DOMContentLoaded", () => {
  renderBanner();
});