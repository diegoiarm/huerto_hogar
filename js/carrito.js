// --- Constantes para localStorage ---
const LS_CART = "cart.items"; // Mismo valor que en productos.js
const LS_CUPONES = "cupones";

// --- Importaciones ---
import { getCatalogo } from './productos';

// --- Tipos de Datos ---
/**
 * @typedef {Object} ProductoCarrito
 * @property {string} id - ID único del producto
 * @property {string} nombre - Nombre del producto
 * @property {number} precio - Precio unitario
 * @property {string} imagen - URL de la imagen
 * @property {string} descripcion - Descripción del producto
 * @property {number} cantidad - Cantidad en el carrito
 * @property {string} categoria - Categoría del producto
 */

// Función para obtener un producto del catálogo por su ID

export const getCarrito = () => {
    try {
        return JSON.parse(localStorage.getItem(LS_CART)) || [];
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        return [];
    }
};

// Función para guardar el carrito en localStorage

export const guardarCarrito = (carrito) => {
    try {
        localStorage.setItem(LS_CART, JSON.stringify(carrito));
    } catch (error) {
        console.error('Error al guardar el carrito:', error);
    }
};

// Función para actualizar el carrito al agregar un producto

export const actualizarCantidad = (carrito, index, nuevaCantidad) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito[index].cantidad = Math.max(1, nuevaCantidad);
    guardarCarrito(nuevoCarrito);
    return nuevoCarrito;
};

// Función para eliminar un ítem del carrito

export const eliminarItem = (carrito, index) => {
    const nuevoCarrito = carrito.filter((_, i) => i !== index);
    guardarCarrito(nuevoCarrito);
    return nuevoCarrito;
};

// Función para vaciar el carrito

export const vaciarCarrito = () => {
    localStorage.removeItem(LS_CART);
    return [];
};

// Función para calcular el subtotal de un ítem

export const calcularSubtotal = (precio, cantidad) => {
    return (precio * cantidad).toFixed(0);
};

// Función para calcular el total del carrito

export const calcularTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
};

// =================== Gestión de Cupones ===================

// Definición de cupones disponibles

const CUPONES = {
    'BIENVENIDA10': { descuento: 0.10, descripcion: 'Descuento de bienvenida 10%' },
    'HUERTO20': { descuento: 0.20, descripcion: 'Descuento especial 20%' }
};

// Función para validar un cupón

export const validarCupon = (codigo) => {
    return CUPONES[codigo.toUpperCase()] || null;
};

// Función para aplicar un cupón al total del carrito

export const aplicarDescuento = (total, codigoCupon) => {
    const cupon = validarCupon(codigoCupon);
    if (!cupon) return total;
    
    const descuento = total * cupon.descuento;
    return {
        subtotal: total,
        descuento: descuento,
        total: total - descuento
    };
};