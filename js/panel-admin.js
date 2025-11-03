// SweetAlert2: usa NPM o CDN (si usas CDN, quita este import y agrega el <script> en index.html)
import Swal from "sweetalert2";

/* =========================
   LocalStorage helpers
   ========================= */
const LS_USERS   = "demo.users";
const LS_SESSION = "demo.session";
const LS_NOTAS   = "demo.notas";

function leerLS(clave, defecto) {
  const raw = localStorage.getItem(clave);
  if (!raw) return defecto;
  try { return JSON.parse(raw); } catch (_) { return defecto; }
}
function escribirLS(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

function getUsers()           { return leerLS(LS_USERS,   []); }
function saveUsers(arr)       { escribirLS(LS_USERS, arr); }
function getSession()         { return leerLS(LS_SESSION, null); }
function setSession(obj)      { escribirLS(LS_SESSION, obj); }
function clearSession()       { localStorage.removeItem(LS_SESSION); }

function getNotasDe(email) {
  const mapa = leerLS(LS_NOTAS, {});
  return mapa[email] || [];
}
function saveNotasDe(email, notas) {
  const mapa = leerLS(LS_NOTAS, {});
  mapa[email] = notas;
  escribirLS(LS_NOTAS, mapa);
}

/* =========================
   Render y control de vistas
   ========================= */
function render() {
  const sess = getSession();
  const adminView = document.getElementById("adminView");
  const userView  = document.getElementById("userView");
  const badge     = document.getElementById("sessionBadge");

  if (!sess) {
    // SPA: redirige a tu ruta de login
    window.location.href = "/login";
    return;
  }

  if (badge) badge.textContent = `${sess.email} (${sess.role})`;

  if (sess.role === "admin") {
    adminView && adminView.classList.remove("hidden");
    userView && userView.classList.add("hidden");
    cargarTablaUsuarios();
  } else {
    adminView && adminView.classList.add("hidden");
    userView && userView.classList.remove("hidden");
    cargarNotas();
  }
}

/* =========================
   ADMIN
   ========================= */
function cargarTablaUsuarios() {
  const tbody = document.getElementById("tblUsers");
  if (!tbody) return;
  tbody.innerHTML = "";

  const users = getUsers();
  if (users.length === 0) {
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

function esAdminActual() {
  const sess = getSession();
  return !!(sess && sess.role === "admin");
}

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

function validarPassword(pass) {
  if (!pass) return { valido: false, mensaje: "La contraseña es obligatoria" };
  if (pass.length < 4 || pass.length > 10)
    return { valido: false, mensaje: "La contraseña debe tener entre 4 y 10 caracteres" };
  return { valido: true };
}

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

/* =========================
   USUARIO (Notas demo)
   ========================= */
function agregarNota() {
  const sess = getSession();
  if (!sess) return false;

  const txt = document.getElementById("txtNota");
  const valor = txt?.value.trim();
  if (!valor) return false;

  const notas = getNotasDe(sess.email);
  notas.push(valor);
  saveNotasDe(sess.email, notas);

  if (txt) txt.value = "";
  cargarNotas();
  return false;
}

function cargarNotas() {
  const sess = getSession();
  if (!sess) return;

  const ul = document.getElementById("listaNotas");
  if (!ul) return;

  ul.innerHTML = "";
  const notas = getNotasDe(sess.email);

  if (notas.length === 0) {
    const li = document.createElement("li");
    li.className = "text-secondary";
    li.textContent = "Aún no tienes notas.";
    ul.appendChild(li);
    return;
  }

  notas.forEach((n) => {
    const li = document.createElement("li");
    li.textContent = `• ${n}`;
    ul.appendChild(li);
  });
}

/* =========================
   Logout
   ========================= */
function logout() {
  clearSession();
  Swal.fire("Sesión cerrada", "", "info").then(() => {
    window.location.href = "/login"; // SPA
  });
}

/* =========================
   Init para React
   ========================= */
export function initPanelPage() {
  // Listeners de botones y formularios que en HTML eran onclick/onsubmit
  const btnCrear = document.getElementById("btnCrearUsuario");
  if (btnCrear) btnCrear.addEventListener("click", crearUsuarioDemo);

  const frmNotas = document.getElementById("frmNotas");
  if (frmNotas) frmNotas.addEventListener("submit", (e) => {
    e.preventDefault();
    agregarNota();
  });


  // primer render (decide admin vs user)
  render();
}
