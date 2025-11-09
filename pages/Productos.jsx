import React, { useState, useEffect } from 'react';
import '../src/css/styles.css';
import '../src/css/visual.css';
import { getCatalogo, agregarAlCarrito, CATEGORIES } from '../js/productos';
import { Toast, Form } from 'react-bootstrap';

const Productos = () => {
  const [categoria, setCategoria] = useState('ALL');
  const [productos, setProductos] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const catalogoCompleto = getCatalogo();
    setProductos(catalogoCompleto);
  }, []);

  const handleAgregarAlCarrito = (id) => {
    const nombreProducto = agregarAlCarrito(id);
    setToastMessage(`${nombreProducto} agregado al carrito`);
    setShowToast(true);
  };

  return (
    <>
      {/* Estilo INCRUSTADO */}
      <style>
        {`
          .producto-card {
            height: 200px;
            width: 100%;
            object-fit: cover;
            display: block;
          }
          .card-img-top.producto-card {
            height: 200px;
            width: 100%;
            object-fit: cover;
            display: block;
          }
        `}
      </style>

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      <main className="container my-5">
        <section className="section-bg">
          <h1 className="h3 mb-3">Catálogo de Productos</h1>

          <div className="row g-3 mb-3">
            <div className="col-md-5">

              {/* --- INICIO DE LA CORRECCIÓN --- */}
              <Form.Label htmlFor="filtro-categoria">Categoría</Form.Label>
              <Form.Select 
                id="filtro-categoria" 
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
              {/* --- FIN DE LA CORRECCIÓN --- */}

                <option value="ALL">Todas las categorías</option>
                {Object.entries(CATEGORIES).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
              </Form.Select>
            </div>

            <div className="col-md-7">
              <div className="p-3 section-bg" style={{ margin: 0 }}>
                {categoria === "ALL" ? (
                  <>
                    <strong>Explora todo nuestro catálogo</strong>
                    <br />
                    Filtra por categoría para ver una curaduría de productos.
                  </>
                ) : CATEGORIES[categoria] ? (
                  <>
                    <strong>{CATEGORIES[categoria].label}</strong>
                    <br />
                    {CATEGORIES[categoria].description}
                  </>
                ) : null}
              </div>
            </div>
          </div>

          <div className="row g-4">
            {productos
              .filter(p => categoria === 'ALL' || p.categoria === categoria)
              .map((producto) => (
                <div key={producto.id} className="col-6 col-md-4 col-lg-3">
                  <div className="card h-100">
                    <img
                      src={producto.imagen}
                      className="card-img-top producto-card"
                      alt={producto.nombre}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{producto.nombre}</h5>
                      {producto.descripcion && (
                        <p className="card-text text-muted small mb-2" style={{ fontSize: '0.875rem' }}>
                          {producto.descripcion}
                        </p>
                      )}
                      <p className="card-text text-success fw-bold">
                        ${producto.precio.toLocaleString()}
                      </p>
                      <button
                        className="btn btn-outline-success mt-auto"
                        onClick={() => handleAgregarAlCarrito(producto.id)}
                      >
                        Agregar al carrito
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </main>

      {/* Toast de notificación */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={3000}
        autohide
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          minWidth: '200px'
        }}
      >
        <Toast.Header>
          <strong className="me-auto">Carrito</strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </>
  );
};

export default Productos;