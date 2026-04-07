// 🔵 BANNER CORREGIDO (SINCRONIZA ENTRE DISPOSITIVOS)

let banners = [];
let bannerIndex = 0;
let intervaloBanner = null;

const TIEMPO_BANNER = 4000;

function fileToBase64Banner(file) {
  return new Promise((res) => {
    let reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.readAsDataURL(file);
  });
}

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

async function eliminarBanner() {
  if (!adminActivo) return alert("No autorizado");

  let index = document.getElementById("eliminarBannerSelect")?.value;
  let banner = banners[index];

  if (!banner) return;

  let { error } = await supabaseClient
    .from("banners")
    .delete()
    .eq("id", banner.id);

  if (error) {
    console.error(error);
    return alert("Error al eliminar banner");
  }

  cargarBanners();
}

async function cargarBanners() {
  let { data, error } = await supabaseClient
    .from("banners")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  banners = data;
  renderBanner();
}

function renderBanner() {
  const cont = document.getElementById("bannerCarousel");
  const select = document.getElementById("eliminarBannerSelect");

  if (!cont) return;

  cont.innerHTML = "";
  if (select) select.innerHTML = "";

  banners.forEach((banner, i) => {
    let el = document.createElement("img");
    el.src = banner.imagen;
    el.className = "banner-img" + (i === 0 ? " active" : "");
    cont.appendChild(el);

    if (select) {
      select.add(new Option("Imagen " + (i + 1), i));
    }
  });

  bannerIndex = 0;
  iniciarCarrusel();
}

function iniciarCarrusel() {
  if (intervaloBanner) clearInterval(intervaloBanner);

  intervaloBanner = setInterval(() => {
    let imgs = document.querySelectorAll(".banner-img");
    if (imgs.length === 0) return;

    imgs[bannerIndex].classList.remove("active");
    bannerIndex = (bannerIndex + 1) % imgs.length;
    imgs[bannerIndex].classList.add("active");

  }, TIEMPO_BANNER);
}

function actualizarBannerAdmin() {
  const panel = document.getElementById("adminBanner");
  if (!panel) return;

  panel.style.display = adminActivo ? "block" : "none";
}

// 🔁 NO TOCA TU SISTEMA, SOLO SE ENGANCHA
const renderOriginal = render;
render = function(...args) {
  renderOriginal.apply(this, args);
  actualizarBannerAdmin();
};

// INIT
document.addEventListener("DOMContentLoaded", () => {
  cargarBanners();
});