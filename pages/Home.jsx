import '../src/css/styles.css'
import '../src/css/visual.css'


import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

function Home() {
    return (
        <>
            {/* HERO */}
            <section className="hero-section py-5 text-center">
                <Container>
                    <h1 className="display-4 mb-3">
                        Bienvenido a <span className="highlight">HUERTO HOGAR</span>
                    </h1>
                    <p className="lead text-secondary mb-4">
                        Las mejores frutas y verduras al alcance de todos.
                    </p>
                    <div className="hero-buttons">
                        <Button href="/productos" variant="primary" size="lg" className="mx-2">
                            Ver Productos
                        </Button>
                        <Button href="/registro" variant="outline-primary" size="lg" className="mx-2">
                            Únete Ahora
                        </Button>
                    </div>
                </Container>
            </section>

            {/* CARACTERÍSTICAS */}
            <Container className="my-5">
                <Row>
                    <Col md={4}>
                        <div className="section-bg text-center p-4">
                            <img src="img/frutasyverduras.png" className="img-fluid rounded mb-3" alt="Productos Frescos" />
                            <h3>Productos Frescos</h3>
                            <p className="text-secondary">
                                Seleccionamos cuidadosamente los mejores productos para tu mesa.
                            </p>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="section-bg text-center p-4">
                            <img src="img/agricultor.png" className="img-fluid rounded mb-3" alt="Conexión Local" />
                            <h3>Conexión con el Entorno</h3>
                            <p className="text-secondary">
                                Trabajamos junto a empresas y productores locales para ofrecerte los productos más frescos.
                            </p>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="section-bg text-center p-4">
                            <img src="img/SUS.png" className="img-fluid rounded mb-3" alt="Sustentabilidad" />
                            <h3>Compromiso Sustentable</h3>
                            <p className="text-secondary">
                                Promovemos valores de responsabilidad social y respeto por la naturaleza.
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* PRODUCTOS DESTACADOS DINÁMICOS */}
            <Container className="my-5">
                <h2 className="text-center mb-4">Productos Destacados</h2>
                <Row>
                    {/* Aquí puedes renderizar tus productos destacados dinámicamente con JS externo */}
                    <Col md={4} className="mb-4">
                        <div className="card h-100">
                            <img src="img/manzana.webp" className="card-img-top" alt="Manzana Fuji" style={{ height: 220, objectFit: "cover" }} />
                            <div className="card-body text-center d-flex flex-column justify-content-center">
                                <h5 className="card-title">Manzana Fuji</h5>
                                <p className="card-text">Frutas Frescas</p>
                                <p className="texto-esmeralda fw-bold">$1.200</p>
                                <a href="productos.html" className="btn btn-outline-primary">Ver Detalles</a>
                            </div>
                        </div>
                    </Col>
                    <Col md={4} className="mb-4">
                        <div className="card h-100">
                            <img src="img/naranja.jpg" className="card-img-top" alt="Naranja Valencia" style={{ height: 220, objectFit: "cover" }} />
                            <div className="card-body text-center d-flex flex-column justify-content-center">
                                <h5 className="card-title">Naranja Valencia</h5>
                                <p className="card-text">Frutas Frescas</p>
                                <p className="texto-esmeralda fw-bold">$1.000</p>
                                <a href="productos.html" className="btn btn-outline-primary">Ver Detalles</a>
                            </div>
                        </div>
                    </Col>
                    <Col md={4} className="mb-4">
                        <div className="card h-100">
                            <img src="img/platano.jpg" className="card-img-top" alt="Plátano Cavendish" style={{ height: 220, objectFit: "cover" }} />
                            <div className="card-body text-center d-flex flex-column justify-content-center">
                                <h5 className="card-title">Plátano Cavendish</h5>
                                <p className="card-text">Frutas Frescas</p>
                                <p className="texto-esmeralda fw-bold">$800</p>
                                <a href="productos.html" className="btn btn-outline-primary">Ver Detalles</a>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* BENEFICIOS */}
            <section className="bg-light py-5 my-5">
                <Container>
                    <h2 className="text-center mb-5">¿Por qué elegir Huerto Hogar?</h2>
                    <Row className="g-4">
                        <Col md={3} className="text-center">
                            <i className="fas fa-truck fs-1 texto-esmeralda mb-3"></i>
                            <h4>Envío Rápido</h4>
                            <p className="text-secondary">Entrega el mismo día en zonas seleccionadas.</p>
                        </Col>
                        <Col md={3} className="text-center">
                            <i className="fas fa-leaf fs-1 texto-esmeralda mb-3"></i>
                            <h4>100% Orgánico</h4>
                            <p className="text-secondary">Productos cultivados naturalmente.</p>
                        </Col>
                        <Col md={3} className="text-center">
                            <i className="fas fa-award fs-1 texto-esmeralda mb-3"></i>
                            <h4>Calidad Premium</h4>
                            <p className="text-secondary">Selección de los mejores productos.</p>
                        </Col>
                        <Col md={3} className="text-center">
                            <i className="fas fa-hand-holding-heart fs-1 texto-esmeralda mb-3"></i>
                            <h4>Apoyo Local</h4>
                            <p className="text-secondary">Trabajamos con agricultores de la zona.</p>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* CALL TO ACTION */}
            <Container className="text-center my-5">
                <div className="section-bg py-5">
                    <h2 className="mb-4">¿Listo para empezar?</h2>
                    <p className="lead text-secondary mb-4">
                        Únete a nuestra comunidad y descubre la diferencia de los productos frescos y orgánicos.
                    </p>
                    <div className="d-flex justify-content-center gap-3">
                        <Button href="productos.html" variant="primary" size="lg">
                            Explorar Productos
                        </Button>
                        <Button href="nosotros.html" variant="outline-primary" size="lg">
                            Conoce Más
                        </Button>
                    </div>
                </div>
            </Container>
        </>
    );
}

export default Home;