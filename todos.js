const supabaseUrl = "https://akezoxfgidmbemwtmtci.supabase.co"; 
const supabaseKey = "sb_publishable_3isSu0UrNor0Jxh4HbBKhA_Q3p3UxrJ";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

let productos = [];

// 🔵 CARGAR PRODUCTOS
async function cargarProductos() {
  const { data, error } = await supabaseClient
    .from("productos")
    .select("*");

  if (error) {
    console.error(error);
    alert("Error cargando productos");
    return;
  }

  productos = data || [];
  render();
}

// 🔍 FILTRAR Y MOSTRAR
function render(filtro = "", estacion = "") {
  const cont = document.getElementById("todosProductos");
  cont.innerHTML = "";

  productos
    .filter(p =>
      p.nombre.toLowerCase().includes(filtro.toLowerCase()) &&
      (estacion === "" || p.estacion === estacion)
    )
    .forEach(p => {
      const div = document.createElement("div");
      div.className = "producto";

      div.innerHTML = `
        <img src="${p.foto1}" style="width:150px">
        <h4>${p.nombre}</h4>
        <p>$${p.precio}</p>
        <a href="producto.html?nombre=${encodeURIComponent(p.nombre)}">Ver</a>
      `;

      cont.appendChild(div);
    });
}

// 🔎 BUSCADOR
function activarBusqueda() {
  const input = document.getElementById("busqueda");
  input.addEventListener("input", e => {
    render(e.target.value);
  });
}

// 🌦 FILTRO ESTACIÓN
function filtrarEstacion(estacion) {
  render(document.getElementById("busqueda")?.value || "", estacion);
}

// INIT
document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
  activarBusqueda();
});