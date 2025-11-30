import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../src/api_rest";
import Swal from "sweetalert2";

function FormularioDireccion() {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    telefono: "",
    direccion: "",
    numeroDireccion: "",
    comuna: "",
    region: "",
    codigoPostal: "",
    tipoEntrega: "",
    notas: "",
  });

  const [errors, setErrors] = useState({});
  const [carrito, setCarrito] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [iva, setIva] = useState(0);
  const [descuento, setDescuento] = useState(0);
  const [total, setTotal] = useState(0);
  const [cuponAplicado, setCuponAplicado] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarCarrito = () => {
      const LS_CART = "cart.items";
      let items = [];
      try {
        items = JSON.parse(localStorage.getItem(LS_CART) || "[]");
      } catch (e) {
        items = [];
      }
      setCarrito(items);
      
      const subtotalCalculado = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
      setSubtotal(subtotalCalculado);

      // Verificar si hay un cupón guardado (lógica simplificada, idealmente validar con backend)
      const cuponGuardado = localStorage.getItem("cuponAplicado");
      let descuentoCalculado = 0;
      
      // Simulación de validación de cupón (puedes mover esto a una función o API)
      if (cuponGuardado === "DESCUENTO10") {
         descuentoCalculado = subtotalCalculado * 0.10;
         setCuponAplicado({ codigo: cuponGuardado, descuento: 0.10 });
      } else {
         setCuponAplicado(null);
      }

      setDescuento(descuentoCalculado);
      
      // Calcular IVA sobre el subtotal después del descuento
      const subtotalDespuesDescuento = subtotalCalculado - descuentoCalculado;
      const ivaCalculado = subtotalDespuesDescuento * 0.19; // IVA 19% en Chile
      setIva(ivaCalculado);
      
      // Total final = subtotal - descuento + IVA
      setTotal(subtotalDespuesDescuento + ivaCalculado);
    };

    cargarCarrito();
    
    const handleStorageChange = () => {
      cargarCarrito();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const cambio = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombreCompleto.trim()) {
      nuevosErrores.nombreCompleto = "El nombre completo es requerido.";
    } else if (formData.nombreCompleto.trim().length < 3) {
      nuevosErrores.nombreCompleto = "El nombre debe tener al menos 3 caracteres.";
    }

    if (!formData.telefono.trim()) {
      nuevosErrores.telefono = "El teléfono es requerido.";
    } else if (!/^[0-9+\-\s()]{8,15}$/.test(formData.telefono.trim())) {
      nuevosErrores.telefono = "Ingrese un teléfono válido (8-15 dígitos).";
    }

    if (!formData.direccion.trim()) {
      nuevosErrores.direccion = "La dirección es requerida.";
    } else if (formData.direccion.trim().length < 5) {
      nuevosErrores.direccion = "La dirección debe tener al menos 5 caracteres.";
    }

    if (!formData.numeroDireccion.trim()) {
      nuevosErrores.numeroDireccion = "El número de dirección es requerido.";
    }

    if (!formData.comuna.trim()) {
      nuevosErrores.comuna = "La comuna es requerida.";
    }

    if (!formData.region.trim()) {
      nuevosErrores.region = "La región es requerida.";
    }

    if (!formData.tipoEntrega) {
      nuevosErrores.tipoEntrega = "Seleccione un tipo de entrega.";
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const limpiarFormulario = () => {
    setFormData({
      nombreCompleto: "",
      telefono: "",
      direccion: "",
      numeroDireccion: "",
      comuna: "",
      region: "",
      codigoPostal: "",
      tipoEntrega: "",
      notas: "",
    });
    setErrors({});
  };

  const enviarDatos = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    const detallesPedido = {
      nombreCompleto: formData.nombreCompleto,
      telefono: formData.telefono,
      direccionCompleta: `${formData.direccion} ${formData.numeroDireccion}, ${formData.comuna}, ${formData.region}`,
      comuna: formData.comuna,
      region: formData.region,
      codigoPostal: formData.codigoPostal,
      tipoEntrega: formData.tipoEntrega,
      notas: formData.notas,
      subtotal: subtotal,
      descuento: descuento,
      iva: iva,
      total: total,
      detalles: carrito.map(item => ({
        producto: { id: item.id },
        cantidad: item.cantidad,
        precioUnitario: item.precio,
        totalLinea: item.precio * item.cantidad
      }))
    };

    try {
      await createOrder(detallesPedido);
      
      // Limpiar carrito y cupón
      localStorage.removeItem("cart.items");
      localStorage.removeItem("cuponAplicado");
      
      // Guardar objeto para mostrar en CompraExitosa (incluyendo nombres de productos)
      const orderForDisplay = {
        ...detallesPedido,
        productos: carrito // Guardamos el carrito original que tiene nombres e imágenes
      };
      
      localStorage.setItem('lastOrder', JSON.stringify(orderForDisplay));

      navigate("/compra-exitosa");
    } catch (error) {
      console.error("Error al crear la orden:", error);
      navigate("/compra-fallida");
    }
  };

  const formatoPrecio = (precio) => {
    return precio.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  return (
    <main className="container my-5">
      <div className="row">
        {/* Formulario a la izquierda */}
        <div className="col-lg-7 mb-4 mb-lg-0">
          <section className="section-bg">
            <h1 className="h3 text-center mb-3">Completar Pedido</h1>
            <p className="text-secondary text-center mb-4">
              Ingresa tus datos de entrega para finalizar tu compra. Todos los campos marcados con * son obligatorios.
            </p>

            <form onSubmit={enviarDatos} noValidate>
          <div className="mb-3">
            <label htmlFor="nombreCompleto" className="form-label">
              Nombre Completo <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${errors.nombreCompleto ? "is-invalid" : ""}`}
              id="nombreCompleto"
              name="nombreCompleto"
              placeholder="ej: Juan Pérez"
              value={formData.nombreCompleto}
              onChange={cambio}
              required
              maxLength={100}
            />
            <div className="invalid-feedback">{errors.nombreCompleto}</div>
          </div>

          <div className="mb-3">
            <label htmlFor="telefono" className="form-label">
              Teléfono de Contacto <span className="text-danger">*</span>
            </label>
            <input
              type="tel"
              className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
              id="telefono"
              name="telefono"
              placeholder="ej: +56 9 1234 5678"
              value={formData.telefono}
              onChange={cambio}
              required
              maxLength={15}
            />
            <div className="invalid-feedback">{errors.telefono}</div>
          </div>

          <div className="mb-3">
            <label htmlFor="direccion" className="form-label">
              Dirección <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${errors.direccion ? "is-invalid" : ""}`}
              id="direccion"
              name="direccion"
              placeholder="ej: Av. Principal"
              value={formData.direccion}
              onChange={cambio}
              required
              maxLength={150}
            />
            <div className="invalid-feedback">{errors.direccion}</div>
          </div>

          <div className="mb-3">
            <label htmlFor="numeroDireccion" className="form-label">
              Número de Dirección <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${errors.numeroDireccion ? "is-invalid" : ""}`}
              id="numeroDireccion"
              name="numeroDireccion"
              placeholder="ej: 1234"
              value={formData.numeroDireccion}
              onChange={cambio}
              required
              maxLength={10}
            />
            <div className="invalid-feedback">{errors.numeroDireccion}</div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="comuna" className="form-label">
                Comuna <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.comuna ? "is-invalid" : ""}`}
                id="comuna"
                name="comuna"
                placeholder="ej: Providencia"
                value={formData.comuna}
                onChange={cambio}
                required
                maxLength={50}
              />
              <div className="invalid-feedback">{errors.comuna}</div>
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="region" className="form-label">
                Región <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.region ? "is-invalid" : ""}`}
                id="region"
                name="region"
                placeholder="ej: Metropolitana"
                value={formData.region}
                onChange={cambio}
                required
                maxLength={50}
              />
              <div className="invalid-feedback">{errors.region}</div>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="codigoPostal" className="form-label">
              Código Postal (Opcional)
            </label>
            <input
              type="text"
              className="form-control"
              id="codigoPostal"
              name="codigoPostal"
              placeholder="ej: 7500000"
              value={formData.codigoPostal}
              onChange={cambio}
              maxLength={10}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="tipoEntrega" className="form-label">
              Tipo de Entrega <span className="text-danger">*</span>
            </label>
            <select
              className={`form-select ${errors.tipoEntrega ? "is-invalid" : ""}`}
              id="tipoEntrega"
              name="tipoEntrega"
              value={formData.tipoEntrega}
              onChange={cambio}
              required
            >
              <option value="">Seleccione una opción</option>
              <option value="normal">Entrega Normal (5-7 días hábiles)</option>
              <option value="express">Entrega Express (2-3 días hábiles)</option>
              <option value="mismo-dia">Entrega el Mismo Día (Solo disponible en algunas comunas)</option>
            </select>
            <div className="invalid-feedback">{errors.tipoEntrega}</div>
          </div>

          <div className="mb-3">
            <label htmlFor="notas" className="form-label">
              Notas Adicionales (Opcional)
            </label>
            <textarea
              className="form-control"
              id="notas"
              name="notas"
              rows="3"
              placeholder="Instrucciones adicionales para la entrega..."
              value={formData.notas}
              onChange={cambio}
              maxLength={500}
            />
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary w-100">
              Confirmar Compra
            </button>
            <button type="button" onClick={limpiarFormulario} className="btn btn-outline-secondary">
              Limpiar
            </button>
          </div>
        </form>
      </section>
        </div>

        {/* Vista previa del carrito a la derecha */}
        <div className="col-lg-5">
          <section className="section-bg">
            <h2 className="h4 mb-3">Resumen del Pedido</h2>
            
            {carrito.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted">Tu carrito está vacío</p>
              </div>
            ) : (
              <>
                <div className="mb-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {carrito.map((item, index) => (
                    <div key={index} className="d-flex align-items-start mb-3 pb-3 border-bottom">
                      <img 
                        src={item.imagen} 
                        alt={item.nombre} 
                        className="me-3 rounded"
                        style={{
                          width: '60px', 
                          height: '60px', 
                          objectFit: 'cover',
                          flexShrink: 0
                        }}
                        onError={(e) => {e.target.src = 'https://via.placeholder.com/60'}}
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{item.nombre}</h6>
                        <small className="text-muted d-block mb-1">
                          Cantidad: {item.cantidad}
                        </small>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-muted small">
                            ${formatoPrecio(item.precio)} c/u
                          </span>
                          <strong className="text-end">
                            ${formatoPrecio(item.precio * item.cantidad)}
                          </strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-top pt-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>${formatoPrecio(subtotal)}</span>
                  </div>

                  {descuento > 0 && (
                    <div className="d-flex justify-content-between mb-2 text-success">
                      <span>
                        Descuento {cuponAplicado && `(${cuponAplicado.codigo})`}:
                      </span>
                      <span>-${formatoPrecio(descuento)}</span>
                    </div>
                  )}

                  <div className="d-flex justify-content-between mb-2">
                    <span>IVA (19%):</span>
                    <span>${formatoPrecio(iva)}</span>
                  </div>

                  <div className="d-flex justify-content-between align-items-center border-top pt-2 mt-3">
                    <strong className="h5 mb-0">Total:</strong>
                    <strong className="h5 mb-0 text-success">
                      ${formatoPrecio(total)}
                    </strong>
                  </div>

                  {cuponAplicado && (
                    <div className="mt-2">
                      <small className="text-success">
                        <i className="bi bi-check-circle"></i> Cupón {cuponAplicado.codigo} aplicado
                      </small>
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default FormularioDireccion;
