import { render, screen, cleanup, within } from '@testing-library/react';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import userEvent from '@testing-library/user-event'; 

// --- 1. Mocks de Módulos Externos ---
vi.mock('../css/styles.css', () => ({ default: {} }));
vi.mock('../css/visual.css', () => ({ default: {} }));

// Mockeamos el módulo de lógica 'productos.js'
vi.mock('../../js/productos', () => ({
  getCatalogo: vi.fn(),
  agregarAlCarrito: vi.fn(),
  CATEGORIES: { 
    VERDURAS: { label: 'Verduras', description: 'Descripción de Verduras' },
    FRUTAS: { label: 'Frutas', description: 'Descripción de Frutas' }
  }
}));

// --- 2. Importación del Componente y Mocks ---
import Productos from '../../pages/Productos';
import { getCatalogo, agregarAlCarrito, CATEGORIES } from '../../js/productos';

// --- 3. Datos de Prueba ---
const mockCatalogoData = [
  { id: 1, nombre: 'Tomate', precio: 1500, categoria: 'VERDURAS', imagen: 'img1.jpg', descripcion: 'Un tomate rojo y jugoso.' },
  { id: 2, nombre: 'Manzana', precio: 1200, categoria: 'FRUTAS', imagen: 'img2.jpg', descripcion: 'Una manzana verde y crujiente.' },
  { id: 3, nombre: 'Lechuga', precio: 800, categoria: 'VERDURAS', imagen: 'img3.jpg', descripcion: 'Una lechuga fresca.' }
];

// --- 4. Configuración de Pruebas ---
afterEach(cleanup);
beforeEach(() => {
  vi.resetAllMocks(); 
  vi.mocked(getCatalogo).mockReturnValue(mockCatalogoData);
});

// --- 5. Las Pruebas ---
describe('Componente Productos', () => {

  // Test TC-033: Verificación de renderizado inicial
  it('debería renderizar, llamar a getCatalogo y mostrar todos los productos por defecto', () => {
    render(<Productos />);
    expect(getCatalogo).toHaveBeenCalledOnce();
    expect(screen.getByText('Tomate')).toBeInTheDocument();
    expect(screen.getByText('Manzana')).toBeInTheDocument();
    expect(screen.getByText('Lechuga')).toBeInTheDocument();
    expect(screen.getByText(/Explora todo nuestro catálogo/i)).toBeInTheDocument();
  });

  // Test TC-034: Verificación de filtrado por categoría y actualización de descripción
  it('debería filtrar productos y actualizar la descripción al cambiar el select (Gestión de Estado)', async () => {
    const user = userEvent.setup(); 
    render(<Productos />);

    // 1. Estado inicial
    expect(screen.getByText('Manzana')).toBeInTheDocument();

    // 2. Acción: Seleccionar "Verduras"
    const select = screen.getByLabelText('Categoría'); // Esto ya funciona
    await user.selectOptions(select, 'VERDURAS');

    // 3. Assertions (Renderizado de Lista)
    expect(screen.getByText('Tomate')).toBeInTheDocument();
    expect(screen.getByText('Lechuga')).toBeInTheDocument();
    expect(screen.queryByText('Manzana')).not.toBeInTheDocument(); 

    // --- INICIO DE LA CORRECCIÓN ---
    // 4. Assertions (Cuadro de descripción)
    
    // No podemos usar getByText('Verduras') porque está duplicado.
    // En su lugar, buscamos el texto de la descripción (que es único).
    const descripcion = screen.getByText(CATEGORIES.VERDURAS.description);
    
    // Ahora, buscamos el contenedor padre de esa descripción
    const descripcionContainer = descripcion.parentElement;

    // Y verificamos que, DENTRO de ese contenedor, está el título <strong>
    expect(within(descripcionContainer).getByText(CATEGORIES.VERDURAS.label)).toBeInTheDocument();
    // --- FIN DE LA CORRECCIÓN ---
    
    expect(screen.queryByText(/Explora todo nuestro catálogo/i)).not.toBeInTheDocument();
  });

  // Test TC-035: Verificación de evento de agregar al carrito y Toast
  it('debería llamar a agregarAlCarrito y mostrar un Toast al hacer clic (Prueba de Eventos)', async () => {
    const user = userEvent.setup(); 
    vi.mocked(agregarAlCarrito).mockReturnValue('Tomate');
    
    render(<Productos />);

    const cardTomate = screen.getByText('Tomate').closest('.card');
    const botonAgregar = within(cardTomate).getByRole('button', { name: /Agregar al carrito/i });
    
    await user.click(botonAgregar);

    expect(agregarAlCarrito).toHaveBeenCalledOnce();
    expect(agregarAlCarrito).toHaveBeenCalledWith(1); 

    const toast = await screen.findByRole('alert');
    expect(toast).toBeInTheDocument();
    expect(within(toast).getByText('Tomate agregado al carrito')).toBeInTheDocument();
  });

});