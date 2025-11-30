import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  getProfile, 
  getAllUsers, 
  deleteUser, 
  updateUser, 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  createUser, // Para crear usuario desde admin
  getCategories, // Importar getCategories
  getOrders // Importar getOrders
} from "../src/api_rest";
import Swal from "sweetalert2";
import "../src/css/visual.css";

function Panel() {
  const [activeTab, setActiveTab] = useState("products"); // Default to products as it's common
  const [session, setSession] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [orders, setOrders] = useState([]); // New state for orders
  const navigate = useNavigate();

  // Estados para crear usuario
  const [newUser, setNewUser] = useState({ email: "", password: "", role: "user" });

  // Estados para crear producto
  const [newProduct, setNewProduct] = useState({ 
    nombre: "", 
    descripcion: "", 
    stock: 0, 
    precio: 0, 
    imagen: "",
    categoria: null 
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    getProfile()
      .then((response) => {
        setSession(response.data);
        const role = response.data.role ? response.data.role.toUpperCase() : "";
        
        // Allow ADMIN and VENDEDOR
        if (role === "ADMIN" || role === "VENDEDOR") {
          fetchProducts();
          fetchCategories();
          fetchOrders(); // Traer ordenes
          
          if (role === "ADMIN") {
            fetchUsers(); // Solo el admin trae los usuarios
            setActiveTab("users");
          } else {
            setActiveTab("products");
          }
        }
      })
      .catch((error) => {
        console.error("Error trayendo el perfil:", error);
        navigate("/login");
      });
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
      if (response.data.length > 0) {
        setNewProduct(prev => ({ ...prev, categoria: response.data[0] }));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // --- Gestión de Usuarios ---
  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.password) {
      Swal.fire("Error", "Email y contraseña son obligatorios", "warning");
      return;
    }
    try {
      await createUser({
        email: newUser.email,
        password: newUser.password,
        role: newUser.role === "admin" ? "ADMIN" : "CLIENTE", 
        nombreCompleto: "Usuario Admin Created", 
        rut: "1-9", 
        region: "Metropolitana", 
        comuna: "Santiago", 
        telefono: "+56900000000" 
      });
      Swal.fire("Éxito", "Usuario creado", "success");
      setNewUser({ email: "", password: "", role: "user" });
      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
      Swal.fire("Error", "No se pudo crear el usuario", "error");
    }
  };

  const handleDeleteUser = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(id);
        Swal.fire("Eliminado", "Usuario eliminado", "success");
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        Swal.fire("Error", "No se pudo eliminar el usuario", "error");
      }
    }
  };

  const handleUpdateUserRole = async (user, newRole) => {
    try {
      await updateUser(user.id, { ...user, role: newRole });
      Swal.fire("Actualizado", `Rol cambiado a ${newRole}`, "success");
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire("Error", "No se pudo actualizar el usuario", "error");
    }
  };

  // --- Gestión de Productos ---
  const handleImageUpload = (e, isNew = true, prodIndex = null) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (isNew) {
        setNewProduct(prev => ({ ...prev, imagen: reader.result }));
      } else if (prodIndex !== null) {
        const updatedProducts = [...products];
        updatedProducts[prodIndex].imagen = reader.result;
        setProducts(updatedProducts);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateProduct = async () => {
    if (!newProduct.nombre || !newProduct.descripcion || !newProduct.categoria) {
      Swal.fire("Error", "Nombre, descripción y categoría son obligatorios", "warning");
      return;
    }
    try {
      await createProduct(newProduct);
      Swal.fire("Éxito", "Producto creado", "success");
      setNewProduct({ 
        nombre: "", 
        descripcion: "", 
        stock: 0, 
        precio: 0, 
        imagen: "", 
        categoria: categories.length > 0 ? categories[0] : null 
      });
      fetchProducts();
    } catch (error) {
      console.error("Error creating product:", error);
      Swal.fire("Error", "No se pudo crear el producto", "error");
    }
  };

  const handleUpdateProduct = async (product) => {
    try {
      await updateProduct(product.id, product);
      Swal.fire("Actualizado", "Producto actualizado", "success");
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      Swal.fire("Error", "No se pudo actualizar el producto", "error");
    }
  };

  const handleDeleteProduct = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteProduct(id);
        Swal.fire("Eliminado", "Producto eliminado", "success");
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        Swal.fire("Error", "No se pudo eliminar el producto", "error");
      }
    }
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };

  const handleShowOrderDetails = (order) => {
    Swal.fire({
      title: `<strong>Orden #${order.id}</strong>`,
      html: `
        <div style="text-align: left; font-size: 0.95rem;">
          <hr/>
          <h6 style="color: #2E8B57; font-weight: bold;">Información de Contacto</h6>
          <p style="margin-bottom: 5px;"><strong>Nombre:</strong> ${order.nombreCompleto || "N/A"}</p>
          <p style="margin-bottom: 5px;"><strong>Teléfono:</strong> ${order.telefono || "N/A"}</p>
          <p style="margin-bottom: 15px;"><strong>Email:</strong> ${order.usuario ? order.usuario.email : "N/A"}</p>
          
          <h6 style="color: #2E8B57; font-weight: bold;">Datos de Envío</h6>
          <p style="margin-bottom: 5px;"><strong>Dirección:</strong> ${order.direccionCompleta || "N/A"}</p>
          <p style="margin-bottom: 5px;"><strong>Comuna:</strong> ${order.comuna || "N/A"}</p>
          <p style="margin-bottom: 5px;"><strong>Región:</strong> ${order.region || "N/A"}</p>
          <p style="margin-bottom: 15px;"><strong>Método:</strong> ${order.tipoEntrega || "N/A"}</p>
          
          ${order.notas ? `
            <h6 style="color: #2E8B57; font-weight: bold;">Notas Adicionales</h6>
            <p style="font-style: italic;">"${order.notas}"</p>
          ` : ""}
        </div>
      `,
      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText: '<i class="fa fa-thumbs-up"></i> Entendido',
      confirmButtonColor: '#2E8B57',
    });
  };

  if (!session) return null;

  const role = session.role ? session.role.toUpperCase() : "";
  const isAdmin = role === "ADMIN";
  const isVendedor = role === "VENDEDOR";

  // Vista Usuario Normal (CLIENTE)
  if (!isAdmin && !isVendedor) {
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
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-header text-white" style={{ backgroundColor: '#2E8B57' }}>
                  <h5 className="mb-0"><i className="fas fa-user me-2"></i>Información de Perfil</h5>
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
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-header text-white" style={{ backgroundColor: '#2E8B57' }}>
                  <h5 className="mb-0"><i className="fas fa-shopping-cart me-2"></i>Acciones Rápidas</h5>
                </div>
                <div className="card-body">
                  <div className="d-grid gap-2">
                    <Link to="/productos" className="btn btn-outline-primary"><i className="fas fa-seedling me-2"></i>Ver Productos</Link>
                    <Link to="/carrito" className="btn btn-outline-primary"><i className="fas fa-shopping-cart me-2"></i>Ver Carrito</Link>
                    <Link to="/contacto" className="btn btn-outline-primary"><i className="fas fa-envelope me-2"></i>Contactar</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Vista Admin / Vendedor
  return (
    <main className="container my-5">
      <section className="section-bg">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="h3 mb-0">Panel de Gestión</h1>
          <span className={`badge ${isAdmin ? "bg-warning text-dark" : "bg-info text-dark"}`}>
            {isAdmin ? "Administrador" : "Vendedor"}
          </span>
        </div>
        <p className="text-secondary">
          {isAdmin 
            ? "Administra usuarios, productos y revisa las ventas." 
            : "Gestiona el catálogo de productos y revisa las órdenes de compra."}
        </p>

        <ul className="nav nav-tabs mb-3">
          {isAdmin && (
            <li className="nav-item">
              <button className={`nav-link ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
                Gestión de Usuarios
              </button>
            </li>
          )}
          <li className="nav-item">
            <button className={`nav-link ${activeTab === "products" ? "active" : ""}`} onClick={() => setActiveTab("products")}>
              Gestión de Productos
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === "orders" ? "active" : ""}`} onClick={() => setActiveTab("orders")}>
              Gestión de Boletas
            </button>
          </li>
        </ul>

        {/* TAB: Usuarios (Solo Admin) */}
        {activeTab === "users" && isAdmin && (
          <div className="card p-3 mb-4">
            <div className="mb-3">
              <h3 className="h5 mb-3">Crear un nuevo usuario</h3>
              <div className="row g-2">
                <div className="col-md-4 mb-2">
                  <input
                    className="form-control"
                    placeholder="email@dominio.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    className="form-control"
                    placeholder="contraseña"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  />
                </div>
                <div className="col-md-3">
                  <select 
                    className="form-select"
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </div>
                <div className="col-md-2 d-grid">
                  <button className="btn btn-primary" onClick={handleCreateUser}>Crear</button>
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
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${
                          user.role === "ADMIN" ? "bg-warning text-dark" : 
                          user.role === "VENDEDOR" ? "bg-info text-dark" : 
                          "bg-secondary"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <button 
                            className="btn btn-outline-success" 
                            onClick={() => handleUpdateUserRole(user, "ADMIN")}
                            disabled={user.role === "ADMIN"}
                          >
                            Hacer admin
                          </button>
                          <button 
                            className="btn btn-outline-info" 
                            onClick={() => handleUpdateUserRole(user, "VENDEDOR")}
                            disabled={user.role === "VENDEDOR"}
                          >
                            Hacer vendedor
                          </button>
                          <button 
                            className="btn btn-outline-primary" 
                            onClick={() => handleUpdateUserRole(user, "CLIENTE")}
                            disabled={user.role === "CLIENTE"}
                          >
                            Hacer user
                          </button>
                          <button className="btn btn-outline-danger" onClick={() => handleDeleteUser(user.id)}>Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: Productos */}
        {activeTab === "products" && (
          <div className="card p-3 mb-4">
            <h3 className="h5 mb-3">Lista de productos registrados</h3>
            
            {/* Formulario Crear Producto (Solo Admin) */}
            {isAdmin && (
              <div className="mb-3 p-3 border rounded bg-light">
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label small fw-bold">Nombre</label>
                    <input
                      className="form-control"
                      placeholder="Ej: Manzanas"
                      value={newProduct.nombre}
                      onChange={(e) => setNewProduct({...newProduct, nombre: e.target.value})}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-bold">Descripción</label>
                    <input
                      className="form-control"
                      placeholder="Breve descripción"
                      value={newProduct.descripcion}
                      onChange={(e) => setNewProduct({...newProduct, descripcion: e.target.value})}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-bold">Categoría</label>
                    <select
                      className="form-select"
                      value={newProduct.categoria ? newProduct.categoria.id : ""}
                      onChange={(e) => {
                          const selectedCat = categories.find(c => c.id === parseInt(e.target.value));
                          setNewProduct({...newProduct, categoria: selectedCat});
                      }}
                    >
                      <option value="">Seleccione...</option>
                      {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-bold">Imagen</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={(e) => handleImageUpload(e, true)}
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label small fw-bold">Stock</label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      placeholder="0"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label small fw-bold">Precio</label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      placeholder="$"
                      value={newProduct.precio}
                      onChange={(e) => setNewProduct({...newProduct, precio: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div className="col-md-2 d-flex align-items-end">
                    <button className="btn w-100 text-white" style={{ backgroundColor: '#2E8B57' }} onClick={handleCreateProduct}>
                      <i className="fas fa-plus me-1"></i> Añadir
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Imagen</th>
                    <th>Stock</th>
                    <th>Precio</th>
                    {isAdmin && <th className="text-end">Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, index) => (
                    <tr key={p.id}>
                      <td>
                        {isAdmin ? (
                          <input 
                            type="text" 
                            className="form-control form-control-sm" 
                            value={p.nombre} 
                            onChange={(e) => handleProductChange(index, 'nombre', e.target.value)}
                          />
                        ) : p.nombre}
                      </td>
                      <td>
                        {isAdmin ? (
                          <textarea 
                            className="form-control form-control-sm" 
                            value={p.descripcion}
                            onChange={(e) => handleProductChange(index, 'descripcion', e.target.value)}
                          />
                        ) : p.descripcion}
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img 
                            src={p.imagen || "img/bolsa.webp"} 
                            alt="prev" 
                            style={{width:'40px', height:'40px', objectFit:'cover', borderRadius:'4px'}} 
                            onError={(e) => {e.target.src = 'https://via.placeholder.com/40'}}
                          />
                          {isAdmin && (
                            <input 
                              type="file" 
                              className="form-control form-control-sm" 
                              accept="image/*" 
                              onChange={(e) => handleImageUpload(e, false, index)}
                            />
                          )}
                        </div>
                      </td>
                      <td>
                        {isAdmin ? (
                          <input 
                            type="number" 
                            className="form-control form-control-sm" 
                            value={p.stock} 
                            onChange={(e) => handleProductChange(index, 'stock', parseInt(e.target.value) || 0)}
                          />
                        ) : p.stock}
                      </td>
                      <td>
                        {isAdmin ? (
                          <input 
                            type="number" 
                            className="form-control form-control-sm" 
                            value={p.precio} 
                            onChange={(e) => handleProductChange(index, 'precio', parseFloat(e.target.value) || 0)}
                          />
                        ) : `$${p.precio}`}
                      </td>
                      {isAdmin && (
                        <td className="text-end">
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-primary" onClick={() => handleUpdateProduct(p)}>Guardar</button>
                            <button className="btn btn-danger" onClick={() => handleDeleteProduct(p.id)}>Eliminar</button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: Boletas (Orders) */}
        {activeTab === "orders" && (
          <div className="card p-3 mb-4">
            <h3 className="h5 mb-3">Historial de Ventas</h3>
            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Detalles</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center">No hay órdenes registradas.</td>
                    </tr>
                  ) : (
                    orders.map(order => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{new Date(order.fecha).toLocaleString()}</td>
                        <td>
                          {order.usuario ? order.usuario.nombreCompleto : order.nombreCompleto || "Anónimo"}
                          <br/>
                          <small className="text-muted">{order.usuario ? order.usuario.email : ""}</small>
                        </td>
                        <td className="fw-bold text-success">${order.total?.toLocaleString()}</td>
                        <td>
                          <ul className="list-unstyled mb-0 small">
                            {order.detalles && order.detalles.map(d => (
                              <li key={d.id}>
                                {d.cantidad}x {d.producto ? d.producto.nombre : "Producto"} (${d.totalLinea?.toLocaleString()})
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td>
                          <button 
                            className="btn btn-sm text-white" 
                            style={{ backgroundColor: '#2E8B57', borderColor: '#2E8B57' }}
                            onClick={() => handleShowOrderDetails(order)}
                            title="Ver detalles completos"
                          >
                            <i className="fas fa-eye me-1"></i> Ver más
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </section>
    </main>
  );
}

export default Panel;
