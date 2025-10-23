import '../src/css/styles.css';
import '../src/css/visual.css';

const catalogo = [
  {
    id: 1,
    nombre: 'Tomates Cherry',
    descripcion: 'Frescos, orgánicos y deliciosos.',
    precio: 1500,
    categoria: 'VERDURAS',
    imagen: '/img/producto1.jpg',
  },
  {
    id: 2,
    nombre: 'Lechuga Hidropónica',
    descripcion: '100% natural y cultivada sin químicos.',
    precio: 1000,
    categoria: 'VERDURAS',
    imagen: '/img/producto2.jpg',
  },
  {
    id: 3,
    nombre: 'Manzanas Fuji',
    descripcion: 'Crujientes, dulces y jugosas.',
    precio: 2000,
    categoria: 'FRUTAS',
    imagen: '/img/producto3.jpg',
  },
  {
    id: 4,
    nombre: 'Yogurt Natural',
    descripcion: 'Con probióticos naturales.',
    precio: 2500,
    categoria: 'LACTEOS',
    imagen: '/img/producto4.jpg',
  }
];

// ✅ Función que muestra los productos en el contenedor
export function initCatalogoUI() {
  console.log("Catálogo cargado");

  const contenedor = document.getElementById('descripcionCategoria');
  if (!contenedor) return;

  contenedor.innerHTML = '';

  catalogo.forEach((producto) => {
    const card = document.createElement('div');
    card.className = 'card mb-3';

    card.innerHTML = `
      <div class="row g-0">
        <div class="col-md-4">
          <img src="${producto.imagen}" class="img-fluid rounded-start" alt="${producto.nombre}">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text">${producto.descripcion}</p>
            <p class="card-text"><strong>Precio:</strong> $${producto.precio}</p>
            <p class="card-text"><span class="badge bg-success">${producto.categoria}</span></p>
          </div>
        </div>
      </div>
    `;

    contenedor.appendChild(card);
  });
}