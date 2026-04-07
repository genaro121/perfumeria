const supabaseUrl = "https://akezoxfgidmbemwtmtci.supabase.co"; 
const supabaseKey = "sb_publishable_3isSu0UrNor0Jxh4HbBKhA_Q3p3UxrJ";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// 🔍 OBTENER NOMBRE DESDE URL
function obtenerNombre() {
  const params = new URLSearchParams(window.location.search);
  return params.get("nombre");
}

// 🔎 CARGAR PRODUCTO
async function cargarProducto() {
  const nombre = obtenerNombre();

  if (!nombre) {
    mostrarError();
    return;
  }

  const { data, error } = await supabaseClient
    .from("productos")
    .select("*")
    .ilike("nombre", nombre);

  if (error || !data || data.length === 0) {
    mostrarError();
    return;
  }

  mostrarProducto(data[0]);
}

// 🎨 MOSTRAR PRODUCTO
function mostrarProducto(p) {
  const cont = document.getElementById("productoDetalle");

  cont.innerHTML = `
    <h2>${p.nombre}</h2>
    <img src="${p.foto1}" style="max-width:300px">
    <img src="${p.foto2}" style="max-width:300px">
    <p><b>Precio:</b> $${p.precio}</p>
    <p>${p.descripcion}</p>
    <a href="index.html">⬅ Volver</a>
  `;
}

// ❌ ERROR
function mostrarError() {
  const cont = document.getElementById("productoDetalle");

  cont.innerHTML = `
    <h2>Producto no encontrado</h2>
    <a href="index.html">⬅ Volver al inicio</a>
  `;
}

// INIT
document.addEventListener("DOMContentLoaded", cargarProducto);