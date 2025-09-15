function validarLogin(event) {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  const emailRegex = /^[\w.-]+@(?:duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;

  if (!emailRegex.test(email)) {
    alert("Correo no válido. Solo @duoc.cl, @profesor.duoc.cl o @gmail.com");
    event.preventDefault();
    return false;
  }

  if (pass.length < 4 || pass.length > 10) {
    alert("La contraseña debe tener entre 4 y 10 caracteres.");
    event.preventDefault();
    return false;
  }
  return true;
}