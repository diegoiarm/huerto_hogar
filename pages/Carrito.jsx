import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, InputGroup, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

const Carrito = () => {
  const [carrito, setCarrito] = useState([]);
  const [cupon, setCupon] = useState('');
  const [total, setTotal] = useState(0);
  const [descuento, setDescuento] = useState(0);

  const LS_CART = "cart.items";

  useEffect(() => {
    cargarCarrito();
  }, []);

  const cargarCarrito = () => {
    try {
      const items = JSON.parse(localStorage.getItem(LS_CART) || "[]");
      setCarrito(items);
      calcularTotales(items);
    } catch (e) {
      setCarrito([]);
      setTotal(0);
    }
  };

  const calcularTotales = (items, descuentoValor = 0) => {
    const subtotal = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    setTotal(subtotal - descuentoValor);
  };

  const guardarCarrito = (items) => {
    localStorage.setItem(LS_CART, JSON.stringify(items));
    setCarrito(items);
    // Recalcular total manteniendo el descuento actual si es posible, 
    // pero si cambia el carrito, el descuento podría invalidarse o cambiar.
    // Por simplicidad, reseteamos descuento si cambia el carrito o lo recalculamos.
    // Aquí recalculamos el total sin descuento por ahora, o aplicamos el descuento si es porcentual.
    // Si el descuento era fijo, podría ser mayor al total.
    // Vamos a resetear el descuento al modificar el carrito para evitar inconsistencias.
    setDescuento(0);
    localStorage.removeItem('cuponAplicado');
    calcularTotales(items, 0);
  };

  const handleActualizarCantidad = (index, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    const nuevoCarrito = [...carrito];
    nuevoCarrito[index].cantidad = nuevaCantidad;
    guardarCarrito(nuevoCarrito);
  };

  const handleEliminarItem = (index) => {
    const nuevoCarrito = carrito.filter((_, i) => i !== index);
    guardarCarrito(nuevoCarrito);
  };

  const handleVaciarCarrito = () => {
    guardarCarrito([]);
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
    
    // Lógica simulada de cupón
    if (cupon.toUpperCase() === 'DESCUENTO10') {
      const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
      const descuentoValor = subtotal * 0.10;
      setDescuento(descuentoValor);
      setTotal(subtotal - descuentoValor);
      localStorage.setItem('cuponAplicado', 'DESCUENTO10');
      
      Swal.fire({
        icon: 'success',
        title: 'Cupón aplicado',
        text: 'Descuento del 10% aplicado correctamente',
        confirmButtonText: 'Aceptar',
        timer: 2000
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Cupón inválido',
        text: 'El código ingresado no es válido.',
        confirmButtonText: 'Aceptar'
      });
      setDescuento(0);
      const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
      setTotal(subtotal);
      localStorage.removeItem('cuponAplicado');
    }
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
                            onError={(e) => {e.target.src = 'https://via.placeholder.com/50'}}
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
                      <td className="text-end">${item.precio.toLocaleString('es-CL')}</td>
                      <td className="text-end">${(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
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
                      <small>Descuento aplicado: -${descuento.toLocaleString('es-CL')}</small>
                    </div>
                  )}
                  <h2 className="h5 mb-0">
                    {descuento > 0 && (
                      <span className="text-decoration-line-through text-muted me-2">
                        ${(total + descuento).toLocaleString('es-CL')}
                      </span>
                    )}
                    Total: ${total.toLocaleString('es-CL')}
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
