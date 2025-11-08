// Importar SweetAlert2 para mostrar alertas bonitas
import Swal from "sweetalert2";

// Constantes de localStorage (usuarios y sesión)
export const LS_USERS = "demo.users";
export const LS_SESSION = "demo.session";

// Lee en localStorage según clave

export function leerLS(clave, defecto) {
  const raw = localStorage.getItem(clave);
  if (!raw) return defecto;
  try { return JSON.parse(raw); } catch (_) { return defecto; }
}

// Escribe en localStorage según clave

export function escribirLS(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

// ================== Gestión de usuarios y sesión ==================

// Obtener usuarios de localStorage

export function getUsers() {
  return leerLS(LS_USERS, []);
}

// Guardar usuarios en localStorage

export function saveUsers(arr) {
  escribirLS(LS_USERS, arr);
}

// Obtener la sesión actual

export function getSession() {
  return leerLS(LS_SESSION, null);
}

// Establecer la sesión actual
export function setSession(obj) {
  escribirLS(LS_SESSION, obj);
}

// Eliminar o limpiar la sesión actual

export function clearSession() {
  localStorage.removeItem(LS_SESSION);
}

// Datos demo de usuarios admin y user

function seed() {
  const users = getUsers();
  if (users.length > 0) return;

  users.push({ email: "juanito@duoc.cl", pass: "1234", role: "admin" });
  users.push({ email: "maria@duoc.cl",  pass: "abcd", role: "user"  });
  saveUsers(users);
}

// =============== Validaciones del formulario de login ===============

// Función para mostrar errores 

function mostrarError(input, errorElement, mensaje) {
  if (!input || !errorElement) return;
  input.classList.add("is-invalid");
  errorElement.textContent = mensaje;
}

// Función para limpiar errores

function limpiarError(input, errorElement) {
  if (!input || !errorElement) return;
  input.classList.remove("is-invalid");
  errorElement.textContent = "";
}

// Función para limpiar todos los errores del formulario

function limpiarErrores() {
  const inputs = document.querySelectorAll(".form-control");
  const errors = document.querySelectorAll(".invalid-feedback");
  inputs.forEach((i) => i.classList.remove("is-invalid"));
  errors.forEach((e) => (e.textContent = ""));
}

// Función para validar el correo electrónico

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

// Función para validar la contraseña

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

// Función para validar que el usuario exista

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

// Función para validar todo el formulario de login

export function validarTodo() {
  limpiarErrores();

  if (!validarCorreo()) return false;
  if (!validarContrasena()) return false;

  const ok = validarUsuario();
  if (ok === false) return false;

  window.location.href = "/panel";
  return false; 
}

// Inicializar la página de login

export function initLoginPage() {
  seed();
}
