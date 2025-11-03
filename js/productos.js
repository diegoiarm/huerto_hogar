// --- Constantes para localStorage ---
export const LS_CART = "cart.items";
const LS_PRODUCTS = "demo.products";

// --- Definiciones de Categorías ---
export const CATEGORIES = {
  FRUTAS: {
    label: "Frutas Frescas",
    description:
      "Nuestra selección de frutas frescas ofrece una experiencia directa del campo a tu hogar. Estas frutas se cultivan y cosechan en el punto óptimo de madurez para asegurar su sabor y frescura...",
  },
  VERDURAS: {
    label: "Verduras Orgánicas",
    description:
      "Descubre nuestra gama de verduras orgánicas, cultivadas sin el uso de pesticidas ni químicos, garantizando un sabor auténtico y natural. Cada verdura es seleccionada por su calidad...",
  },
  ORGANICOS: {
    label: "Productos Orgánicos",
    description:
      "Nuestros productos orgánicos están elaborados con ingredientes naturales y procesados de manera responsable para mantener sus beneficios saludables. Desde aceites y miel hasta granos...",
  },
  LACTEOS: {
    label: "Productos Lácteos",
    description:
      "Los productos lácteos de HuertoHogar provienen de granjas locales que se dedican a la producción responsable y de calidad. Ofrecemos una gama de leches, yogures y otros derivados...",
  },
};

// --- Catálogo Base ---
// (Reemplaza el catálogo incompleto del 'Producto.js actual')
const catalogoBase = [
  { id: "FR001", nombre: "Manzana Fuji", precio: 1200, imagen: "img/manzana.webp" },
  { id: "FR002", nombre: "Naranja Valencia", precio: 1000, imagen: "img/naranja.jpg" },
  { id: "FR003", nombre: "Plátano Cavendish", precio: 800, imagen: "img/platano.jpg" },
  { id: "VR001", nombre: "Zanahorias Orgánicas", precio: 900, imagen: "img/zanahoria.jpg" },
  { id: "VR002", nombre: "Espinacas Frescas", precio: 700, imagen: "img/espinaca.jpg" },
  { id: "VR003", nombre: "Pimientos Tricolores", precio: 1500, imagen: "img/pimiento.jpg" },
  { id: "PO001", nombre: "Miel Orgánica", precio: 5000, imagen: "img/miel.png" },
  { id: "PO003", nombre: "Quinua Orgánica", precio: 2000, imagen: "img/quinoa.webp" },
  { id: "PL001", nombre: "Leche Entera", precio: 1800, imagen: "img/leche.webp" },
];

// --- Lógica de Productos (LocalStorage y Catálogo) ---

function setCategoriaPorPrefijo(arr) {
  for (let i = 0; i < arr.length; i++) {
    let p = arr[i];
    let pref = (p.id || "").slice(0, 2).toUpperCase();
    if (pref === "FR") p.categoria = "FRUTAS";
    else if (pref === "VR") p.categoria = "VERDURAS";
    else if (pref === "PO") p.categoria = "ORGANICOS";
    else if (pref === "PL") p.categoria = "LACTEOS";
  }
  return arr;
}
setCategoriaPorPrefijo(catalogoBase);

function productosDesdeLS() {
  let arr = [];
  try {
    let adminProds = JSON.parse(localStorage.getItem(LS_PRODUCTS) || "[]");
    for (let i = 0; i < adminProds.length; i++) {
      let p = adminProds[i];
      let id = p.id || "ADM_" + (p.name || "").replace(/\s+/g, "_") + "_" + i;
      let cat = null;
      let cstr = (p.category || "").toLowerCase();
      if (cstr.indexOf("fruta") >= 0) cat = "FRUTAS";
      else if (cstr.indexOf("verdura") >= 0) cat = "VERDURAS";
      else if (cstr.indexOf("orgánic") >= 0 || cstr.indexOf("organico") >= 0) cat = "ORGANICOS";
      else if (cstr.indexOf("lácte") >= 0 || cstr.indexOf("lacteo") >= 0) cat = "LACTEOS";

      arr.push({
        id: id,
        nombre: p.name || "Producto",
        precio: parseInt(p.price || 0, 10),
        imagen: "assets/productos/placeholder.jpg",
        categoria: cat || "ORGANICOS",
      });
    }
  } catch (e) {}
  return arr;
}

export function getCatalogo() {
  return productosDesdeLS().concat(catalogoBase);
}

// --- Lógica del Carrito (Helpers) ---

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(LS_CART) || "[]");
  } catch (e) {
    return [];
  }
}

function saveCart(arr) {
  localStorage.setItem(LS_CART, JSON.stringify(arr));
}

function formatCLP(n) {
  return n.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });
}

function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  if (!badge) return;
  const cart = loadCart();
  let count = 0;
  for (let i = 0; i < cart.length; i++) {
    count += cart[i].cantidad;
  }
  badge.textContent = count;
}

// =================== Catálogo (para Producto.jsx) ===================

let currentCategory = "ALL"; // Variable para guardar el estado del filtro

/**
 * ✅ FUNCIÓN EXPORTADA: Inicializa la UI del catálogo.
 * Esta es la función que tu componente Producto.jsx debe importar y llamar.
 */
export function initCatalogoUI() {
  const sel = document.getElementById("filtroCategoria");
  if (sel) {
    // Usamos una variable para evitar agregar listeners duplicados en React
    if (!sel.dataset.listenerAttached) {
      sel.addEventListener("change", () => {
        currentCategory = sel.value;
        renderCategoriaDescripcion(currentCategory);
        renderCatalogo();
      });
      sel.dataset.listenerAttached = "true";
    }
  }
  renderCategoriaDescripcion(currentCategory);
  renderCatalogo();
  updateCartBadge();
}

function renderCategoriaDescripcion(catKey) {
  const box = document.getElementById("descripcionCategoria");
  if (!box) return;

  if (catKey === "ALL") {
    box.innerHTML = "<strong>Explora todo nuestro catálogo</strong><br>Filtra por categoría para ver una curaduría de productos.";
    return;
  }
  const data = CATEGORIES[catKey];
  if (!data) {
    box.innerHTML = "";
    return;
  }
  box.innerHTML = `<strong>${data.label}</strong><br>${data.description}`;
}

function renderCatalogo() {
  const cont = document.getElementById("productos");
  if (!cont) return;

  const productos = getCatalogo();
  cont.innerHTML = "";

  // Filtramos la lista de productos
  const list = productos.filter(p => currentCategory === "ALL" || p.categoria === currentCategory);

  if (list.length === 0) {
    cont.innerHTML = '<div class="col-12"><div class="text-secondary">No hay productos en esta categoría.</div></div>';
    return;
  }

  // Renderizamos cada producto
  list.forEach(prod => {
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-md-4";

    // Usamos template literals y llamamos a la función global
    col.innerHTML = `
      <div class="card producto-card h-100">
        <img src="${prod.imagen}" alt="${prod.nombre}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${prod.nombre}</h5>
          <p class="card-text mb-1">${formatCLP(prod.precio)}</p>
          ${prod.categoria ? `<span class="badge bg-success align-self-start mb-3">${CATEGORIES[prod.categoria].label}</span>` : ""}
          <div class="mt-auto d-grid">
            <button class="btn btn-primary" onclick="window.HuertoHogar.agregarAlCarrito('${prod.id}')">Agregar</button>
          </div>
        </div>
      </div>
    `;
    cont.appendChild(col);
  });
}

// =================== Funciones del Carrito (Acciones) ===================

export function agregarAlCarrito(id) {
  const productos = getCatalogo();
  const prod = productos.find(p => p.id === id);
  if (!prod) return;

  let cart = loadCart();
  let found = cart.find(item => item.id === id);

  if (found) {
    found.cantidad += 1;
  } else {
    cart.push({ 
      id: prod.id, 
      nombre: prod.nombre, 
      precio: prod.precio, 
      cantidad: 1,
      imagen: prod.imagen,
      descripcion: prod.descripcion || '',
      categoria: prod.categoria
    });
  }
  saveCart(cart);
  updateCartBadge();
  return prod.nombre; // Retornamos el nombre en lugar de mostrar alert
}

function incrementar(index) {
  let cart = loadCart();
  if (!cart[index]) return;
  cart[index].cantidad += 1;
  saveCart(cart);
  renderCarrito();
  updateCartBadge();
}

function decrementar(index) {
  let cart = loadCart();
  if (!cart[index]) return;
  cart[index].cantidad -= 1;
  if (cart[index].cantidad <= 0) {
    cart.splice(index, 1);
  }
  saveCart(cart);
  renderCarrito();
  updateCartBadge();
}

function eliminarDelCarrito(index) {
  let cart = loadCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCarrito();
  updateCartBadge();
}

function vaciarCarrito() {
  localStorage.removeItem(LS_CART);
  renderCarrito();
  updateCartBadge();
}

function renderCarrito() {
  const tbody = document.getElementById("tbodyCarrito");
  const totalEl = document.getElementById("totalTexto");
  if (!tbody || !totalEl) return; // No estamos en la página del carrito

  const cart = loadCart();
  tbody.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-secondary">Tu carrito está vacío.</td></tr>';
    totalEl.textContent = formatCLP(0);
    return;
  }

  cart.forEach((item, i) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.nombre}</td>
      <td class="text-center">
        <div class="btn-group btn-group-sm" role="group">
          <button class="btn btn-outline-secondary" onclick="window.HuertoHogar.decrementar(${i})">−</button>
          <span class="btn btn-light disabled">${item.cantidad}</span>
          <button class="btn btn-outline-secondary" onclick="window.HuertoHogar.incrementar(${i})">+</button>
        </div>
      </td>
      <td class="text-end">${formatCLP(item.precio)}</td>
      <td class="text-end">${formatCLP(subtotal)}</td>
      <td class="text-end">
        <button class="btn btn-outline-danger btn-sm" onclick="window.HuertoHogar.eliminarDelCarrito(${i})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  totalEl.textContent = formatCLP(total);
}

// =================== Lógica para OTRAS PÁGINAS ===================

/**
 * ✅ FUNCIÓN EXPORTABLE: Para la página de Home
 */
export function initHomeUI() {
  const destacados = document.getElementById("destacados");
  if (!destacados) return; // No estamos en home

  const productos = getCatalogo().slice(0, 3);
  destacados.innerHTML = productos
    .map(p => `
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <img src="${p.imagen}" class="card-img-top" alt="${p.nombre}">
          <div class="card-body text-center">
            <h5 class="card-title">${p.nombre}</h5>
            <p class="card-text">${p.categoria ? CATEGORIES[p.categoria].label : ""}</p>
            <p class="texto-esmeralda fw-bold">${formatCLP(p.precio)}</p>
            <a href="productos.html" class="btn btn-outline-primary">Ver Detalles</a>
          </div>
        </div>
      </div>
    `)
    .join("");
  updateCartBadge();
}

/**
 * ✅ FUNCIÓN EXPORTABLE: Para la página de Carrito
 */
export function initCarritoUI() {
  renderCarrito();
  updateCartBadge();
  
  // Asignar evento al botón de vaciar (si existe en esa página)
  const btnVaciar = document.getElementById("btnVaciarCarrito"); // Asume que el botón tiene este ID
  if (btnVaciar && !btnVaciar.dataset.listenerAttached) {
    btnVaciar.addEventListener("click", () => {
      if (confirm("¿Estás seguro de que deseas vaciar el carrito?")) {
        vaciarCarrito();
      }
    });
    btnVaciar.dataset.listenerAttached = "true";
  }
}


// --- EXPORTAR FUNCIONES GLOBALES ---
// Para que los 'onclick' del innerHTML funcionen desde un módulo,
// deben estar explícitamente en el objeto 'window'.
window.HuertoHogar = {
  agregarAlCarrito,
  incrementar,
  decrementar,
  eliminarDelCarrito,
  vaciarCarrito,
  // Exportamos estas también por si se necesitan
  renderCarrito,
  updateCartBadge,
  initHomeUI,
  initCatalogoUI,
  initCarritoUI
};