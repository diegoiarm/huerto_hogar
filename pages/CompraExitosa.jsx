import React, { useState, useEffect } from "react";
import { Container, Button, Modal, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

function CompraExitosa() {
  const [showModal, setShowModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // Recuperar los detalles del pedido del localStorage
    const lastOrder = localStorage.getItem('lastOrder');
    if (lastOrder) {
      setOrderDetails(JSON.parse(lastOrder));
    }
  }, []);
  return (
    <main className="py-5">
      <Container className="d-flex justify-content-center">
        <div className="section-bg text-center px-4 py-5" style={{ maxWidth: 720, width: "100%" }}>
          <div className="mb-4">
            <span className="badge bg-success px-3 py-2">Pago confirmado</span>
          </div>
          <div className="mb-4">
            <i className="fas fa-check-circle texto-esmeralda" style={{ fontSize: "4.5rem" }}></i>
          </div>
          <h1 className="mb-3">¡Gracias por tu compra!</h1>
          <p className="text-secondary mb-5">Tu pedido ha sido procesado correctamente. Te enviaremos un correo con el detalle y el seguimiento.</p>

          <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
            <Button variant="primary" onClick={() => setShowModal(true)} className="px-4">
              <i className="fas fa-receipt me-2"></i>
              Ver detalle del pedido
            </Button>
          </div>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Button as={Link} to="/productos" variant="primary" className="px-4">
              <i className="fas fa-shopping-basket me-2"></i>
              Seguir comprando
            </Button>
            <Button as={Link} to="/" variant="outline-primary" className="px-4">
              <i className="fas fa-home me-2"></i>
              Ir al inicio
            </Button>
          </div>
        </div>
      </Container>

      {/* Modal del detalle de la compra */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        backdrop="static"
        className="modal-detalle-compra"
      >
        <Modal.Header closeButton>
          <Modal.Title>Detalle de tu pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orderDetails ? (
            <>
              <div className="mb-4">
                <h5 className="border-bottom pb-2">Datos del cliente</h5>
                <p className="mb-1"><strong>Nombre:</strong> {orderDetails.cliente.nombre}</p>
                <p className="mb-1"><strong>Email:</strong> {orderDetails.cliente.email}</p>
                <p className="mb-1"><strong>Dirección:</strong> {orderDetails.cliente.direccion}</p>
                <p className="mb-1"><strong>Teléfono:</strong> {orderDetails.cliente.telefono}</p>
              </div>

              <div className="mb-4">
                <h5 className="border-bottom pb-2">Productos</h5>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th className="text-center">Cantidad</th>
                      <th className="text-end">Precio</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.productos.map((item, index) => (
                      <tr key={index}>
                        <td>{item.nombre}</td>
                        <td className="text-center">{item.cantidad}</td>
                        <td className="text-end">${item.precio.toLocaleString('es-CL')}</td>
                        <td className="text-end">${(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <div className="border-top pt-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>${orderDetails.subtotal.toLocaleString('es-CL')}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>IVA (19%):</span>
                  <span>${orderDetails.iva.toLocaleString('es-CL')}</span>
                </div>
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total:</span>
                  <span>${orderDetails.total.toLocaleString('es-CL')}</span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-muted">No se encontraron detalles del pedido</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
}

export default CompraExitosa;
