import '../src/css/styles.css';
import '../src/css/visual.css';

import React from 'react';
import { Col, Card, Badge, Button } from 'react-bootstrap';

function Nosotros(){
    return(
    <main>
          <section className="py-5" id="quienes-somos">
    <div className="container">
      <div className="row align-items-center">

 
        <div className="col-md-7">
          <div className="section-bg">
            <h2 className="mb-3">Quiénes Somos</h2>
            <p className="text-secondary">
              <strong>HuertoHogar</strong> es una tienda online con más de 6 años de experiencia, dedicada a llevar la
              frescura y calidad del campo directamente a los hogares de Chile.
              Operamos en más de 9 ciudades clave, incluyendo <em>Santiago, Puerto Montt, Villarica, Nacimiento, Viña
                del Mar, Valparaíso</em> y <em>Concepción</em>.
            </p>
            <p className="text-secondary">
              Nuestra <strong>misión</strong> es conectar a las familias chilenas con los agricultores locales,
              promoviendo un estilo de vida saludable y sostenible mediante productos frescos y de calidad.
            </p>
            <p className="text-secondary">
              Nuestra <strong>visión</strong> es ser la tienda online líder en la distribución de productos naturales en
              Chile, destacando por la calidad, el servicio y el compromiso con la sostenibilidad.
            </p>
          </div>
        </div>


        <div className="col-md-5 text-center">
          <img src="/img/planta.png" class="img-fluid rounded shadow" alt="HuertoHogar"/>
        </div>
      </div>
    </div>
  </section>


  <section className="py-5" id="cifras">
    <div className="container">
      <div className="row text-center g-4">
        <div className="col-6 col-md-3">
          <div className="kpi">
            <div className="display-6 fw-bold">6+</div>
            <div className="text-secondary">Años de experiencia</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="kpi">
            <div className="display-6 fw-bold">9+</div>
            <div className="text-secondary">Ciudades activas</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="kpi">
            <div className="display-6 fw-bold">150+</div>
            <div className="text-secondary">Agricultores aliados</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="kpi">
            <div className="display-6 fw-bold">98%</div>
            <div className="text-secondary">Satisfacción clientes</div>
          </div>
        </div>
      </div>
    </div>
  </section>


  <section className="py-5 bg-light" id="valores">
    <div className="container">
      <h2 className="text-center mb-4 section-title">Nuestros valores</h2>
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <div className="fs-2 mb-2">🌱</div>
              <h5 className="card-title mb-2">Sostenibilidad</h5>
              <p className="card-text text-secondary">Trabajamos con prácticas responsables para reducir huella y fomentar
                circuitos cortos de distribución.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <div className="fs-2 mb-2">🤝</div>
              <h5 className="card-title mb-2">Comunidad</h5>
              <p className="card-text text-secondary">Impulsamos economías locales fortaleciendo el vínculo directo entre
                productor y familia.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <div className="fs-2 mb-2">✅</div>
              <h5 className="card-title mb-2">Calidad</h5>
              <p className="card-text text-secondary">Selección rigurosa y procesos de frío garantizan frescura y sabor en
                cada entrega.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
    </main>
    )
}

export default Nosotros;