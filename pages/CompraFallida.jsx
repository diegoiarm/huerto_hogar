import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function CompraFallida() {
  return (
    <main className="py-5">
      <Container className="d-flex justify-content-center">
        <div className="section-bg text-center px-4 py-5" style={{ maxWidth: 720, width: "100%" }}>
          <div className="mb-4">
            <span className="badge bg-danger px-3 py-2">Pago rechazado</span>
          </div>
          <div className="mb-4">
            <i className="fas fa-times-circle text-danger" style={{ fontSize: "4.5rem" }}></i>
          </div>
          <h1 className="mb-3">Hubo un problema con tu compra</h1>
          <p className="text-secondary mb-5">No pudimos procesar el pago. Revisa tus datos o intenta con otro medio de pago.</p>

          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Button as={Link} to="/carrito" variant="primary" className="px-4">
              <i className="fas fa-shopping-cart me-2"></i>
              Volver al carrito
            </Button>
            <Button as={Link} to="/contacto" variant="outline-primary" className="px-4">
              <i className="fas fa-headset me-2"></i>
              Necesito ayuda
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}

export default CompraFallida;
