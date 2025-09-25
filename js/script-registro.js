      // Claves usadas por el resto del sitio
      var LS_USERS = "demo.users";
      var LS_SESSION = "demo.session";

      // Funcion para leer del localStorage
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

      // Funcion que escribe en localStorage
      function escribirLS(clave, valor) {
        localStorage.setItem(clave, JSON.stringify(valor));
      }

      // Funcion para obtener el array de usuarios
      function getUsers() {
        return leerLS(LS_USERS, []);
      }

      // Funcion para guardar el array de usuarios
      function saveUsers(arr) {
        escribirLS(LS_USERS, arr);
      }

      // Declaración de variable con datos de regiones y comunas
      var DATA_RC = {
        "Región Metropolitana de Santiago": [
          "Santiago",
          "Ñuñoa",
          "Providencia",
          "Las Condes",
          "Maipú",
        ],
        "Región del Biobío": [
          "Concepción",
          "Talcahuano",
          "San Pedro de la Paz",
          "Chiguayante",
        ],
        "Región del Maule": ["Linares", "Longaví", "Talca", "Curicó"],
        "Región de La Araucanía": [
          "Temuco",
          "Padre Las Casas",
          "Villarrica",
          "Angol",
        ],
        "Región de Ñuble": ["Chillán", "San Carlos", "Coihueco"],
      };

      // Funcion para cargar regiones
      function cargarRegiones() {
        var selR = document.getElementById("selRegion");
        var region;
        for (region in DATA_RC) {
          var opt = document.createElement("option");
          opt.value = region;
          opt.textContent = region;
          selR.appendChild(opt);
        }
      }

      // Funcion para cargar comunas según región seleccionada
      function cargarComunas() {
        var selR = document.getElementById("selRegion");
        var selC = document.getElementById("selComuna");
        selC.innerHTML = '<option value="">— Seleccione la comuna —</option>';
        var region = selR.value;
        if (!region) {
          return;
        }
        var comunas = DATA_RC[region] || [];
        var i;
        for (i = 0; i < comunas.length; i++) {
          var opt = document.createElement("option");
          opt.value = comunas[i];
          opt.textContent = comunas[i];
          selC.appendChild(opt);
        }
      }


      // Funcion para registrar un nuevo usuario
      function registrarUsuario() {
        // Limpiar errores previos
        limpiarErrores();
        
        var nombre = document.getElementById("txtNombre").value.trim();
        var rut = document.getElementById("txtRut").value.trim();
        var email = document
          .getElementById("txtEmail")
          .value.trim()
          .toLowerCase();
        var pass1 = document.getElementById("txtPass1").value;
        var pass2 = document.getElementById("txtPass2").value;
        var fono = document.getElementById("txtTelefono").value.trim();
        var region = document.getElementById("selRegion").value;
        var comuna = document.getElementById("selComuna").value;

        // Validar campos obligatorios
        if (!nombre || !rut || !email || !pass1 || !pass2 || !region || !comuna) {
          Swal.fire(
            "Campos incompletos",
            "Por favor completa los campos obligatorios",
            "warning"
          );
          return false;
        }

        // Validar nombre
        if (!validarNombre(nombre)) {
          return false;
        }

        // Validar RUT
        if (!validarRut(rut)) {
          return false;
        }

        // Validar correo
        if (!validarCorreo(email)) {
          return false;
        }

        // Validar contraseñas
        if (!validarContrasenas(pass1, pass2)) {
          return false;
        }

        // Validar teléfono (opcional)
        if (fono && !validarTelefono(fono)) {
          return false;
        }

        var users = getUsers();
        var i,
          existe = false;
        for (i = 0; i < users.length; i++) {
          if (users[i].email === email) {
            existe = true;
            break;
          }
        }
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
          window.location.href = "login.html";
        });

        return false;
      }

      // Funcion para validar el nombre
      function validarNombre(nombre) {
        var nombreInput = document.getElementById("txtNombre");
        
        if (nombre.length < 2) {
          mostrarError(nombreInput, "El nombre debe tener al menos 2 caracteres");
          return false;
        }
        
        if (nombre.length > 50) {
          mostrarError(nombreInput, "El nombre no puede tener más de 50 caracteres");
          return false;
        }
        
        // Validar que solo contenga letras y espacios
        var nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (!nombreRegex.test(nombre)) {
          mostrarError(nombreInput, "El nombre solo puede contener letras y espacios");
          return false;
        }
        
        limpiarError(nombreInput);
        return true;
      }

      // Funcion para validar el correo
      function validarCorreo(email) {
        var emailInput = document.getElementById("txtEmail");
        
        // Validar que no esté vacío
        if (!email) {
          mostrarError(emailInput, "El correo es requerido");
          return false;
        }
        
        // Validar longitud máxima
        if (email.length > 100) {
          mostrarError(emailInput, "El correo no puede tener más de 100 caracteres");
          return false;
        }
        
        // Validar formato de email básico
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          mostrarError(emailInput, "Formato de correo inválido");
          return false;
        }
        
        // Validar dominios permitidos
        var dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
        var dominioValido = false;
        
        for (var i = 0; i < dominiosPermitidos.length; i++) {
          if (email.toLowerCase().endsWith(dominiosPermitidos[i])) {
            dominioValido = true;
            break;
          }
        }
        
        if (!dominioValido) {
          mostrarError(emailInput, "Solo se permiten correos de @duoc.cl, @profesor.duoc.cl y @gmail.com");
          return false;
        }
        
        limpiarError(emailInput);
        return true;
      }

      // Funcion para validar las contraseñas
      function validarContrasenas(pass1, pass2) {
        var pass1Input = document.getElementById("txtPass1");
        var pass2Input = document.getElementById("txtPass2");
        
        // Validar que no estén vacías
        if (!pass1) {
          mostrarError(pass1Input, "La contraseña es requerida");
          return false;
        }
        
        if (!pass2) {
          mostrarError(pass2Input, "La confirmación de contraseña es requerida");
          return false;
        }
        
        // Validar longitud (4-10 caracteres)
        if (pass1.length < 4 || pass1.length > 10) {
          mostrarError(pass1Input, "La contraseña debe tener entre 4 y 10 caracteres");
          return false;
        }
        
        // Validar que coincidan
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
        var telefonoInput = document.getElementById("txtTelefono");
        
        // Validar formato chileno: +56 9 XXXX XXXX o 9 XXXX XXXX
        var telefonoRegex = /^(\+56\s?)?9\s?\d{4}\s?\d{4}$/;
        if (!telefonoRegex.test(telefono)) {
          mostrarError(telefonoInput, "Formato de teléfono inválido. Use: +56 9 1234 5678 o 9 1234 5678");
          return false;
        }
        
        limpiarError(telefonoInput);
        return true;
      }

      // Funcion para validar el RUT
      function validarRut(rut) {
        var rutInput = document.getElementById("txtRut");
        
        if (!rut) {
          mostrarError(rutInput, "El RUT es obligatorio");
          return false;
        }

        // Limpiar el RUT de puntos y guión
        rut = rut.replace(/\./g, "").replace(/-/g, "").trim();
        
        // Validar largo
        if (rut.length < 8 || rut.length > 9) {
          mostrarError(rutInput, "El RUT debe tener entre 8 y 9 dígitos");
          return false;
        }

        // Obtener dígito verificador
        var dv = rut.slice(-1).toUpperCase();
        var rutNumero = parseInt(rut.slice(0, -1));
        
        // Calcular dígito verificador
        var suma = 0;
        var factor = 2;
        
        while (rutNumero > 0) {
          suma += (rutNumero % 10) * factor;
          rutNumero = Math.floor(rutNumero / 10);
          factor = factor === 7 ? 2 : factor + 1;
        }
        
        var dvEsperado = 11 - (suma % 11);
        if (dvEsperado === 11) dvEsperado = "0";
        if (dvEsperado === 10) dvEsperado = "K";
        else dvEsperado = dvEsperado.toString();

        if (dv !== dvEsperado) {
          mostrarError(rutInput, "El RUT no es válido");
          return false;
        }

        limpiarError(rutInput);
        return true;
      }

      // Funcion para mostrar errores en los campos
      function mostrarError(input, mensaje) {
        input.classList.add('is-invalid');
        
        // Crear o actualizar elemento de error
        var errorElement = input.parentNode.querySelector('.invalid-feedback');
        if (!errorElement) {
          errorElement = document.createElement('div');
          errorElement.className = 'invalid-feedback';
          input.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = mensaje;
      }

      // Funcion para limpiar errores de los campos
      function limpiarError(input) {
        input.classList.remove('is-invalid');
        var errorElement = input.parentNode.querySelector('.invalid-feedback');
        if (errorElement) {
          errorElement.textContent = '';
        }
      }

      // Funcion para limpiar todos los errores del formulario
      function limpiarErrores() {
        var inputs = document.querySelectorAll('.form-control');
        inputs.forEach(function(input) {
          limpiarError(input);
        });
      }

      // Inicio
      (function init() {
        cargarRegiones();
        document
          .getElementById("selRegion")
          .addEventListener("change", cargarComunas);
      })();