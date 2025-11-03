import Swal from "sweetalert2";

export const LS_USERS = "demo.users";
export const LS_SESSION = "demo.session";

export function leerLS(clave, defecto) {
  const raw = localStorage.getItem(clave);
  if (!raw) return defecto;
  try { return JSON.parse(raw); } catch (_) { return defecto; }
}
export function escribirLS(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}
export function getUsers() {
  return leerLS(LS_USERS, []);
}
export function saveUsers(arr) {
  escribirLS(LS_USERS, arr);
}
export function getSession() {
  return leerLS(LS_SESSION, null);
}
export function setSession(obj) {
  escribirLS(LS_SESSION, obj);
}
export function clearSession() {
  localStorage.removeItem(LS_SESSION);
}

// ---- datos demo
function seed() {
  const users = getUsers();
  if (users.length > 0) return;

  users.push({ email: "juanito@duoc.cl", pass: "1234", role: "admin" });
  users.push({ email: "maria@duoc.cl",  pass: "abcd", role: "user"  });
  saveUsers(users);
}

// ---- Validaciones UI pequeñas
function mostrarError(input, errorElement, mensaje) {
  if (!input || !errorElement) return;
  input.classList.add("is-invalid");
  errorElement.textContent = mensaje;
}
function limpiarError(input, errorElement) {
  if (!input || !errorElement) return;
  input.classList.remove("is-invalid");
  errorElement.textContent = "";
}
function limpiarErrores() {
  const inputs = document.querySelectorAll(".form-control");
  const errors = document.querySelectorAll(".invalid-feedback");
  inputs.forEach((i) => i.classList.remove("is-invalid"));
  errors.forEach((e) => (e.textContent = ""));
}

// ---- Validar campos
function validarCorreo() {
  const correo = document.getElementById("txtEmail")?.value?.trim() || "";
  const emailInput = document.getElementById("txtEmail");
  const emailError = document.getElementById("emailError");

  if (!correo) {
    mostrarError(emailInput, emailError, "El correo es requerido");
    return false;
  }
  if (correo.length > 100) {
    mostrarError(emailInput, emailError, "El correo no puede tener más de 100 caracteres");
    return false;
  }

  const dominiosPermitidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
  const dominioValido = dominiosPermitidos.some((d) => correo.toLowerCase().endsWith(d));
  if (!dominioValido) {
    mostrarError(emailInput, emailError, "Solo se permiten correos de @duoc.cl, @profesor.duoc.cl y @gmail.com");
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(correo)) {
    mostrarError(emailInput, emailError, "Formato de correo inválido");
    return false;
  }

  limpiarError(emailInput, emailError);
  return true;
}

function validarContrasena() {
  const pass = document.getElementById("txtPass")?.value || "";
  const passInput = document.getElementById("txtPass");
  const passError = document.getElementById("passError");

  if (!pass) {
    mostrarError(passInput, passError, "La contraseña es requerida");
    return false;
  }
  if (pass.length < 4 || pass.length > 10) {
    mostrarError(passInput, passError, "La contraseña debe tener entre 4 y 10 caracteres");
    return false;
  }
  limpiarError(passInput, passError);
  return true;
}

// ---- Validar usuario en localStorage
function validarUsuario() {
  const correo = document.getElementById("txtEmail")?.value?.trim().toLowerCase() || "";
  const pass   = document.getElementById("txtPass")?.value || "";
  const users  = getUsers();

  let encontrado = null;
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === correo && users[i].pass === pass) {
      encontrado = users[i];
      break;
    }
  }

  if (encontrado) {
    setSession({ email: encontrado.email, role: encontrado.role });
    Swal.fire({
      title: "Login",
      text: `Login Correcto (${encontrado.role})`,
      icon: "success",
      confirmButtonText: "OK",
    });
    return true;
  } else {
    Swal.fire({
      title: "Login",
      text: "Usuario o Contraseña Incorrecto",
      icon: "error",
      confirmButtonText: "OK",
    });
    return false;
  }
}

// ---- Flujo completo
export function validarTodo() {
  limpiarErrores();

  if (!validarCorreo()) return false;
  if (!validarContrasena()) return false;

  const ok = validarUsuario();
  if (ok === false) return false;

  window.location.href = "/panel";
  return false; 
}


export function initLoginPage() {
  seed();
}
