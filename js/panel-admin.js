
// Importaciones de SweetAlert2 y catálogo de productos desde productos.js

import Swal from "sweetalert2";
import {getCatalogo} from "./productos.js";


// Constantes de localStorage (usuarios, sesión y productos)

const LS_USERS    = "demo.users";
const LS_SESSION  = "demo.session";
const LS_PRODUCTS = "demo.products";

// Leer el localStorage según clave y valor por defecto

function leerLS(clave, defecto) {
  const raw = localStorage.getItem(clave);
  if (!raw) return defecto;
  try { return JSON.parse(raw); } catch (_) { return defecto; }
}

// Escribir en el localStorage según clave

function escribirLS(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

// ================== Gestión de usuarios, sesión y productos ==================

function getUsers()        { return leerLS(LS_USERS,   []); }
function saveUsers(arr)    { escribirLS(LS_USERS, arr); }
function getSession()      { return leerLS(LS_SESSION, null); }
function setSession(obj)   { escribirLS(LS_SESSION, obj); }
function clearSession()    { localStorage.removeItem(LS_SESSION); }
function getProducts()     { return leerLS(LS_PRODUCTS, []); }
function saveProducts(arr) { escribirLS(LS_PRODUCTS, arr); }

// Renderizar la página del panel de administración

function render() {
  const sess = getSession();
  const adminView = document.getElementById("adminView");
  const badge     = document.getElementById("sessionBadge");

  if (!sess) {
    window.location.href = "/login";
    return;
  }

  if (badge) badge.textContent = `${sess.email} (${sess.role})`;

  // Solo mostrar panel admin si el usuario es admin
  // No redirigir a usuarios tipo "user", simplemente no mostrar el panel admin
  if (sess.role !== "admin") {
    if (adminView) adminView.classList.add("hidden");
    return;
  }

  if (adminView) adminView.classList.remove("hidden");

  cargarTablaUsuarios();
  cargarTablaProductos();
}

// Verificar si el usuario actual es admin

function esAdminActual() {
  const sess = getSession();
  return !!(sess && sess.role === "admin");
}

// Cargar la tabla de usuarios en el panel admin

function cargarTablaUsuarios() {
  const tbody = document.getElementById("tblUsers");
  if (!tbody) return;
  tbody.innerHTML = "";

  const users = getUsers();
  if (!users.length) {
    const tr = document.createElement("tr");
    tr.innerHTML = "<td colspan='3' class='text-secondary'>No hay usuarios.</td>";
    tbody.appendChild(tr);
    return;
  }

  users.forEach((u) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.email}</td>
      <td>
        <span class="badge ${u.role === "admin" ? "bg-warning text-dark" : "bg-secondary"}">
          ${u.role}
        </span>
      </td>
      <td class="text-end">
        <div class="btn-group btn-group-sm" role="group">
          <button class="btn btn-outline-success">Hacer admin</button>
          <button class="btn btn-outline-primary">Hacer user</button>
          <button class="btn btn-outline-danger">Eliminar</button>
        </div>
      </td>
    `;

    const [btnAdmin, btnUser, btnDelete] = tr.querySelectorAll("button");
    btnAdmin.addEventListener("click", () => setRole(u.email, "admin"));
    btnUser .addEventListener("click", () => setRole(u.email, "user"));
    btnDelete.addEventListener("click", () => borrarUsuario(u.email));

    tbody.appendChild(tr);
  });
}

// Establecer el rol de un usuario

function setRole(email, role) {
  if (!esAdminActual()) { Swal.fire("No autorizado", "", "error"); return; }

  const users = getUsers();
  let cambiado = false;

  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email) {
      users[i].role = role;
      cambiado = true;
      break;
    }
  }

  if (cambiado) {
    saveUsers(users);

    const sess = getSession();
    if (sess && sess.email === email) {
      sess.role = role;
      setSession(sess);
    }

    Swal.fire("OK", "Rol actualizado", "success");
    render();
  }
}

// Validar la contraseña de un nuevo usuario

function validarPassword(pass) {
  if (!pass) return { valido: false, mensaje: "La contraseña es obligatoria" };
  if (pass.length < 4 || pass.length > 10)
    return { valido: false, mensaje: "La contraseña debe tener entre 4 y 10 caracteres" };
  return { valido: true };
}

// Crear un nuevo usuario desde el panel admin

function crearUsuarioDemo() {
  if (!esAdminActual()) { Swal.fire("No autorizado", "", "error"); return; }
  const email = document.getElementById("nuEmail")?.value.trim();
  const pass  = document.getElementById("nuPass")?.value.trim();
  const role  = document.getElementById("nuRole")?.value || "user";

  if (!email) {
    Swal.fire("Faltan datos", "El email es obligatorio", "warning");
    return;
  }

  const vp = validarPassword(pass);
  if (!vp.valido) {
    Swal.fire("Error de validación", vp.mensaje, "warning");
    return;
  }

  const users = getUsers();
  const yaExiste = users.some((u) => u.email === email);
  if (yaExiste) {
    Swal.fire("Error", "Ya existe un usuario con ese email", "error");
    return;
  }

  users.push({ email, pass, role });
  saveUsers(users);

  const nuEmail = document.getElementById("nuEmail");
  const nuPass  = document.getElementById("nuPass");
  const nuRole  = document.getElementById("nuRole");
  if (nuEmail) nuEmail.value = "";
  if (nuPass)  nuPass.value  = "";
  if (nuRole)  nuRole.value  = "user";

  Swal.fire("OK", "Usuario creado", "success");
  render();
}

// Borrar un usuario por email

function borrarUsuario(email) {
  if (!esAdminActual()) { Swal.fire("No autorizado", "", "error"); return; }

  Swal.fire({
    title: "Eliminar usuario",
    text: "Esta acción es permanente",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
  }).then((res) => {
    if (!res.isConfirmed) return;

    const users = getUsers().filter((u) => u.email !== email);
    saveUsers(users);

    const sess = getSession();
    if (sess && sess.email === email) clearSession();

    Swal.fire("Hecho", "Usuario eliminado", "success");
    render();
  });
}

// ===================== Gestión de productos =====================

// Cargar la tabla de productos en el panel admin
function cargarTablaProductos() {
  const tbody = document.getElementById("tblProducts");
  if (!tbody) return;
  tbody.innerHTML = "";

  // Usamos el catálogo combinado (base + LS, con LS sobrescribiendo por id)
  let products = getCatalogo().map((p) => ({
    id: p.id,
    nombre: p.nombre,
    descripcion: p.descripcion || "",
    stock: p.stock ?? 0,
    precio: p.precio ?? 0,
    categoria: p.categoria || "ORGANICOS",
    imagen: p.imagen || "img/bolsa.webp", // placeholder simple dentro de /public/img
  }));

  // Sincronizamos el combinado al LS para que futuras ediciones funcionen
  saveProducts(products);

  if (!Array.isArray(products) || products.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = "<td colspan='5' class='text-secondary'>No hay productos.</td>";
    tbody.appendChild(tr);
    return;
  }

  products.forEach((p) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <input type="text" class="form-control form-control-sm product-nombre" value="${p.nombre || ""}" />
      </td>
      <td>
        <textarea class="form-control form-control-sm product-descripcion">${p.descripcion || ""}</textarea>
      </td>
      <td>
        <div class="d-flex align-items-center gap-2">
          <img class="product-preview" src="${p.imagen || "img/bolsa.webp"}" alt="prev" style="width:40px;height:40px;object-fit:cover;border-radius:4px;border:1px solid #ddd;" />
          <input type="file" class="form-control form-control-sm product-file" accept="image/*" />
        </div>
      </td>
      <td>
        <input type="number" class="form-control form-control-sm product-stock" value="${p.stock ?? 0}" min="0" />
      </td>
      <td>
        <input type="number" class="form-control form-control-sm product-precio" value="${p.precio ?? 0}" min="0" />
      </td>
      <td class="text-end">
        <div class="btn-group btn-group-sm">
          <button class="btn btn-primary btn-save">Guardar</button>
          <button class="btn btn-danger btn-delete">Eliminar</button>
        </div>
      </td>
    `;

    const btnSave   = tr.querySelector(".btn-save");
    const btnDelete = tr.querySelector(".btn-delete");
    const previewImg  = tr.querySelector(".product-preview");
    const fileInput   = tr.querySelector(".product-file");

    if (fileInput && previewImg && !fileInput.dataset.listenerAttached) {
      fileInput.addEventListener("change", () => {
        const f = fileInput.files && fileInput.files[0];
        if (!f) return;
        const r = new FileReader();
        r.onload = () => {
          // Guardamos la data URL en un dataset para usar al guardar
          fileInput.dataset.uploadedData = r.result;
          previewImg.src = r.result;
        };
        r.readAsDataURL(f);
      });
      fileInput.dataset.listenerAttached = "true";
    }

    btnSave.addEventListener("click", () => {
      const nombre      = tr.querySelector(".product-nombre").value.trim();
      const descripcion = tr.querySelector(".product-descripcion").value.trim();
      const stock       = parseInt(tr.querySelector(".product-stock").value, 10) || 0;
      const precio      = parseFloat(tr.querySelector(".product-precio").value) || 0;

      // Validar que el nombre no esté vacío (solo requerido)
      if (!nombre) {
        Swal.fire("Error", "El nombre del producto es requerido", "error");
        return;
      }

      const current = getProducts();
      const index = current.findIndex((prod) => prod.id === p.id);
      const uploaded    = fileInput?.dataset.uploadedData || "";
      const imagen      = uploaded || (current[index]?.imagen || p.imagen || "img/bolsa.webp");

      if (index !== -1) {
        current[index] = {
          ...current[index],
          nombre,
          descripcion: descripcion || "", // Permitir descripción vacía
          imagen,
          stock,
          precio,
        };
        saveProducts(current);
        Swal.fire("Guardado", "Producto actualizado correctamente", "success").then(() => {
          cargarTablaProductos();
        });
      } else {
        Swal.fire("Error", "No se encontró el producto a actualizar", "error");
      }
    });

    btnDelete.addEventListener("click", () => {
      Swal.fire({
        title: "¿Eliminar producto?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          const filtered = getProducts().filter((prod) => prod.id !== p.id);
          saveProducts(filtered);
          cargarTablaProductos();
          Swal.fire("Eliminado", "Producto eliminado correctamente", "success");
        }
      });
    });

    tbody.appendChild(tr);
  });
}

// Crear un nuevo producto desde el panel admin

function crearProductoDemoProducto() {
  if (!esAdminActual()) {
    Swal.fire("No autorizado", "", "error");
    return;
  }

  const nombreInput = document.getElementById("npTitle");
  const descInput   = document.getElementById("npDescription");
  const imgFile     = document.getElementById("npImageFile");
  const stockInput  = document.getElementById("npStock");
  const precioInput = document.getElementById("npPrice");

  const nombre      = nombreInput?.value.trim();
  const descripcion = descInput?.value.trim();
  const stock       = parseInt(stockInput?.value, 10) || 0;
  const precio      = parseFloat(precioInput?.value) || 0;
  const categoria   = "ORGANICOS"; // por defecto; luego puedes agregar un <select> si quieres

  if (!nombre || !descripcion) {
    Swal.fire("Faltan datos", "Nombre y descripción son obligatorios", "warning");
    return;
  }

  function finishCreate(imagenFinal) {
    const products = getProducts();
    const nuevo = {
      id: "ADM_" + Date.now(),
      nombre,
      descripcion,
      imagen: imagenFinal || "img/bolsa.webp",
      stock,
      precio,
      categoria,
    };
    products.push(nuevo);
    saveProducts(products);

    if (nombreInput) nombreInput.value = "";
    if (descInput)   descInput.value   = "";
    if (imgFile)     imgFile.value     = "";
    if (stockInput)  stockInput.value  = "";
    if (precioInput) precioInput.value = "";

    Swal.fire("OK", "Producto creado", "success");
    cargarTablaProductos();
  }

  const file = imgFile?.files && imgFile.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => finishCreate(reader.result);
    reader.onerror = () => finishCreate("img/bolsa.webp");
    reader.readAsDataURL(file);
  } else {
    finishCreate("img/bolsa.webp");
  }
}


// Cerrar sesión

function logout() {
  clearSession();
  Swal.fire("Sesión cerrada", "", "info").then(() => {
    window.location.href = "/login";
  });
}


// Inicializar la página del panel de administración

export function initPanelPage() {
  const btnCrear = document.getElementById("btnCrearUsuario");
  if (btnCrear && !btnCrear.dataset.listenerAttached) {
    btnCrear.addEventListener("click", crearUsuarioDemo);
    btnCrear.dataset.listenerAttached = "true";
  }

  const btnCrearProducto = document.getElementById("btnCrearProducto");
  if (btnCrearProducto && !btnCrearProducto.dataset.listenerAttached) {
    btnCrearProducto.addEventListener("click", crearProductoDemoProducto);
    btnCrearProducto.dataset.listenerAttached = "true";
  }

  render();
}

// Exportar la función para cargar la tabla de productos

export { cargarTablaProductos };
