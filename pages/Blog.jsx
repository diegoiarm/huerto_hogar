import '../src/css/styles.css';
import '../src/css/visual.css';

import React from 'react';
import { Col, Card, Badge, Button } from 'react-bootstrap';

function Blog() {
  return (
    <main className="blog-main">
      <section className="py-5" id="blog">
        <div className="container">
          <h2 className="text-center mb-2">Blog</h2>
          <p className="text-center text-secondary mb-4">
            Últimas noticias y artículos sobre nuestros productos y sostenibilidad.
          </p>

          <div className="row g-4">


            <div className="col-12 col-md-6">
              <article className="card h-100 shadow-sm border-0">
                <div className="row g-0 h-100">
                  <div className="col-5">
                    <a href="dato1.html" className="d-block h-100">
                      <img
                        src="img/cajondev.webp"
                        className="img-fluid rounded-start h-100 object-fit-cover"
                        alt="Cosecha en cajón directo desde el campo"
                        width="600"
                        height="400"
                        loading="lazy"
                        decoding="async"
                        sizes="(max-width: 576px) 100vw, (max-width: 992px) 50vw, 600px"
                      />
                    </a>
                  </div>
                  <div className="col-7">
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="badge bg-success-subtle text-success-emphasis border border-success-subtle">
                          Frescura
                        </span>
                        <time className="text-muted small" dateTime="2025-09-10">
                          10 Sep 2025
                        </time>
                        <span className="text-muted small">· 2 min</span>
                      </div>
                      <h3 className="h5 card-title">¿Sabías que…?</h3>
                      <p className="card-text text-secondary mb-3">
                        En <strong>HuertoHogar</strong> cada pedido recorre en promedio menos de
                        <strong> 150&nbsp;km</strong> desde el campo hasta tu puerta. Más frescura y una
                        <em> huella de carbono menor</em> que el retail tradicional.
                      </p>
                      <div className="mt-auto">
                        <a href="/blog/dato1" className="btn btn-outline-success btn-sm">
                          Leer más
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            <div className="col-12 col-md-6">
              <article className="card h-100 shadow-sm border-0">
                <div className="row g-0 h-100">
                  <div className="col-5">
                    <a href="dato2.html" className="d-block h-100">
                      <img
                        src="img/empaque.webp"
                        className="img-fluid rounded-start h-100 object-fit-cover"
                        alt="Empaques sostenibles y biodegradables"
                        width="600"
                        height="400"
                        loading="lazy"
                        decoding="async"
                        sizes="(max-width: 576px) 100vw, (max-width: 992px) 50vw, 600px"
                      />
                    </a>
                  </div>
                  <div className="col-7">
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="badge bg-success-subtle text-success-emphasis border border-success-subtle">
                          Sostenibilidad
                        </span>
                        <time className="text-muted small" dateTime="2025-09-05">
                          5 Sep 2025
                        </time>
                        <span className="text-muted small">· 3 min</span>
                      </div>
                      <h3 className="h5 card-title">Curiosidad Verde</h3>
                      <p className="card-text text-secondary mb-3">
                        Desde 2022, el <strong>70%</strong> de nuestros empaques son reciclados o
                        biodegradables. La meta: <strong>100%</strong> sostenibles para 2026.
                      </p>
                      <div className="mt-auto">
                        <a href="/blog/dato2" className="btn btn-outline-success btn-sm">
                          Leer más
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

export default Blog;
