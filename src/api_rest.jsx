import axios from "axios";

const API_URL = "http://localhost:8010/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token a las peticiones protegidas
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Auth ---
export const register = (userData) => {
  return api.post("/v1/auth/register", userData);
};

export const login = (credentials) => {
  return api.post("/v1/auth/authenticate", credentials);
};

// --- Usuarios ---
export const getProfile = () => {
  return api.get("/usuarios/me");
};

// Admin: Gestión de Usuarios
export const getAllUsers = () => {
  return api.get("/usuarios/all");
};

export const createUser = (userData) => {
  return api.post("/usuarios/save", userData);
};

export const deleteUser = (id) => {
  return api.delete(`/usuarios/delete/${id}`);
};

export const updateUser = (id, userData) => {
  return api.put(`/usuarios/update/${id}`, userData);
};

// --- Productos ---
export const getProducts = () => {
  return api.get("/productos");
};

export const getProductById = (id) => {
  return api.get(`/productos/${id}`);
};

// Admin: Gestión de Productos
export const createProduct = (productData) => {
  return api.post("/productos", productData);
};

export const updateProduct = (id, productData) => {
  return api.put(`/productos/${id}`, productData);
};

export const deleteProduct = (id) => {
  return api.delete(`/productos/${id}`);
};

// --- Categorías ---
export const getCategories = () => {
  return api.get("/categorias");
};

export const getCategoryById = (id) => {
  return api.get(`/categorias/${id}`);
};

// Admin: Gestión de Categorías
export const createCategory = (categoryData) => {
  return api.post("/categorias", categoryData);
};

export const updateCategory = (id, categoryData) => {
  return api.put(`/categorias/${id}`, categoryData);
};

export const deleteCategory = (id) => {
  return api.delete(`/categorias/${id}`);
};

// --- Boletas (Carrito/Compras) ---
export const createOrder = (orderData) => {
  return api.post("/boletas", orderData);
};

export const getOrders = () => {
  return api.get("/boletas");
};

export default api;
