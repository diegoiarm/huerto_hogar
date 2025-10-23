import React, { useEffect } from 'react';
import '../src/css/styles.css';
import '../src/css/visual.css';
import { initCatalogoUI } from '../js/Productos';

const Productos = () => {
  useEffect(() => {
    initCatalogoUI();
  }, []);

  return (
    <main className="container my-5">
      <section className="section-bg">
        <h1 className="h3 mb-3">Catálogo de Productos</h1>

        <div className="row g-3 mb-3">
          <div className="col-md-5">
            <label className="form-label">Categoría</label>
            <select id="filtroCategoria" className="form-select">
              <option value="ALL">Todas las categorías</option>
              <option value="FRUTAS">Frutas Frescas</option>
              <option value="VERDURAS">Verduras Orgánicas</option>
              <option value="ORGANICOS">Productos Orgánicos</option>
              <option value="LACTEOS">Productos Lácteos</option>
            </select>
          </div>

          <div className="col-md-7">
            <div
              id="descripcionCategoria"
              className="p-3 section-bg"
              style={{ margin: 0 }}
            ></div>
          </div>
        </div>

        <div id="productos" className="row g-4"></div>
      </section>
    </main>
  );
};

export default Productos;
