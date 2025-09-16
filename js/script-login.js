var LS_USERS = "demo.users";
var LS_SESSION = "demo.session";

function leerLS(clave, defecto) {
  var raw = localStorage.getItem(clave);
  if (!raw) {
    return defecto;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return defecto;
  }
}
function escribirLS(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

function getUsers() {
  return leerLS(LS_USERS, []);
}

function saveUsers(arr) {
  escribirLS(LS_USERS, arr);
}

function getSession() {
  return leerLS(LS_SESSION, null);
}
function setSession(obj) {
  escribirLS(LS_SESSION, obj);
}
function clearSession() {
  localStorage.removeItem(LS_SESSION);
}

function seed() {
  // Limpiar los usuarios que ya existen en el localstorage
  localStorage.removeItem(LS_USERS);

  var users = [];
  // Admin de ejemplo
  users.push({
    email: "juanito@duoc.cl",
    pass: "1234",
    role: "admin",
    rut: "123456785",
  });
  // Usuario normal
  users.push({
    email: "maria@duoc.cl",
    pass: "abcd",
    role: "user",
    rut: "111111111",
  });
  saveUsers(users);
}

// Validaciones

function validarTodo() {
  // Limpiar errores previos
  limpiarErrores();

  // Validar correo
  var okEmail = validarCorreo();
  if (!okEmail) {
    return false;
  }

  // Validar contraseña
  var okPass = validarContrasena();
  if (!okPass) {
    return false;
  }

  // Validar usuario en BD
  var okLogin = validarUsuario();
  if (okLogin === false) {
    return false;
  }

  var rutInput = document.getElementById("txtRut").value;
  if (rutInput) {
    var okRut = validarRut();
    if (okRut === false) {
      return false;
    }
  }

  // Redirección al panel tras login correcto
  window.location.href = "panel.html"; // cambia si tu archivo se llama distinto
  return false; // evitar submit real
}

function validarCorreo() {
  var correo = document.getElementById("txtEmail").value.trim();
  var emailInput = document.getElementById("txtEmail");
  var emailError = document.getElementById("emailError");

  // Validar que no esté vacío
  if (!correo) {
    mostrarError(emailInput, emailError, "El correo es requerido");
    return false;
  }

  // Validar longitud máxima
  if (correo.length > 100) {
    mostrarError(
      emailInput,
      emailError,
      "El correo no puede tener más de 100 caracteres"
    );
    return false;
  }

  // Validar dominios permitidos
  var dominiosPermitidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
  var dominioValido = false;

  for (var i = 0; i < dominiosPermitidos.length; i++) {
    if (correo.toLowerCase().endsWith(dominiosPermitidos[i])) {
      dominioValido = true;
      break;
    }
  }

  if (!dominioValido) {
    mostrarError(
      emailInput,
      emailError,
      "Solo se permiten correos de @duoc.cl, @profesor.duoc.cl y @gmail.com"
    );
    return false;
  }

  // Validar formato de email básico
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(correo)) {
    mostrarError(emailInput, emailError, "Formato de correo inválido");
    return false;
  }

  limpiarError(emailInput, emailError);
  return true;
}

function validarContrasena() {
  var pass = document.getElementById("txtPass").value;
  var passInput = document.getElementById("txtPass");
  var passError = document.getElementById("passError");

  // Validar que no esté vacía
  if (!pass) {
    mostrarError(passInput, passError, "La contraseña es requerida");
    return false;
  }

  // Validar longitud
  if (pass.length < 4 || pass.length > 10) {
    mostrarError(
      passInput,
      passError,
      "La contraseña debe tener entre 4 y 10 caracteres"
    );
    return false;
  }

  limpiarError(passInput, passError);
  return true;
}

function mostrarError(input, errorElement, mensaje) {
  input.classList.add("is-invalid");
  errorElement.textContent = mensaje;
}

function limpiarError(input, errorElement) {
  input.classList.remove("is-invalid");
  errorElement.textContent = "";
}

function limpiarErrores() {
  var inputs = document.querySelectorAll(".form-control");
  var errors = document.querySelectorAll(".invalid-feedback");

  inputs.forEach(function (input) {
    input.classList.remove("is-invalid");
  });

  errors.forEach(function (error) {
    error.textContent = "";
  });
}

function validarUsuario() {
  var correo = document.getElementById("txtEmail").value.trim();
  var pass = document.getElementById("txtPass").value;

  var users = getUsers();

  // Mostrar los usuarios disponibles en la consola
  console.log("Usuarios disponibles:", users);
  console.log("Correo ingresado:", correo);
  console.log("Contraseña ingresada:", pass);

  var i,
    encontrado = null;
  for (i = 0; i < users.length; i++) {
    console.log("Comparando con:", users[i].email, "vs", correo);
    console.log("Contraseña:", users[i].pass, "vs", pass);
    if (users[i].email === correo && users[i].pass === pass) {
      encontrado = users[i];
      break;
    }
  }

  if (encontrado) {
    setSession({ email: encontrado.email, role: encontrado.role });
    Swal.fire({
      title: "Login",
      text: "Login Correcto (" + encontrado.role + ")",
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

// Validación de rut
function validarRut() {
  var rut = document.getElementById("txtRut").value;
  rut = rut.replace(/\./g, "").replace(/-/g, "");
  var largo = rut.length;
  if (largo != 9 && largo != 10) {
    alert("rut incorrecto..");
    return false;
  }
  if (largo == 9) {
    rut = "0" + rut;
  }

  var factor = 3,
    suma = 0,
    index;
  for (index = 0; index < 8; index++) {
    var caracter = rut.slice(index, index + 1);
    suma += caracter * factor;
    factor--;
    if (factor == 1) {
      factor = 7;
    }
  }
  var resto = suma % 11;
  var dv = 11 - resto;
  if (dv == 11) {
    dv = 0;
  }
  if (dv > 9) {
    dv = "K";
  }

  var dvUsuario = rut.slice(9, 10).toUpperCase();
  if (dv == dvUsuario) {
    return true;
  } else {
    alert("Rut Incorrecto...");
    return false;
  }
}

seed();
