   // Claves localStorage (mismas que en login.html)
   var LS_USERS   = "demo.users";
   var LS_SESSION = "demo.session";
   var LS_NOTAS   = "demo.notas";

   // Utilidades LS
   function leerLS(clave, defecto){
     var raw = localStorage.getItem(clave);
     if(!raw){ return defecto; }
     try { return JSON.parse(raw); } catch(e){ return defecto; }
   }
   function escribirLS(clave, valor){ localStorage.setItem(clave, JSON.stringify(valor)); }

   function getUsers(){ return leerLS(LS_USERS, []); }
   function saveUsers(arr){ escribirLS(LS_USERS, arr); }

   function getSession(){ return leerLS(LS_SESSION, null); }
   function setSession(obj){ escribirLS(LS_SESSION, obj); }
   function clearSession(){ localStorage.removeItem(LS_SESSION); }

   function getNotasDe(email){
     var mapa = leerLS(LS_NOTAS, {});
     if(!mapa[email]){ mapa[email] = []; }
     return mapa[email];
   }
   function saveNotasDe(email, notas){
     var mapa = leerLS(LS_NOTAS, {});
     mapa[email] = notas;
     escribirLS(LS_NOTAS, mapa);
   }

   // Guard de sesión + Render
   function render(){
     var sess = getSession();
     var adminView = document.getElementById("adminView");
     var userView  = document.getElementById("userView");
     var badge     = document.getElementById("sessionBadge");

     if(!sess){
       // No logueado -> volver a login
       window.location.href = "login.html";
       return;
     }

     badge.textContent = sess.email + " (" + sess.role + ")";

     if(sess.role === "admin"){
       adminView.classList.remove("hidden");
       userView.classList.add("hidden");
       cargarTablaUsuarios();
     }else{
       adminView.classList.add("hidden");
       userView.classList.remove("hidden");
       cargarNotas();
     }
   }

   // ---------- Acciones ADMIN ----------
   function cargarTablaUsuarios(){
     var tbody = document.getElementById("tblUsers");
     tbody.innerHTML = "";
     var users = getUsers();
     var i;
     for(i=0;i<users.length;i++){
       var u = users[i];
       var tr = document.createElement("tr");
       tr.innerHTML =
         "<td>"+ u.email +"</td>"+
         "<td><span class='badge "+ (u.role==='admin'?'bg-warning text-dark':'bg-secondary') +"'>"+ u.role +"</span></td>"+
         "<td class='text-end'>"+
           "<div class='btn-group btn-group-sm' role='group'>"+
             "<button class='btn btn-outline-success' onclick=\"setRole('"+u.email+"','admin')\">Hacer admin</button>"+
             "<button class='btn btn-outline-primary' onclick=\"setRole('"+u.email+"','user')\">Hacer user</button>"+
             "<button class='btn btn-outline-danger' onclick=\"borrarUsuario('"+u.email+"')\">Eliminar</button>"+
           "</div>"+
         "</td>";
       tbody.appendChild(tr);
     }
     if(users.length===0){
       var tr = document.createElement("tr");
       tr.innerHTML = "<td colspan='3' class='text-secondary'>No hay usuarios.</td>";
       tbody.appendChild(tr);
     }
   }

   function setRole(email, role){
     if(!esAdminActual()){ Swal.fire("No autorizado","","error"); return; }
     var users = getUsers();
     var i, cambiado=false;
     for(i=0;i<users.length;i++){
       if(users[i].email===email){
         users[i].role = role;
         cambiado = true;
         break;
       }
     }
     if(cambiado){
       saveUsers(users);
       var sess = getSession();
       if(sess && sess.email===email){ sess.role = role; setSession(sess); }
       Swal.fire("OK","Rol actualizado","success");
       render();
     }
   }

   function borrarUsuario(email){
     if(!esAdminActual()){ Swal.fire("No autorizado","","error"); return; }
     Swal.fire({
       title: "Eliminar usuario",
       text: "Esta acción es permanente",
       icon: "warning",
       showCancelButton: true,
       confirmButtonText: "Eliminar",
       cancelButtonText: "Cancelar"
     }).then(function(res){
       if(!res.isConfirmed){ return; }
       var users = getUsers();
       var i, nuevos=[];
       for(i=0;i<users.length;i++){
         if(users[i].email!==email){ nuevos.push(users[i]); }
       }
       saveUsers(nuevos);
       var sess = getSession();
       if(sess && sess.email===email){ clearSession(); }
       Swal.fire("Hecho","Usuario eliminado","success");
       render();
     });
   }

   function esAdminActual(){
     var sess = getSession();
     return !!(sess && sess.role==="admin");
   }

   function crearUsuarioDemo(){
     if(!esAdminActual()){ Swal.fire("No autorizado","","error"); return; }
     var email = document.getElementById("nuEmail").value.trim();
     var pass  = document.getElementById("nuPass").value.trim();
     var role  = document.getElementById("nuRole").value;

     if(!email || !pass){
       Swal.fire("Faltan datos","Email y password son obligatorios","warning");
       return;
     }
     var users = getUsers();
     var i, yaExiste=false;
     for(i=0;i<users.length;i++){
       if(users[i].email===email){ yaExiste=true; break; }
     }
     if(yaExiste){
       Swal.fire("Error","Ya existe un usuario con ese email","error");
       return;
     }
     users.push({ email: email, pass: pass, role: role });
     saveUsers(users);
     document.getElementById("nuEmail").value="";
     document.getElementById("nuPass").value="";
     document.getElementById("nuRole").value="user";
     Swal.fire("OK","Usuario creado","success");
     render();
   }

   // ---------- Acciones USUARIO (demo) ----------
   function agregarNota(){
     var sess = getSession();
     if(!sess){ return false; }
     var txt = document.getElementById("txtNota");
     var valor = txt.value.trim();
     if(!valor){ return false; }
     var notas = getNotasDe(sess.email);
     notas.push(valor);
     saveNotasDe(sess.email, notas);
     txt.value = "";
     cargarNotas();
     return false;
   }

   function cargarNotas(){
     var sess = getSession();
     if(!sess){ return; }
     var ul = document.getElementById("listaNotas");
     ul.innerHTML = "";
     var notas = getNotasDe(sess.email);
     var i;
     for(i=0;i<notas.length;i++){
       var li = document.createElement("li");
       li.textContent = "• " + notas[i];
       ul.appendChild(li);
     }
     if(notas.length===0){
       var li = document.createElement("li");
       li.className="text-secondary";
       li.textContent = "Aún no tienes notas.";
       ul.appendChild(li);
     }
   }

   function logout(){
     clearSession();
     Swal.fire("Sesión cerrada","","info").then(function(){
       window.location.href = "login.html";
     });
   }

   // Inicio
   render();