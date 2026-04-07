// 🔵 BANNER (AHORA CON SUPABASE)

let banners = [];
let bannerIndex = 0;
let intervaloBanner = null;

// ⏱️ TIEMPO ENTRE IMÁGENES (MODIFICABLE)
const TIEMPO_BANNER = 4000;

// convertir imagen
function fileToBase64Banner(file) {
  return new Promise((res) => {
    let reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.readAsDataURL(file);
  });
}

// agregar imagen (GUARDA EN SUPABASE)
async function agregarBanner() {
  if (!adminActivo) return alert("No autorizado");

  let file = document.getElementById("bannerInput")?.files[0];
  if (!file) return alert("Seleccioná una imagen");

  let img = await fileToBase64Banner(file);

  let { error } = await supabaseClient
    .from("banners")
    .insert([{ imagen: img }]);

  if (error) {
    console.error(error);
    return alert("Error al guardar banner");
  }

  cargarBanners();
}

// eliminar imagen (ELIMINA DE SUPABASE)
async function eliminarBanner() {
  if (!adminActivo) return alert("No autorizado");

  let index = document.getElementById("eliminarBannerSelect")?.value;

  let bannerAEliminar = banners[index];
  if (!bannerAEliminar) return;

  let { error } = await supabaseClient
    .from("banners")
    .delete()
    .eq("imagen", bannerAEliminar);

  if (error) {
    console.error(error);
    return alert("Error al eliminar banner");
  }

  cargarBanners();
}

// cargar desde supabase
async function cargarBanners() {
  let { data, error } = await supabaseClient
    .from("banners")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  banners = data.map(b => b.imagen);
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
  if (intervaloBanner) {
    clearInterval(intervaloBanner);
  }

  intervaloBanner = setInterval(() => {
    let imgs = document.querySelectorAll(".banner-img");
    if (imgs.length === 0) return;

    imgs[bannerIndex].classList.remove("active");
    bannerIndex = (bannerIndex + 1) % imgs.length;
    imgs[bannerIndex].classList.add("active");

  }, TIEMPO_BANNER);
}

// mostrar panel admin banner
function actualizarBannerAdmin() {
  const panel = document.getElementById("adminBanner");
  if (!panel) return;

  panel.style.display = adminActivo ? "block" : "none";
}

// 🔁 integrar con tu render (NO SE TOCA LO TUYO)
const renderOriginal = render;
render = function(...args) {
  renderOriginal.apply(this, args);
  actualizarBannerAdmin();
};

// INIT BANNER
document.addEventListener("DOMContentLoaded", () => {
  cargarBanners();
});