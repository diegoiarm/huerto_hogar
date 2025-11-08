// Importar SweetAlert2 para mostrar alertas bonitas

import Swal from "sweetalert2";

// Constantes de localStorage (usuarios y sesión)

export const LS_USERS = "demo.users";
export const LS_SESSION = "demo.session";

// Funcion para leer del localStorage

export function leerLS(clave, defecto) {
  const raw = localStorage.getItem(clave);
  if (!raw) return defecto;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return defecto;
  }
}

// Funcion que escribe en localStorage

export function escribirLS(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

// Funcion para obtener el array de usuarios

export function getUsers() {
  return leerLS(LS_USERS, []);
}

// Funcion para guardar el array de usuarios

export function saveUsers(arr) {
  escribirLS(LS_USERS, arr);
}

// Declaración de variable con datos de regiones y comunas

const DATA_RC = {
  "Región Metropolitana de Santiago": [
    "Santiago", "Ñuñoa", "Providencia", "Las Condes", "Maipú",
  ],
  "Región del Biobío": [
    "Concepción", "Talcahuano", "San Pedro de la Paz", "Chiguayante",
  ],
  "Región del Maule": ["Linares", "Longaví", "Talca", "Curicó"],
  "Región de La Araucanía": ["Temuco", "Padre Las Casas", "Villarrica", "Angol"],
  "Región de Ñuble": ["Chillán", "San Carlos", "Coihueco"],
};

// Cargar regiones en el select correspondiente

function cargarRegiones() {
  const selR = document.getElementById("selRegion");
  if (!selR) return;
  selR.innerHTML = '<option value="">— Seleccione la región —</option>';
  for (const region in DATA_RC) {
    const opt = document.createElement("option");
    opt.value = region;
    opt.textContent = region;
    selR.appendChild(opt);
  }
}

// Cargar comunas según región seleccionada

function cargarComunas() {
  const selR = document.getElementById("selRegion");
  const selC = document.getElementById("selComuna");
  if (!selR || !selC) return;

  selC.innerHTML = '<option value="">— Seleccione la comuna —</option>';
  const region = selR.value;
  if (!region) return;

  const comunas = DATA_RC[region] || [];
  for (let i = 0; i < comunas.length; i++) {
    const opt = document.createElement("option");
    opt.value = comunas[i];
    opt.textContent = comunas[i];
    selC.appendChild(opt);
  }
}

// Exportar función para inicializar la página de registro

export function initRegistroPage() {
  cargarRegiones();
  const selR = document.getElementById("selRegion");
  if (selR) selR.addEventListener("change", cargarComunas);
}

// Función para mostrar un error en un campo

function mostrarError(input, mensaje) {
  if (!input) return;
  input.classList.add("is-invalid");
  let errorElement = input.parentNode.querySelector(".invalid-feedback");
  if (!errorElement) {
    errorElement = document.createElement("div");
    errorElement.className = "invalid-feedback";
    input.parentNode.appendChild(errorElement);
  }
  errorElement.textContent = mensaje;
}

// Función para limpiar el error de un campo

function limpiarError(input) {
  if (!input) return;
  input.classList.remove("is-invalid");
  const errorElement = input.parentNode.querySelector(".invalid-feedback");
  if (errorElement) errorElement.textContent = "";
}

// Función para limpiar todos los errores del formulario

function limpiarErrores() {
  const inputs = document.querySelectorAll(".form-control");
  inputs.forEach((input) => limpiarError(input));
}

// Funcion para validar el nombre

function validarNombre(nombre) {
  const nombreInput = document.getElementById("txtNombre");
  if (nombre.length < 2) {
    mostrarError(nombreInput, "El nombre debe tener al menos 2 caracteres");
    return false;
  }
  if (nombre.length > 50) {
    mostrarError(nombreInput, "El nombre no puede tener más de 50 caracteres");
    return false;
  }
  const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!nombreRegex.test(nombre)) {
    mostrarError(nombreInput, "El nombre solo puede contener letras y espacios");
    return false;
  }
  limpiarError(nombreInput);
  return true;
}

// Funcion para validar el correo

function validarCorreo(email) {
  const emailInput = document.getElementById("txtEmail");
  if (!email) {
    mostrarError(emailInput, "El correo es requerido");
    return false;
  }
  if (email.length > 100) {
    mostrarError(emailInput, "El correo no puede tener más de 100 caracteres");
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    mostrarError(emailInput, "Formato de correo inválido");
    return false;
  }
  const dominiosPermitidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
  const dominioValido = dominiosPermitidos.some((d) =>
    email.toLowerCase().endsWith(d)
  );
  if (!dominioValido) {
    mostrarError(
      emailInput,
      "Solo se permiten correos de @duoc.cl, @profesor.duoc.cl y @gmail.com"
    );
    return false;
  }
  limpiarError(emailInput);
  return true;
}

// Funcion para validar las contraseñas

function validarContrasenas(pass1, pass2) {
  const pass1Input = document.getElementById("txtPass1");
  const pass2Input = document.getElementById("txtPass2");
  if (!pass1) {
    mostrarError(pass1Input, "La contraseña es requerida");
    return false;
  }
  if (!pass2) {
    mostrarError(pass2Input, "La confirmación de contraseña es requerida");
    return false;
  }
  if (pass1.length < 4 || pass1.length > 10) {
    mostrarError(pass1Input, "La contraseña debe tener entre 4 y 10 caracteres");
    return false;
  }
  if (pass1 !== pass2) {
    mostrarError(pass2Input, "Las contraseñas no coinciden");
    return false;
  }
  limpiarError(pass1Input);
  limpiarError(pass2Input);
  return true;
}

// Funcion para validar el teléfono

function validarTelefono(telefono) {
  const telefonoInput = document.getElementById("txtTelefono");
  const telefonoRegex = /^(\+56\s?)?9\s?\d{4}\s?\d{4}$/;
  if (!telefonoRegex.test(telefono)) {
    mostrarError(
      telefonoInput,
      "Formato de teléfono inválido. Use: +56 9 1234 5678 o 9 1234 5678"
    );
    return false;
  }
  limpiarError(telefonoInput);
  return true;
}

// Funcion para validar el RUT

function validarRut(rut) {
  const rutInput = document.getElementById("txtRut");
  if (!rut) {
    mostrarError(rutInput, "El RUT es obligatorio");
    return false;
  }
  rut = rut.replace(/\./g, "").replace(/-/g, "").trim();
  if (rut.length < 8 || rut.length > 9) {
    mostrarError(rutInput, "El RUT debe tener entre 8 y 9 dígitos");
    return false;
  }
  const dv = rut.slice(-1).toUpperCase();
  let rutNumero = parseInt(rut.slice(0, -1));
  let suma = 0;
  let factor = 2;
  while (rutNumero > 0) {
    suma += (rutNumero % 10) * factor;
    rutNumero = Math.floor(rutNumero / 10);
    factor = factor === 7 ? 2 : factor + 1;
  }
  let dvEsperado = 11 - (suma % 11);
  if (dvEsperado === 11) dvEsperado = "0";
  else if (dvEsperado === 10) dvEsperado = "K";
  else dvEsperado = dvEsperado.toString();

  if (dv !== dvEsperado) {
    mostrarError(rutInput, "El RUT no es válido");
    return false;
  }
  limpiarError(rutInput);
  return true;
}

// Exportar la función para registrar un usuario

export function registrarUsuario() {
  // Limpiar errores previos
  limpiarErrores();

  const nombre = document.getElementById("txtNombre").value.trim();
  const rut = document.getElementById("txtRut").value.trim();
  const email = document.getElementById("txtEmail").value.trim().toLowerCase();
  const pass1 = document.getElementById("txtPass1").value;
  const pass2 = document.getElementById("txtPass2").value;
  const fono = document.getElementById("txtTelefono").value.trim();
  const region = document.getElementById("selRegion").value;
  const comuna = document.getElementById("selComuna").value;

  // Validar campos obligatorios
  if (!nombre || !rut || !email || !pass1 || !pass2 || !region || !comuna) {
    Swal.fire("Campos incompletos", "Por favor completa los campos obligatorios", "warning");
    return false;
  }
  if (!validarNombre(nombre)) return false;
  if (!validarRut(rut)) return false;
  if (!validarCorreo(email)) return false;
  if (!validarContrasenas(pass1, pass2)) return false;
  if (fono && !validarTelefono(fono)) return false;

  // Duplicados por email
  const users = getUsers();
  const existe = users.some(u => u.email === email);
  if (existe) {
    Swal.fire("Email ya registrado", "Intenta con otro correo", "error");
    return false;
  }

  // Guardar usuario (rol por defecto: user)
  users.push({
    name: nombre,
    rut: rut,
    email: email,
    pass: pass1,
    role: "user",
    phone: fono,
    region: region,
    comuna: comuna,
  });
  saveUsers(users);

  Swal.fire({
    title: "Registro exitoso",
    text: "¡Tu cuenta fue creada! Ya puedes iniciar sesión.",
    icon: "success",
    confirmButtonText: "Ir a login",
  }).then(function () {
    // Redirigir a la página de login
    window.location.href = "/login";
  });

  return false;
}
