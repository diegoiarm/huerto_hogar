import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom'; // Importante para <Link>

// --- 1. Mocks ---

// Mock de las importaciones de CSS
vi.mock('../src/css/styles.css', () => ({ default: {} }));
vi.mock('../src/css/visual.css', () => ({ default: {} }));

// Creamos "espías" (mocks) para las funciones que importamos
const mockGetSession = vi.fn();
const mockClearSession = vi.fn();

// Mock del módulo 'login.js'
vi.mock('../js/login.js', () => ({
  getSession: mockGetSession,
  clearSession: mockClearSession,
}));

// --- 2. Importación del Componente ---
// (Ajusta la ruta si es necesario)
import NavBar from '../../pages/NavBar';

// --- 3. Configuración Global de Pruebas ---
afterEach(() => {
  cleanup(); // Limpia el JSDOM
  vi.restoreAllMocks(); // Restaura todos los mocks
});

beforeEach(() => {
  // Mockeamos 'window.location.reload' porque no existe en JSDOM
  // y no queremos que la prueba intente recargar
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { ...window.location, reload: vi.fn() },
  });
});

// --- 4. Las Pruebas ---

/**
 * PRUEBA DE RENDERIZADO CONDICIONAL (ESCENARIO 1)
 */
describe('Componente NavBar (Usuario Desconectado)', () => {

  beforeEach(() => {
    // Para este bloque de pruebas, simulamos que getSession() devuelve null
    mockGetSession.mockReturnValue(null);
  });

  it('debería mostrar los enlaces "Login" y "Registrarse" si no hay sesión', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

    // Verificamos que los links públicos estén
    expect(screen.getByRole('link', { name: /Inicio/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Productos/i })).toBeInTheDocument();
    
    // Verificamos que los links de "Login" y "Registrarse" SÍ están
    expect(screen.getByRole('link', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Registrarse/i })).toBeInTheDocument();
  });

  it('NO debería mostrar el email del usuario ni el botón "Cerrar sesión"', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

    // Verificamos que los elementos de sesión NO están
    expect(screen.queryByRole('button', { name: /Cerrar sesión/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/@/i)).not.toBeInTheDocument(); // Buscamos por la @ del email
  });
});


/**
 * PRUEBA DE RENDERIZADO CONDICIONAL (ESCENARIO 2)
 * PRUEBA DE ESTADO, PROPS Y EVENTOS
 */
describe('Componente NavBar (Usuario Conectado)', () => {

  // Simulamos un objeto de sesión
  const mockSessionData = {
    email: 'test@huerto.com',
    role: 'cliente',
  };

  beforeEach(() => {
    // Para este bloque, simulamos que getSession() devuelve datos
    mockGetSession.mockReturnValue(mockSessionData);
  });

  it('NO debería mostrar los enlaces "Login" y "Registrarse"', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );
    
    // Verificamos que los links de "Login" y "Registrarse" NO están
    expect(screen.queryByRole('link', { name: /Login/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Registrarse/i })).not.toBeInTheDocument();
  });

  it('debería mostrar el email del usuario y el botón "Cerrar sesión"', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

    // Verificamos que SÍ están los elementos de sesión
    expect(screen.getByRole('button', { name: /Cerrar sesión/i })).toBeInTheDocument();
    
    // Verificamos que el email y rol se muestran
    expect(screen.getByText('test@huerto.com (cliente)')).toBeInTheDocument();
  });

  it('debería llamar a clearSession() y window.location.reload() al hacer clic en "Cerrar sesión"', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

    // 1. Buscamos el botón
    const logoutButton = screen.getByRole('button', { name: /Cerrar sesión/i });

    // 2. Simulamos el evento de clic
    fireEvent.click(logoutButton);

    // 3. Verificamos que las funciones (que mockeamos) fueron llamadas
    expect(mockClearSession).toHaveBeenCalledOnce();
    expect(window.location.reload).toHaveBeenCalledOnce();
  });
});