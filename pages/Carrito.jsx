import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, InputGroup, Form, Container } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { 
  getCarrito, 
  guardarCarrito, 
  actualizarCantidad as actualizarCantidadCarrito,
  eliminarItem as eliminarItemCarrito,
  vaciarCarrito as vaciarCarritoCompleto,
  calcularSubtotal,
  calcularTotal,
  aplicarDescuento
} from '../js/carrito';

const Carrito = () => {
  const [carrito, setCarrito] = useState([]);
  const [cupon, setCupon] = useState('');
  const [total, setTotal] = useState(0);
  const [descuento, setDescuento] = useState(0);

  useEffect(() => {
    const itemsGuardados = getCarrito();
    setCarrito(itemsGuardados);
    setTotal(calcularTotal(itemsGuardados));
  }, []);

  const handleActualizarCantidad = (index, nuevaCantidad) => {
    const nuevoCarrito = actualizarCantidadCarrito(carrito, index, nuevaCantidad);
    setCarrito(nuevoCarrito);
    setTotal(calcularTotal(nuevoCarrito));
  };

  const handleEliminarItem = (index) => {
    const nuevoCarrito = eliminarItemCarrito(carrito, index);
    setCarrito(nuevoCarrito);
    setTotal(calcularTotal(nuevoCarrito));
  };

  const handleVaciarCarrito = () => {
    setCarrito(vaciarCarritoCompleto());
    setTotal(0);
    setDescuento(0);
  };

  const handleAplicarCupon = () => {
    if (!cupon.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Falta código',
        text: 'Por favor ingresa un código de cupón',
        confirmButtonText: 'Entendido'
      });
      return;
    }
    
    const resultado = aplicarDescuento(total, cupon);
    if (resultado.total === total) {
      Swal.fire({
        icon: 'error',
        title: 'Cupón inválido',
        text: 'El código ingresado no es válido.',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
    
    setDescuento(resultado.descuento);
    setTotal(resultado.total);
  };

  return (
    <main className="container my-5">
      <section className="section-bg">
        <h1 className="h3 mb-3">Tu carrito</h1>
        {carrito.length === 0 ? (
          <p>Tu carrito está vacío.</p>
        ) : (
          <>
            <div className="table-responsive">
              <Table className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Producto</th>
                    <th className="text-center">Cantidad</th>
                    <th className="text-end">Precio</th>
                    <th className="text-end">Subtotal</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {carrito.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img 
                            src={item.imagen} 
                            alt={item.nombre} 
                            className="me-3" 
                            style={{width: '50px', height: '50px', objectFit: 'cover'}}
                          />
                          <div>
                            <h6 className="mb-0">{item.nombre}</h6>
                            <small className="text-muted">{item.descripcion}</small>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="input-group input-group-sm" style={{maxWidth: '120px', margin: '0 auto'}}>
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => handleActualizarCantidad(index, item.cantidad - 1)}
                          >
                            -
                          </Button>
                          <Form.Control
                            type="number"
                            value={item.cantidad}
                            min="1"
                            onChange={(e) => handleActualizarCantidad(index, parseInt(e.target.value) || 1)}
                            className="text-center"
                          />
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => handleActualizarCantidad(index, item.cantidad + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </td>
                      <td className="text-end">${item.precio.toFixed(0)}</td>
                      <td className="text-end">${calcularSubtotal(item.precio, item.cantidad)}</td>
                      <td className="text-end">
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleEliminarItem(index)}
                        >
                          ×
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mt-3">
              <div className="d-flex flex-column flex-sm-row align-items-stretch gap-2">
                <InputGroup>
                  <InputGroup.Text>Cupón</InputGroup.Text>
                  <Form.Control
                    placeholder="Ingresa tu código"
                    value={cupon}
                    onChange={(e) => setCupon(e.target.value)}
                  />
                  <Button variant="outline-primary" onClick={handleAplicarCupon}>
                    Aplicar
                  </Button>
                </InputGroup>
                <Button variant="outline-danger" onClick={handleVaciarCarrito}>
                  Vaciar carrito
                </Button>
              </div>

              <div className="d-flex align-items-center gap-3 justify-content-between">
                <div>
                  {descuento > 0 && (
                    <div className="text-success mb-2">
                      <small>Descuento aplicado: -${descuento.toFixed(0)}</small>
                    </div>
                  )}
                  <h2 className="h5 mb-0">
                    {descuento > 0 && (
                      <span className="text-decoration-line-through text-muted me-2">
                        ${(total + descuento).toFixed(0)}
                      </span>
                    )}
                    Total: ${total.toFixed(0)}
                  </h2>
                </div>
                <Link to="/formulario-direccion" className="btn btn-success">
                  Pagar
                </Link>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default Carrito;
