import { render, screen, cleanup, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import userEvent from '@testing-library/user-event';

// --- 1. Mocks de Módulos Externos ---

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  },
}));

// Mockeamos el módulo de lógica 'carrito.js'
vi.mock('../../js/carrito', () => ({
  getCarrito: vi.fn(),
  guardarCarrito: vi.fn(),
  actualizarCantidad: vi.fn(),
  eliminarItem: vi.fn(),
  vaciarCarrito: vi.fn(),
  // Replicamos la lógica real (con .toFixed) para que coincida
  calcularSubtotal: vi.fn((precio, qty) => (precio * qty).toFixed(0)), 
  calcularTotal: vi.fn(),
  aplicarDescuento: vi.fn(),
}));

// --- 2. Importación del Componente y Mocks ---
import Carrito from '../../pages/Carrito';
import { 
  getCarrito, 
  actualizarCantidad,
  eliminarItem,
  vaciarCarrito,
  calcularSubtotal,
  calcularTotal,
  aplicarDescuento
} from '../../js/carrito';

// --- 3. Datos de Prueba ---
const mockCarritoItems = [
  { id: 1, nombre: 'Producto 1', descripcion: 'Desc 1', precio: 1000, cantidad: 2, imagen: 'img1.jpg' },
  { id: 2, nombre: 'Producto 2', descripcion: 'Desc 2', precio: 3000, cantidad: 1, imagen: 'img2.jpg' }
];
const mockTotal = 5000;

// Wrapper
const renderCarrito = () => {
  return render(
    <MemoryRouter>
      <Carrito />
    </MemoryRouter>
  );
};

// --- 4. Configuración de Pruebas ---
afterEach(cleanup);
beforeEach(() => {
  vi.resetAllMocks(); 
  
  vi.mocked(getCarrito).mockReturnValue(mockCarritoItems);
  vi.mocked(calcularTotal).mockReturnValue(mockTotal);
  
  vi.spyOn(Storage.prototype, 'setItem');
  vi.spyOn(Storage.prototype, 'removeItem');
  localStorage.clear();
});

// --- 5. Las Pruebas ---

describe('Componente Carrito', () => {

  // Test TC-004: Verificar comportamiento con carrito vacío
  it('debería mostrar "Tu carrito está vacío" si getCarrito devuelve un array vacío', () => {
    vi.mocked(getCarrito).mockReturnValue([]);
    vi.mocked(calcularTotal).mockReturnValue(0);

    renderCarrito();

    expect(getCarrito).toHaveBeenCalledOnce();
    expect(calcularTotal).toHaveBeenCalledWith([]);
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  // Test TC-005: Verificar renderizado correcto de items, subtotales y total
  it('debería cargar y mostrar items, subtotales y total al renderizar', () => {
    renderCarrito();
    expect(getCarrito).toHaveBeenCalledOnce();
    expect(calcularTotal).toHaveBeenCalledWith(mockCarritoItems);
    expect(screen.getByText('Producto 1')).toBeInTheDocument();
    expect(screen.getByText('Producto 2')).toBeInTheDocument();

    // Fila del Producto 1:
    const filaProd1 = screen.getByText('Producto 1').closest('tr');
    // Buscamos por columnas (<td>)
    const celdasProd1 = within(filaProd1).getAllByRole('cell');
    expect(celdasProd1[2]).toHaveTextContent('$1000'); // Columna Precio
    expect(celdasProd1[3]).toHaveTextContent('$2000'); // Columna Subtotal (1000 * 2)
    
    // Fila del Producto 2:
    const filaProd2 = screen.getByText('Producto 2').closest('tr');
    const celdasProd2 = within(filaProd2).getAllByRole('cell');
    expect(celdasProd2[2]).toHaveTextContent('$3000'); // Columna Precio
    expect(celdasProd2[3]).toHaveTextContent('$3000'); // Columna Subtotal (3000 * 1)
    
    // Verifica el total
    expect(screen.getByText(`Total: $${mockTotal.toFixed(0)}`)).toBeInTheDocument();
  });

  // Test TC-006: Verificar actualización de cantidad y recálculo del total
  it('debería llamar a actualizarCantidad y recalcular total al cambiar input', async () => {
    const nuevoCarrito = [{ ...mockCarritoItems[0], cantidad: 3 }, mockCarritoItems[1]];
    vi.mocked(actualizarCantidad).mockReturnValue(nuevoCarrito);
    vi.mocked(calcularTotal).mockReturnValue(6000); 

    renderCarrito();
    const inputProducto1 = screen.getAllByRole('spinbutton')[0];

    // --- CORRECCIÓN 2 (Usar fireEvent.change) ---
    // Usamos fireEvent.change para disparar UN SOLO evento onChange
    fireEvent.change(inputProducto1, { target: { value: '3' } });

    // Assertions
    expect(actualizarCantidad).toHaveBeenCalledOnce(); // Ahora sí se llama 1 vez
    expect(actualizarCantidad).toHaveBeenCalledWith(mockCarritoItems, 0, 3);
    expect(calcularTotal).toHaveBeenCalledWith(nuevoCarrito);
    expect(screen.getByText(/Total: \$6000/i)).toBeInTheDocument();
  });

  // Test TC-007: Verificar eliminación de item y recálculo del total
  it('debería llamar a eliminarItem y recalcular total al hacer clic en "×"', async () => {
    const user = userEvent.setup();
    const nuevoCarrito = [mockCarritoItems[1]]; 
    vi.mocked(eliminarItem).mockReturnValue(nuevoCarrito);
    vi.mocked(calcularTotal).mockReturnValue(3000); 

    renderCarrito();
    const botonEliminarProd1 = screen.getAllByRole('button', { name: '×' })[0];
    await user.click(botonEliminarProd1);

    expect(eliminarItem).toHaveBeenCalledOnce();
    expect(eliminarItem).toHaveBeenCalledWith(mockCarritoItems, 0);
    expect(calcularTotal).toHaveBeenCalledWith(nuevoCarrito);
    expect(screen.queryByText('Producto 1')).not.toBeInTheDocument();
    expect(screen.getByText('Producto 2')).toBeInTheDocument();
    expect(screen.getByText(/Total: \$3000/i)).toBeInTheDocument();
  });

  // Test TC-008: Verificar vaciado del carrito, UI y localStorage
  it('debería llamar a vaciarCarrito, mostrar UI vacía y limpiar localStorage', async () => {
    const user = userEvent.setup();
    vi.mocked(vaciarCarrito).mockReturnValue([]);
    
    renderCarrito();
    expect(screen.getByText('Producto 1')).toBeInTheDocument(); 

    const botonVaciar = screen.getByRole('button', { name: /Vaciar carrito/i });
    await user.click(botonVaciar);

    expect(vaciarCarrito).toHaveBeenCalledOnce();
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
    expect(screen.queryByText('Producto 1')).not.toBeInTheDocument();
    
    // --- CORRECCIÓN 3 (Verificar que el total desaparece) ---
    expect(screen.queryByText(/Total:/i)).not.toBeInTheDocument();
    
    expect(localStorage.removeItem).toHaveBeenCalledWith('cuponAplicado');
  });

  // Test TC-009: Verificar aplicación de cupón (vacío, inválido y válido)
  it('debería mostrar alerta Swal si el cupón está vacío', async () => {
    const user = userEvent.setup();
    renderCarrito();
    const aplicarBtn = screen.getByRole('button', { name: /Aplicar/i });
    
    await user.click(aplicarBtn); 

    expect(aplicarDescuento).not.toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
      icon: 'warning',
      title: 'Falta código',
    }));
  });

  // Test TC-010: Verificar aplicación de cupón inválido (sin descuento)
  it('debería mostrar alerta Swal si el cupón es inválido (devuelve mismo total)', async () => {
    const user = userEvent.setup();
    // Simulamos que el cupón es inválido (devuelve el total original)
    vi.mocked(aplicarDescuento).mockReturnValue(mockTotal); 

    renderCarrito();
    const cuponInput = screen.getByPlaceholderText(/Ingresa tu código/i);
    const aplicarBtn = screen.getByRole('button', { name: /Aplicar/i });
    await user.type(cuponInput, 'INVALIDO');
    await user.click(aplicarBtn);

    expect(aplicarDescuento).toHaveBeenCalledWith(mockTotal, 'INVALIDO');
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
      icon: 'error',
      title: 'Cupón inválido',
    }));
    expect(localStorage.setItem).not.toHaveBeenCalledWith('cuponAplicado', 'INVALIDO');
  });

  // Test TC-011: Verificar aplicación de cupón válido (con descuento)
  it('debería aplicar descuento, guardar en localStorage y mostrar Swal success (devuelve objeto)', async () => {
    const user = userEvent.setup();
    const resultado = { total: 4500, descuento: 500 };
    vi.mocked(aplicarDescuento).mockReturnValue(resultado);

    renderCarrito();
    const cuponInput = screen.getByPlaceholderText(/Ingresa tu código/i);
    const aplicarBtn = screen.getByRole('button', { name: /Aplicar/i });
    await user.type(cuponInput, 'VALIDO10');
    await user.click(aplicarBtn);

    expect(aplicarDescuento).toHaveBeenCalledWith(mockTotal, 'VALIDO10');
    
    // Verifica estado
    expect(screen.getByText(/Total: \$4500/i)).toBeInTheDocument();
    expect(screen.getByText(/Descuento aplicado: -\$500/i)).toBeInTheDocument();
    expect(screen.getByText(`$${(resultado.total + resultado.descuento).toFixed(0)}`)).toBeInTheDocument(); // Total tachado

    // Verifica localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith('cuponAplicado', 'VALIDO10');

    // Verifica Swal success
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
      icon: 'success',
      title: 'Cupón aplicado',
    }));
  });

});