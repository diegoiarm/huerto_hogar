import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import userEvent from '@testing-library/user-event'; // Para simular clics y selecciones

// --- 1. Mocks de Módulos Externos ---

// Mock de las importaciones de CSS
// Rutas relativas desde ESTE ARCHIVO DE PRUEBA (src/tests/)
vi.mock('../css/styles.css', () => ({ default: {} }));
vi.mock('../css/visual.css', () => ({ default: {} }));

// Mockeamos el módulo de lógica 'productos.js'
// Ruta relativa desde ESTE ARCHIVO DE PRUEBA (src/tests/)
vi.mock('../../js/productos.js', () => ({
  getCatalogo: vi.fn(),
  agregarAlCarrito: vi.fn(),
  CATEGORIES: {
    VERDURAS: { label: 'Verduras', description: 'Desc. Verduras' },
    FRUTAS: { label: 'Frutas', description: 'Desc. Frutas' }
  }
}));

// --- 2. Importación del Componente y Mocks ---
// Importamos el componente DESPUÉS de los mocks
import Productos from '../../pages/Productos';
// Importamos los mocks para poder espiarlos
import { getCatalogo, agregarAlCarrito } from '../../js/productos.js';

// --- 3. Datos de Prueba ---
const mockCatalogoData = [
  { id: 1, nombre: 'Tomate', precio: 1500, categoria: 'VERDURAS', imagen: 'img1.jpg' },
  { id: 2, nombre: 'Manzana', precio: 1200, categoria: 'FRUTAS', imagen: 'img2.jpg' },
  { id: 3, nombre: 'Lechuga', precio: 800, categoria: 'VERDURAS', imagen: 'img3.jpg' }
];

// --- 4. Configuración de Pruebas ---
afterEach(cleanup);
beforeEach(() => {
  vi.resetAllMocks(); // Limpia los contadores de llamadas
  
  // Configuración default: getCatalogo devuelve nuestra lista
  vi.mocked(getCatalogo).mockReturnValue(mockCatalogoData);
});

// --- 5. Las Pruebas ---

describe('Componente Productos', () => {

  it('debería renderizar, llamar a getCatalogo y mostrar todos los productos por defecto', () => {
    render(<Productos />);

    // 1. Verifica que getCatalogo fue llamado al cargar (por el useEffect)
    expect(getCatalogo).toHaveBeenCalledOnce();

    // 2. Verifica los productos
    expect(screen.getByText('Tomate')).toBeInTheDocument();
    expect(screen.getByText('Manzana')).toBeInTheDocument();
    expect(screen.getByText('Lechuga')).toBeInTheDocument();

    // 3. Verifica el estado por defecto (Renderizado Condicional)
    expect(screen.getByText(/Explora todo nuestro catálogo/i)).toBeInTheDocument();
  });

  it('debería filtrar productos y actualizar la descripción al cambiar el select (Gestión de Estado)', async () => {
    const user = userEvent.setup(); // Configura user-event
    render(<Productos />);

    // 1. Estado inicial (todos los productos)
    expect(screen.getByText('Tomate')).toBeInTheDocument();
    expect(screen.getByText('Manzana')).toBeInTheDocument();
    expect(screen.getByText('Lechuga')).toBeInTheDocument();

    // 2. Acción: El usuario selecciona "Verduras" en el dropdown
    const select = screen.getByLabelText('Categoría');
    await user.selectOptions(select, 'VERDURAS');

    // 3. Assertions (Verificaciones post-cambio)
    
    // El estado del filtro se aplicó (Renderizado de Lista)
    expect(screen.getByText('Tomate')).toBeInTheDocument();
    expect(screen.getByText('Lechuga')).toBeInTheDocument();
    expect(screen.queryByText('Manzana')).not.toBeInTheDocument(); // Manzana (FRUTA) no debe estar

    // El cuadro de descripción cambió (Renderizado Condicional)
    expect(screen.getByText('Verduras')).toBeInTheDocument(); // El <strong>
    expect(screen.getByText('Desc. Verduras')).toBeInTheDocument(); // La descripción
    expect(screen.queryByText(/Explora todo nuestro catálogo/i)).not.toBeInTheDocument();
  });

  it('debería llamar a agregarAlCarrito y mostrar un Toast al hacer clic (Prueba de Eventos)', async () => {
    const user = userEvent.setup(); // Configura user-event
    
    // 1. Setup: Simulamos que agregarAlCarrito(1) devuelve "Tomate"
    vi.mocked(agregarAlCarrito).mockReturnValue('Tomate');
    
    render(<Productos />);

    // 2. Acción: Buscamos el botón "Agregar al carrito" DENTRO del card "Tomate"
    const cardTomate = screen.getByText('Tomate').closest('.card');
    const botonAgregar = within(cardTomate).getByRole('button', { name: /Agregar al carrito/i });
    
    await user.click(botonAgregar);

    // 3. Assertions
    
    // Verifica que la función externa fue llamada correctamente
    expect(agregarAlCarrito).toHaveBeenCalledOnce();
    expect(agregarAlCarrito).toHaveBeenCalledWith(1); // El ID del Tomate

    // Verifica que el Toast (notificación) apareció
    // Los Toasts de Bootstrap tienen el rol "alert" para accesibilidad
    const toast = await screen.findByRole('alert');
    expect(toast).toBeInTheDocument();
    
    // Verifica que el mensaje en el Toast es el correcto
    // (Esta es la línea que faltaba en tu archivo)
    expect(within(toast).getByText('Tomate agregado al carrito')).toBeInTheDocument();
  }); // <-- Faltaba este cierre

});