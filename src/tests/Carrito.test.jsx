import { render, screen, cleanup, fireEvent, within, waitFor } from '@testing-library/react';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import userEvent from '@testing-library/user-event';
import Carrito from '../../pages/Carrito';

// Mock de SweetAlert2
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  },
}));

// Datos de prueba
const itemsPrueba = [
  { id: 1, nombre: 'Producto 1', descripcion: 'Desc 1', precio: 1000, cantidad: 2, imagen: 'img1.jpg' },
  { id: 2, nombre: 'Producto 2', descripcion: 'Desc 2', precio: 3000, cantidad: 1, imagen: 'img2.jpg' }
];

describe('Componente Carrito', () => {

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(cleanup);

  it('debería mostrar mensaje de carrito vacío', () => {
    render(
      <MemoryRouter>
        <Carrito />
      </MemoryRouter>
    );
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
  });

  it('debería renderizar items del carrito', () => {
    localStorage.setItem('cart.items', JSON.stringify(itemsPrueba));

    render(
      <MemoryRouter>
        <Carrito />
      </MemoryRouter>
    );

    expect(screen.getByText('Producto 1')).toBeInTheDocument();
    expect(screen.getByText('Producto 2')).toBeInTheDocument();
    // Verificar lógica de subtotal en el renderizado
    // 1000 * 2 = 2000
    expect(screen.getByText('$2.000')).toBeInTheDocument();

    // Total: 2000 + 3000 = 5000
    expect(screen.getByText(/Total: \$5.000/)).toBeInTheDocument();
  });

  it('debería actualizar cantidad', async () => {
    const user = userEvent.setup();
    localStorage.setItem('cart.items', JSON.stringify(itemsPrueba));

    render(
      <MemoryRouter>
        <Carrito />
      </MemoryRouter>
    );

    // Hacer clic en el botón + del primer item
    const fila1 = screen.getByText('Producto 1').closest('tr');
    const botonMas = within(fila1).getByRole('button', { name: '+' });

    await user.click(botonMas);

    // Esperar actualización en localstorage
    const carrito = JSON.parse(localStorage.getItem('cart.items'));
    expect(carrito[0].cantidad).toBe(3);

    // Y actualización en la UI
    expect(within(fila1).getByDisplayValue('3')).toBeInTheDocument();
  });

  it('debería eliminar item', async () => {
    const user = userEvent.setup();
    localStorage.setItem('cart.items', JSON.stringify(itemsPrueba));

    render(
      <MemoryRouter>
        <Carrito />
      </MemoryRouter>
    );

    const fila1 = screen.getByText('Producto 1').closest('tr');
    const botonEliminar = within(fila1).getByRole('button', { name: '×' });

    await user.click(botonEliminar);

    expect(screen.queryByText('Producto 1')).not.toBeInTheDocument();
    const carrito = JSON.parse(localStorage.getItem('cart.items'));
    expect(carrito).toHaveLength(1);
  });

  it('debería aplicar cupon descuento', async () => {
    const user = userEvent.setup();
    localStorage.setItem('cart.items', JSON.stringify(itemsPrueba)); // Total 5000

    render(
      <MemoryRouter>
        <Carrito />
      </MemoryRouter>
    );

    const inputCupon = screen.getByPlaceholderText('Ingresa tu código');
    const btnAplicar = screen.getByText('Aplicar');

    await user.type(inputCupon, 'DESCUENTO10');
    await user.click(btnAplicar);

    // 10% de 5000 es 500. Total 4500.
    expect(screen.getByText('Descuento aplicado: -$500')).toBeInTheDocument();
    expect(screen.getByText(/Total: \$4.500/)).toBeInTheDocument();
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ title: 'Cupón aplicado' }));
  });
});