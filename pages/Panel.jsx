import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { initPanelPage, cargarTablaProductos } from "../js/panel-admin";
import { getSession } from "../js/login.js";
import "../src/css/visual.css";

function Panel() {
  const [activeTab, setActiveTab] = useState("users"); // 'users' | 'products'
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentSession = getSession();
    if (!currentSession) {
      navigate("/login");
      return;
    }
    setSession(currentSession);

    // Solo inicializar panel admin si el usuario es admin
    if (currentSession.role === "admin") {
      initPanelPage();
    }
  }, [navigate]);

  useEffect(() => {
    // Cuando se cambia a la pestaña de productos, recargar la tabla y reinicializar botones
    if (activeTab === "products" && session?.role === "admin") {
      // Pequeño delay para asegurar que el DOM esté visible
      setTimeout(() => {
        initPanelPage();
        cargarTablaProductos();
      }, 100);
    }
  }, [activeTab, session]);

  // Si no hay sesión, no renderizar nada (ya se redirige a login)
  if (!session) {
    return null;
  }

  // Vista para usuarios tipo "user"
  if (session.role === "user") {
    return (
      <main className="container my-5">
        <section className="section-bg">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3 mb-0">Mi Panel de Usuario</h1>
            <span className="badge" style={{ backgroundColor: '#2E8B57', color: 'white' }}>
              {session.email} ({session.role})
            </span>
          </div>
          <p className="text-secondary mb-4">
            Bienvenido a tu panel personal. Aquí puedes gestionar tu información y ver tus compras.
          </p>

          <div className="row g-4">
            {/* Información de Perfil */}
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-header text-white" style={{ backgroundColor: '#2E8B57' }}>
                  <h5 className="mb-0">
                    <i className="fas fa-user me-2"></i>
                    Información de Perfil
                  </h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <strong>Email:</strong>
                    <p className="text-muted mb-0">{session.email}</p>
                  </div>
                  <div className="mb-3">
                    <strong>Rol:</strong>
                    <span className="badge ms-2" style={{ backgroundColor: '#198754', color: 'white' }}>{session.role}</span>
                  </div>
                  <p className="text-muted small">
                    Tu información de cuenta está actualizada.
                  </p>
                </div>
              </div>
            </div>

            {/* Área de Acciones Rápidas */}
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-header text-white" style={{ backgroundColor: '#2E8B57' }}>
                  <h5 className="mb-0">
                    <i className="fas fa-shopping-cart me-2"></i>
                    Acciones Rápidas
                  </h5>
                </div>
                <div className="card-body">
                  <div className="d-grid gap-2">
                    <Link to="/productos" className="btn btn-outline-primary">
                      <i className="fas fa-seedling me-2"></i>
                      Ver Productos
                    </Link>
                    <Link to="/carrito" className="btn btn-outline-primary">
                      <i className="fas fa-shopping-cart me-2"></i>
                      Ver Carrito
                    </Link>
                    <Link to="/contacto" className="btn btn-outline-primary">
                      <i className="fas fa-envelope me-2"></i>
                      Contactar
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Mensaje de Bienvenida */}
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="fas fa-info-circle me-2" style={{ color: '#2E8B57' }}></i>
                    Bienvenido a Huerto Hogar
                  </h5>
                  <p className="card-text">
                    Estamos encantados de tenerte aquí. Explora nuestros productos orgánicos 
                    frescos y de calidad. Si tienes alguna pregunta o necesitas ayuda, 
                    no dudes en contactarnos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Vista para administradores
  return (
    <main className="container my-5">
      {/* PANEL ADMIN */}
      <section id="adminView" className="section-bg hidden">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="h3 mb-0">Panel de Administración</h1>
          <span className="badge bg-warning text-dark" id="sessionBadge">
            Admin
          </span>
        </div>
        <p className="text-secondary">
          Administra por separado los usuarios del sistema y los productos del huerto.
        </p>

        {/* Pestañas */}
        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              Gestión de Usuarios
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${activeTab === "products" ? "active" : ""}`}
              onClick={() => setActiveTab("products")}
            >
              Gestión de Productos
            </button>
          </li>
        </ul>

        {/* TAB: Usuarios */}
        <div className={activeTab === "users" ? "card p-3 mb-4" : "card p-3 mb-4 d-none"}>
          <div className="mb-3">
            <h3 className="h5 mb-3">Crear un nuevo usuario</h3>
            <div className="row g-2">
              <div className="col-md-4 mb-2">
                <input
                  id="nuEmail"
                  className="form-control"
                  placeholder="email@dominio.com"
                />
              </div>
              <div className="col-md-3">
                <input
                  id="nuPass"
                  className="form-control"
                  placeholder="contraseña"
                  type="password"
                />
              </div>
              <div className="col-md-3">
                <select id="nuRole" className="form-select">
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </div>
              <div className="col-md-2 d-grid">
                <button id="btnCrearUsuario" className="btn btn-primary">
                  Crear
                </button>
              </div>
            </div>
          </div>

          <h3 className="h5 mb-3">Todos los usuarios registrados</h3>
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead className="table-light">
                <tr>
                  <th>Email</th>
                  <th>Rol</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody id="tblUsers"></tbody>
            </table>
          </div>
        </div>

        {/* TAB: Productos */}
        <div className={activeTab === "products" ? "card p-3 mb-4" : "card p-3 mb-4 d-none"}>
          <h3 className="h5 mb-3">Lista de productos registrados</h3>
          <p className="text-secondary mb-3">
            Crea y actualiza los productos del huerto: nombre, descripción, stock y precio.
          </p>

          {/* Formulario para crear nuevo producto */}
          <div className="mb-3">
            <h4 className="h6 mb-2">Añadir nuevo producto</h4>
            <div className="row g-2">
              <div className="col-md-3">
                <input
                  id="npTitle"
                  className="form-control"
                  placeholder="Nombre del producto"
                />
              </div>
              <div className="col-md-3">
                <input
                  id="npDescription"
                  className="form-control"
                  placeholder="Descripción"
                />
              </div>
              <div className="col-md-3">
                <input
                  id="npImageFile"
                  type="file"
                  accept="image/*"
                  className="form-control"
                />
              </div>
              <div className="col-md-2">
                <input
                  id="npStock"
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="Stock"
                />
              </div>
              <div className="col-md-2">
                <input
                  id="npPrice"
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="Precio"
                />
              </div>
              <div className="col-md-2 d-grid">
                <button
                  id="btnCrearProducto"
                  type="button"
                  className="btn btn-primary"
                >
                  Añadir
                </button>
              </div>
            </div>
          </div>

          {/* Tabla de productos */}
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead className="table-light">
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Imagen</th>
                  <th>Stock</th>
                  <th>Precio</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody id="tblProducts"></tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Panel;
