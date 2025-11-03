import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom'; // Necesario para <Link>
import Swal from 'sweetalert2'; // Importamos para acceder al mock

// --- 1. Mocks de Módulos Externos ---

// Mockeamos SweetAlert2 para que no muestre pop-ups
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(), // Es un "espía" que no hace nada
  },
}));

// Mockeamos el módulo de lógica del carrito
// Esto es lo MÁS IMPORTANTE
// Importamos los nombres para que Vitest sepa qué mockear
import { 
  getCarrito, 
  guardarCarrito, 
  actualizarCantidad as actualizarCantidadCarrito,
  eliminarItem as eliminarItemCarrito,
  vaciarCarrito as vaciarCarritoCompleto,
  calcularSubtotal,
  calcularTotal,
  aplicarDescuento
} from '../../js/carrito';

vi.mock('../../js/carrito', () => ({
  getCarrito: vi.fn(),
  guardarCarrito: vi.fn(),
  // Renombramos los mocks para que coincidan con la importación original
  actualizarCantidad: vi.fn(), 
  eliminarItem: vi.fn(),
  vaciarCarrito: vi.fn(),
  calcularSubtotal: vi.fn((precio, qty) => precio * qty), // Replicamos la lógica simple
  calcularTotal: vi.fn(),
  aplicarDescuento: vi.fn(),
}));

// --- 2. Importación del Componente ---
// (Ajusta la ruta si es necesario)
import Carrito from '../../pages/Carrito';

// --- 3. Datos de Prueba ---
const mockCarritoItems = [
  { id: 1, nombre: 'Producto 1', descripcion: 'Desc 1', precio: 1000, cantidad: 2, imagen: 'img1.jpg' },
  { id: 2, nombre: 'Producto 2', descripcion: 'Desc 2', precio: 3000, cantidad: 1, imagen: 'img2.jpg' }
];
// Subtotal Prod 1: 2000
// Subtotal Prod 2: 3000
// Total: 5000

// Wrapper para renderizar con el Router (Esta es la parte que te faltaba)
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
  vi.resetAllMocks(); // Resetea todos los mocks antes de cada test

  // Configuramos los mocks default para la mayoría de las pruebas
  // Usamos 'vi.mocked' para decirle a TypeScript que SÍ son mocks
  // (Debemos usar los nombres importados originales, no los renombrados)
  vi.mocked(getCarrito).mockReturnValue(mockCarritoItems);
  vi.mocked(calcularTotal).mockReturnValue(5000);
});

// --- 5. Las Pruebas ---

describe('Componente Carrito', () => {

  it('debería mostrar "Tu carrito está vacío" si getCarrito devuelve un array vacío', () => {
    // Sobrescribimos el mock 'beforeEach'
    vi.mocked(getCarrito).mockReturnValue([]);
    vi.mocked(calcularTotal).mockReturnValue(0);

    renderCarrito();

    expect(getCarrito).toHaveBeenCalledOnce();
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('debería cargar y mostrar items de getCarrito y el total correcto al renderizar', () => {
    renderCarrito();

    // Verifica que las funciones mockeadas fueron llamadas
    expect(getCarrito).toHaveBeenCalledOnce();
    expect(calcularTotal).toHaveBeenCalledWith(mockCarritoItems);

    // Verifica que los items se renderizaron
    expect(screen.getByText('Producto 1')).toBeInTheDocument();
    expect(screen.getByText('Producto 2')).toBeInTheDocument();

    // Verifica subtotales (usando el mock de calcularSubtotal)
    expect(screen.getByText('$2000')).toBeInTheDocument(); // 1000 * 2
    expect(screen.getByText('$3000')).toBeInTheDocument(); // 3000 * 1

    // Verifica el total
    expect(screen.getByText(/Total: \$5000/i)).toBeInTheDocument();
  });

  it('debería llamar a actualizarCantidad y recalcular total al cambiar input', () => {
    // 1. Setup de mocks para este test específico
    const nuevoCarrito = [{ ...mockCarritoItems[0], cantidad: 3 }, mockCarritoItems[1]];
    vi.mocked(actualizarCantidadCarrito).mockReturnValue(nuevoCarrito); // Usa el nombre importado
    vi.mocked(calcularTotal).mockReturnValue(6000); // 3*1000 + 1*3000 = 6000

    // 2. Render
    renderCarrito();

    // 3. Acción
    const inputProducto1 = screen.getAllByRole('spinbutton')[0];
    fireEvent.change(inputProducto1, { target: { value: '3' } });

    // 4. Assertions
    expect(actualizarCantidadCarrito).toHaveBeenCalledOnce();
    expect(actualizarCantidadCarrito).toHaveBeenCalledWith(mockCarritoItems, 0, 3);
    
    expect(calcularTotal).toHaveBeenCalledWith(nuevoCarrito);
    expect(screen.getByText(/Total: \$6000/i)).toBeInTheDocument(); // Verifica que el estado se actualizó
  });

  it('debería llamar a eliminarItem y recalcular total al hacer clic en "×"', () => {
    // 1. Setup
    const nuevoCarrito = [mockCarritoItems[1]]; // Solo queda el Producto 2
    vi.mocked(eliminarItemCarrito).mockReturnValue(nuevoCarrito); // Usa el nombre importado
    vi.mocked(calcularTotal).mockReturnValue(3000); // Total es solo el Producto 2

    // 2. Render
    renderCarrito();

    // 3. Acción
    const botonEliminarProd1 = screen.getAllByRole('button', { name: '×' })[0];
    fireEvent.click(botonEliminarProd1);

    // 4. Assertions
    expect(eliminarItemCarrito).toHaveBeenCalledOnce();
    expect(eliminarItemCarrito).toHaveBeenCalledWith(mockCarritoItems, 0);
    
    expect(calcularTotal).toHaveBeenCalledWith(nuevoCarrito);
    expect(screen.queryByText('Producto 1')).not.toBeInTheDocument(); // UI actualizada
    expect(screen.getByText('Producto 2')).toBeInTheDocument();
    expect(screen.getByText(/Total: \$3000/i)).toBeInTheDocument();
  });

  it('debería llamar a vaciarCarrito y mostrar carrito vacío', () => {
    // 1. Setup
    vi.mocked(vaciarCarritoCompleto).mockReturnValue([]); // Usa el nombre importado
    // getCarrito() ya devuelve items (en beforeEach)
    
    // 2. Render
    renderCarrito();
    expect(screen.getByText('Producto 1')).toBeInTheDocument(); // Verifica estado inicial

    // 3. Acción
    const botonVaciar = screen.getByRole('button', { name: /Vaciar carrito/i });
    fireEvent.click(botonVaciar);

    // 4. Assertions
    expect(vaciarCarritoCompleto).toHaveBeenCalledOnce();
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument(); // UI actualizada
    expect(screen.queryByText('Producto 1')).not.toBeInTheDocument();
    expect(screen.getByText(/Total: \$0/i)).toBeInTheDocument(); // Total se reseteó a 0
  });

  it('debería llamar a aplicarDescuento y mostrar error de Swal si es inválido', () => {
    // 1. Setup
    // Simulamos que el cupón es inválido (devuelve el total original)
    vi.mocked(aplicarDescuento).mockReturnValue({ total: 5000, descuento: 0 });

    // 2. Render
    renderCarrito();

    // 3. Acción
    const cuponInput = screen.getByPlaceholderText(/Ingresa tu código/i);
    const aplicarBtn = screen.getByRole('button', { name: /Aplicar/i });
    fireEvent.change(cuponInput, { target: { value: 'CUPON_FALSO' } });
    fireEvent.click(aplicarBtn);

    // 4. Assertions
    expect(aplicarDescuento).toHaveBeenCalledWith(5000, 'CUPON_FALSO');
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
      icon: 'error',
      title: 'Cupón inválido',
    }));
    // El total no debe cambiar
    expect(screen.getByText(/Total: \$5000/i)).toBeInTheDocument();
    // El descuento no debe aparecer
    expect(screen.queryByText(/Descuento aplicado:/i)).not.toBeInTheDocument();
  });

  it('debería aplicar descuento y mostrar nuevo total si el cupón es válido', () => {
    // 1. Setup
    // Simulamos que el cupón es VÁLIDO
    vi.mocked(aplicarDescuento).mockReturnValue({ total: 4500, descuento: 500 });

    // 2. Render
    renderCarrito();

    // 3. Acción
    const cuponInput = screen.getByPlaceholderText(/Ingresa tu código/i);
    const aplicarBtn = screen.getByRole('button', { name: /Aplicar/i });
    fireEvent.change(cuponInput, { target: { value: 'VALIDO10' } });
    fireEvent.click(aplicarBtn);

    // 4. Assertions
    expect(aplicarDescuento).toHaveBeenCalledWith(5000, 'VALIDO10');
    expect(Swal.fire).not.toHaveBeenCalled(); // No debe haber alerta de error
    
    // Verifica que el estado de descuento y total se actualizó
    expect(screen.getByText(/Total: \$4500/i)).toBeInTheDocument();
    expect(screen.getByText(/Descuento aplicado: -\$500/i)).toBeInTheDocument();
    // Verifica que muestra el precio original tachado
    expect(screen.getByText(/\$5000/i)).toBeInTheDocument();
  });

});