// Constantes de LocalStorage

export const LS_CART = "cart.items";
const LS_PRODUCTS = "demo.products";

// Definición de categorías

export const CATEGORIES = {
  FRUTAS: {
    label: "Frutas Frescas",
    description:
      "Nuestra selección de frutas frescas ofrece una experiencia directa del campo a tu hogar. Estas frutas se cultivan y cosechan en el punto óptimo de madurez para asegurar su sabor y frescura.",
  },
  VERDURAS: {
    label: "Verduras Orgánicas",
    description:
      "Descubre nuestra gama de verduras orgánicas, cultivadas sin el uso de pesticidas ni químicos, garantizando un sabor auténtico y natural. Cada verdura es seleccionada por su calidad.",
  },
  ORGANICOS: {
    label: "Productos Orgánicos",
    description:
      "Nuestros productos orgánicos están elaborados con ingredientes naturales y procesados de manera responsable para mantener sus beneficios saludables. Desde aceites y miel hasta granos.",
  },
  LACTEOS: {
    label: "Productos Lácteos",
    description:
      "Los productos lácteos de HuertoHogar provienen de granjas locales que se dedican a la producción responsable y de calidad. Ofrecemos una gama de leches, yogures y otros derivados.",
  },
};

// Catálogo base de productos (predefinidos)

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

// Asignar categorías según prefijo del ID

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

// Leer productos desde localStorage

function productosDesdeLS() {
  try {
    const arr = JSON.parse(localStorage.getItem(LS_PRODUCTS) || "[]");
    if (!Array.isArray(arr)) return [];
    return arr;
  } catch (e) {
    return [];
  }
}

// Obtener catálogo completo (base + localStorage)

export function getCatalogo() {
  const fromLs = productosDesdeLS();
  // Combinar ambos catálogos, sobrescribiendo por ID si es necesario
  const map = new Map();
  // Primero, el catálogo base
  for (let i = 0; i < catalogoBase.length; i++) {
    const p = catalogoBase[i];
    map.set(p.id, p);
  }
  // Luego, los productos desde localStorage
  for (let i = 0; i < fromLs.length; i++) {
    const p = fromLs[i];
    map.set(p.id, p);
  }
  return Array.from(map.values());
}

// =================== Funciones del carrito ===================

// Cargar carrito desde LocalStorage

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(LS_CART) || "[]");
  } catch (e) {
    return [];
  }
}

// Guardar carrito en LocalStorage

function saveCart(arr) {
  localStorage.setItem(LS_CART, JSON.stringify(arr));
}

// Formatear número a CLP

function formatCLP(n) {
  return n.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });
}

// Actualizar el contador del carrito en la UI

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

// =================== Funciones del Catálogo ===================

// Estado actual del filtro de categoría
let currentCategory = "ALL"; 

// Inicializar UI del catálogo

export function initCatalogoUI() {
  const sel = document.getElementById("filtroCategoria");
  if (sel) {
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

// Renderizar descripción de la categoría seleccionada

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

// Renderizar el catálogo de productos según la categoría seleccionada

function renderCatalogo() {
  const cont = document.getElementById("productos");
  // Si no existe el contenedor, salir
  if (!cont) return;
  const productos = getCatalogo();
  cont.innerHTML = "";
  
  const list = productos.filter(
    (p) => currentCategory === "ALL" || p.categoria === currentCategory
  );

  // Si no hay productos en la categoría seleccionada, mostrar mensaje
  if (list.length === 0) {
    cont.innerHTML =
      '<div class="col-12"><div class="text-secondary">No hay productos en esta categoría.</div></div>';
    return;
  }

  // Renderizar productos filtrados
  list.forEach((prod) => {
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-md-4";

    col.innerHTML = `
      <div class="card producto-card h-100">
        <img src="${prod.imagen}" alt="${prod.nombre}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${prod.nombre}</h5>
          <p class="card-text mb-1">${formatCLP(prod.precio)}</p>
          ${
            prod.categoria
              ? `<span class="badge bg-success align-self-start mb-3">${
                  CATEGORIES[prod.categoria]?.label || ""
                }</span>`
              : ""
          }
          <div class="mt-auto d-grid">
            <button class="btn btn-primary" onclick="window.HuertoHogar.agregarAlCarrito('${
              prod.id
            }')">Agregar</button>
          </div>
        </div>
      </div>
    `;
    cont.appendChild(col);
  });
}

// =================== Funciones de acción del carrito ===================

// Agregar producto al carrito

export function agregarAlCarrito(id) {
  const productos = getCatalogo();
  const prod = productos.find((p) => p.id === id);
  if (!prod) return;

  let cart = loadCart();
  let found = cart.find((item) => item.id === id);

  if (found) {
    found.cantidad += 1;
  } else {
    cart.push({
      id: prod.id,
      nombre: prod.nombre,
      precio: prod.precio,
      cantidad: 1,
      imagen: prod.imagen,
      descripcion: prod.descripcion || "",
      categoria: prod.categoria,
    });
  }
  saveCart(cart);
  updateCartBadge();
  return prod.nombre;
}

// Incrementar cantidad de un producto en el carrito

function incrementar(index) {
  let cart = loadCart();
  if (!cart[index]) return;
  cart[index].cantidad += 1;
  saveCart(cart);
  renderCarrito();
  updateCartBadge();
}

// Decrementar cantidad de un producto en el carrito

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

// Eliminar un producto del carrito

function eliminarDelCarrito(index) {
  let cart = loadCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCarrito();
  updateCartBadge();
}

// Vaciar todo el carrito

function vaciarCarrito() {
  localStorage.removeItem(LS_CART);
  renderCarrito();
  updateCartBadge();
}

// Renderizar el carrito en la UI

function renderCarrito() {
  const tbody = document.getElementById("tbodyCarrito");
  const totalEl = document.getElementById("totalTexto");
  if (!tbody || !totalEl) return;

  const cart = loadCart();
  tbody.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" class="text-secondary">Tu carrito está vacío.</td></tr>';
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

// =================== Funciones de inicialización de UI ===================

// Inicializar UI de la página de inicio

export function initHomeUI() {
  const destacados = document.getElementById("destacados");
  if (!destacados) return;

  const productos = getCatalogo().slice(0, 3);
  destacados.innerHTML = productos
    .map(
      (p) => `
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <img src="${p.imagen}" class="card-img-top" alt="${p.nombre}">
          <div class="card-body text-center">
            <h5 class="card-title">${p.nombre}</h5>
            <p class="card-text">${
              p.categoria ? CATEGORIES[p.categoria]?.label || "" : ""
            }</p>
            <p class="texto-esmeralda fw-bold">${formatCLP(p.precio)}</p>
            <a href="productos.html" class="btn btn-outline-primary">Ver Detalles</a>
          </div>
        </div>
      </div>
    `
    )
    .join("");
  updateCartBadge();
}

// Inicializar UI de la página del carrito

export function initCarritoUI() {
  renderCarrito();
  updateCartBadge();

  const btnVaciar = document.getElementById("btnVaciarCarrito");
  if (btnVaciar && !btnVaciar.dataset.listenerAttached) {
    btnVaciar.addEventListener("click", () => {
      if (confirm("¿Estás seguro de que deseas vaciar el carrito?")) {
        vaciarCarrito();
      }
    });
    btnVaciar.dataset.listenerAttached = "true";
  }
}

// Exponer funciones globalmente
window.HuertoHogar = {
  agregarAlCarrito,
  incrementar,
  decrementar,
  eliminarDelCarrito,
  vaciarCarrito,
  renderCarrito,
  updateCartBadge,
  initHomeUI,
  initCatalogoUI,
  initCarritoUI,
};
