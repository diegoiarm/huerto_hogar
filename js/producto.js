var LS_CART     = "cart.items";
var LS_PRODUCTS = "demo.products"; 

var CATEGORIES = {
  FRUTAS: {
    label: "Frutas Frescas",
    description:
      "Nuestra selección de frutas frescas ofrece una experiencia directa del campo a tu hogar. Estas frutas se cultivan y cosechan en el punto óptimo de madurez para asegurar su sabor y frescura. Disfruta de una variedad de frutas de temporada que aportan vitaminas y nutrientes esenciales a tu dieta diaria. Perfectas para consumir solas, en ensaladas o como ingrediente principal en postres y smoothies."
  },
  VERDURAS: {
    label: "Verduras Orgánicas",
    description:
      "Descubre nuestra gama de verduras orgánicas, cultivadas sin el uso de pesticidas ni químicos, garantizando un sabor auténtico y natural. Cada verdura es seleccionada por su calidad y valor nutricional, ofreciendo una excelente fuente de vitaminas, minerales y fibra. Ideales para ensaladas, guisos y platos saludables, nuestras verduras orgánicas promueven una alimentación consciente y sostenible."
  },
  ORGANICOS: {
    label: "Productos Orgánicos",
    description:
      "Nuestros productos orgánicos están elaborados con ingredientes naturales y procesados de manera responsable para mantener sus beneficios saludables. Desde aceites y miel hasta granos y semillas, ofrecemos una selección que apoya un estilo de vida saludable y respetuoso con el medio ambiente. Estos productos son perfectos para quienes buscan opciones alimenticias que aporten bienestar sin comprometer el sabor ni la calidad."
  },
  LACTEOS: {
    label: "Productos Lácteos",
    description:
      "Los productos lácteos de HuertoHogar provienen de granjas locales que se dedican a la producción responsable y de calidad. Ofrecemos una gama de leches, yogures y otros derivados que conservan su frescura y sabor auténtico. Ricos en calcio y nutrientes esenciales, nuestros lácteos son perfectos para complementar una dieta equilibrada, proporcionando el mejor sabor y nutrición para toda la familia."
  }
};

var catalogoBase = [
  { id: "FR001", nombre: "Manzana Fuji",        precio: 1200, imagen: "img/manzana.webp"   },
  { id: "FR002", nombre: "Naranja Valencia",    precio: 1000, imagen: "img/naranja.jpg"   },
  { id: "FR003", nombre: "Plátano Cavendish",   precio:  800, imagen: "img/platano.jpg"   },
  { id: "VR001", nombre: "Zanahorias Orgánicas",precio:  900, imagen: "img/zanahoria.jpg" },
  { id: "VR002", nombre: "Espinacas Frescas",   precio:  700, imagen: "img/espinaca.jpg"  },
  { id: "VR003", nombre: "Pimientos Tricolores",precio: 1500, imagen: "img/pimiento.jpg"  },
  { id: "PO001", nombre: "Miel Orgánica",       precio: 5000, imagen: "img/miel.png"      },
  { id: "PO003", nombre: "Quinua Orgánica",     precio: 2000, imagen: "img/quinoa.webp"    },
  { id: "PL001", nombre: "Leche Entera",        precio: 1800, imagen: "img/leche.webp"     }
];

function setCategoriaPorPrefijo(arr){
  for(var i=0;i<arr.length;i++){
    var p = arr[i];
    var pref = (p.id||"").slice(0,2).toUpperCase();
    if     (pref === "FR") p.categoria = "FRUTAS";
    else if(pref === "VR") p.categoria = "VERDURAS";
    else if(pref === "PO") p.categoria = "ORGANICOS";
    else if(pref === "PL") p.categoria = "LACTEOS";
  }
  return arr;
}
setCategoriaPorPrefijo(catalogoBase);

function productosDesdeLS() {
  var arr = [];
  try {
    var adminProds = JSON.parse(localStorage.getItem(LS_PRODUCTS) || "[]");
    for (var i=0;i<adminProds.length;i++){
      var p = adminProds[i];
      var id = p.id || ("ADM_" + (p.name||"").replace(/\s+/g,'_') + "_" + i);
      var cat = null;
      var cstr = (p.category||"").toLowerCase();
      if      (cstr.indexOf("fruta")   >= 0) cat = "FRUTAS";
      else if (cstr.indexOf("verdura") >= 0) cat = "VERDURAS";
      else if (cstr.indexOf("orgánic") >= 0 || cstr.indexOf("organico")>=0) cat = "ORGANICOS";
      else if (cstr.indexOf("lácte")   >= 0 || cstr.indexOf("lacteo")  >=0) cat = "LACTEOS";

      arr.push({
        id: id,
        nombre: p.name || "Producto",
        precio: parseInt(p.price||0,10),
        imagen: "assets/productos/placeholder.jpg",
        categoria: cat || "ORGANICOS" // por defecto, puedes ajustar
      });
    }
  } catch(e){}
  return arr;
}

function getCatalogo(){
  return productosDesdeLS().concat(catalogoBase);
}

function loadCart(){
  try { return JSON.parse(localStorage.getItem(LS_CART) || "[]"); }
  catch(e){ return []; }
}
function saveCart(arr){ localStorage.setItem(LS_CART, JSON.stringify(arr)); }

function formatCLP(n){
  return n.toLocaleString("es-CL", { style:"currency", currency:"CLP", maximumFractionDigits:0 });
}

function updateCartBadge(){
  var badge = document.getElementById("cartBadge");
  if(!badge) return;
  var cart = loadCart();
  var count = 0;
  for(var i=0;i<cart.length;i++){ count += cart[i].cantidad; }
  badge.textContent = count;
}

// =================== Catálogo (productos.html) ===================
// estado UI del catálogo
var currentCategory = "ALL";

function initCatalogoUI(){
  var sel = document.getElementById("filtroCategoria");
  if(sel){
    sel.addEventListener("change", function(){
      currentCategory = sel.value;   
      renderCategoriaDescripcion(currentCategory);
      renderCatalogo();              
    });
  }
  renderCategoriaDescripcion(currentCategory);
  renderCatalogo();
  updateCartBadge();
}

function renderCategoriaDescripcion(catKey){
  var box = document.getElementById("descripcionCategoria");
  if(!box) return;

  if(catKey === "ALL"){
    box.innerHTML = "<strong>Explora todo nuestro catálogo</strong><br>Filtra por categoría para ver una curaduría de productos.";
    return;
  }
  var data = CATEGORIES[catKey];
  if(!data){
    box.innerHTML = "";
    return;
  }
  box.innerHTML = "<strong>"+data.label+"</strong><br>"+data.description;
}

function renderCatalogo(){
  var cont = document.getElementById("productos");
  if(!cont) return;

  var productos = getCatalogo();
  cont.innerHTML = "";


  var list = [];
  for(var i=0;i<productos.length;i++){
    var p = productos[i];
    if(currentCategory === "ALL" || p.categoria === currentCategory){
      list.push(p);
    }
  }

  if(list.length === 0){
    var vacio = document.createElement("div");
    vacio.className = "col-12";
    vacio.innerHTML = '<div class="text-secondary">No hay productos en esta categoría.</div>';
    cont.appendChild(vacio);
    return;
  }

  for(var j=0;j<list.length;j++){
    var prod = list[j];
    var col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-md-4";

    col.innerHTML = [
      '<div class="card producto-card h-100">',
        '<img src="'+prod.imagen+'" alt="'+prod.nombre+'">',
        '<div class="card-body d-flex flex-column">',
          '<h5 class="card-title">'+prod.nombre+'</h5>',
          '<p class="card-text mb-1">'+formatCLP(prod.precio)+'</p>',
          (prod.categoria ? '<span class="badge bg-success align-self-start mb-3">'+ CATEGORIES[prod.categoria].label +'</span>' : ''),
          '<div class="mt-auto d-grid">',
            '<button class="btn btn-primary" onclick="agregarAlCarrito(\''+prod.id+'\')">Agregar</button>',
          '</div>',
        '</div>',
      '</div>'
    ].join("");

    cont.appendChild(col);
  }
}

function agregarAlCarrito(id){
  var productos = getCatalogo();
  var prod = null;
  for(var i=0;i<productos.length;i++){
    if(productos[i].id === id){ prod = productos[i]; break; }
  }
  if(!prod) return;

  var cart = loadCart();
  var found = false;
  for(var j=0;j<cart.length;j++){
    if(cart[j].id === id){
      cart[j].cantidad += 1;
      found = true;
      break;
    }
  }
  if(!found){
    cart.push({ id: prod.id, nombre: prod.nombre, precio: prod.precio, cantidad: 1 });
  }
  saveCart(cart);
  updateCartBadge();
  alert(prod.nombre + " agregado al carrito");
}

function incrementar(index){
  var cart = loadCart();
  if(!cart[index]) return;
  cart[index].cantidad += 1;
  saveCart(cart);
  renderCarrito();
  updateCartBadge();
}

function decrementar(index){
  var cart = loadCart();
  if(!cart[index]) return;
  cart[index].cantidad -= 1;
  if(cart[index].cantidad <= 0){ cart.splice(index,1); }
  saveCart(cart);
  renderCarrito();
  updateCartBadge();
}

function eliminarDelCarrito(index){
  var cart = loadCart();
  cart.splice(index,1);
  saveCart(cart);
  renderCarrito();
  updateCartBadge();
}

function vaciarCarrito(){
  localStorage.removeItem(LS_CART);
  renderCarrito();
  updateCartBadge();
}

function renderCarrito(){
  var tbody = document.getElementById("tbodyCarrito");
  var totalEl = document.getElementById("totalTexto");
  if(!tbody || !totalEl) return;

  var cart = loadCart();
  tbody.innerHTML = "";
  var total = 0;

  if(cart.length === 0){
    var tr = document.createElement("tr");
    tr.innerHTML = '<td colspan="5" class="text-secondary">Tu carrito está vacío.</td>';
    tbody.appendChild(tr);
    totalEl.textContent = formatCLP(0);
    return;
  }

  for(var i=0;i<cart.length;i++){
    var item = cart[i];
    var subtotal = item.precio * item.cantidad;
    total += subtotal;

    var tr = document.createElement("tr");
    tr.innerHTML = [
      '<td>', item.nombre, '</td>',
      '<td class="text-center">',
        '<div class="btn-group btn-group-sm" role="group">',
          '<button class="btn btn-outline-secondary" onclick="decrementar('+i+')">−</button>',
          '<span class="btn btn-light disabled">', item.cantidad, '</span>',
          '<button class="btn btn-outline-secondary" onclick="incrementar('+i+')">+</button>',
        '</div>',
      '</td>',
      '<td class="text-end">', formatCLP(item.precio), '</td>',
      '<td class="text-end">', formatCLP(subtotal), '</td>',
      '<td class="text-end">',
        '<button class="btn btn-outline-danger btn-sm" onclick="eliminarDelCarrito('+i+')">Eliminar</button>',
      '</td>'
    ].join("");
    tbody.appendChild(tr);
  }
  totalEl.textContent = formatCLP(total);
}
