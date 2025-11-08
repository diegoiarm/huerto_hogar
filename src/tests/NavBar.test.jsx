import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom'; // Necesario para <Link>
import userEvent from '@testing-library/user-event';

// --- 1. Mocks de CSS (Se elevan/hoisted) ---
vi.mock('../src/css/styles.css', () => ({ default: {} }));
vi.mock('../src/css/visual.css', () => ({ default: {} }));

// --- 2. Mock del módulo 'login.js' ---
// Mockeamos el módulo ANTES de importarlo.
// (¡Ruta corregida a ../../ para subir desde src/tests/ a la raíz!)
vi.mock('../../js/login.js', () => ({
  getSession: vi.fn(),
  clearSession: vi.fn(),
}));

// --- 3. Importación del Componente y Mocks ---
import NavBar from '../../pages/NavBar';
// Importamos los mocks para poder controlarlos
import { getSession, clearSession } from '../../js/login.js';

// --- 4. Wrapper de Renderizado ---
// OBLIGATORIO porque el componente usa <Link> de react-router-dom
const renderNavBar = () => {
  render(
    <MemoryRouter>
      <NavBar />
    </MemoryRouter>
  );
};

// --- 5. Configuración ---
afterEach(() => {
  cleanup(); // Limpia el JSDOM
  vi.restoreAllMocks(); // Restaura todos los espías
});

beforeEach(() => {
  // Mockeamos window.location.reload
  // (es necesario porque no es editable por defecto)
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { ...window.location, reload: vi.fn() },
  });
});

// --- 6. Las Pruebas ---

describe('Componente NavBar (Usuario Desconectado)', () => {

  beforeEach(() => {
    // Para este bloque, simulamos que getSession() devuelve null
    vi.mocked(getSession).mockReturnValue(null);
  });

  it('debería renderizar los enlaces públicos, Login y Registrarse', () => {
    renderNavBar();

    // Verificamos enlaces públicos
    expect(screen.getByRole('link', { name: /Inicio/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Productos/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Nosotros/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Blog/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Contacto/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '🛒' })).toBeInTheDocument(); // Carrito

    // Verificamos que los links de Login SÍ están
    expect(screen.getByRole('link', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Registrarse/i })).toBeInTheDocument();
  });

  it('NO debería mostrar los elementos de sesión (badge, link a panel, botón logout)', () => {
    renderNavBar();

    // Verificamos que los elementos de sesión NO están
    expect(screen.queryByRole('button', { name: /Cerrar sesión/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/@/i)).not.toBeInTheDocument(); // El email en el badge
    // El link al panel es el que tiene el ícono de usuario
    expect(screen.queryByRole('link', { name: /fas fa-user/i })).not.toBeInTheDocument();
  });
});


describe('Componente NavBar (Usuario Conectado)', () => {

  // Simulamos un objeto de sesión
  const mockSessionData = {
    email: 'test@huerto.com',
    role: 'cliente',
  };

  beforeEach(() => {
    // Para este bloque, simulamos que getSession() devuelve datos
    vi.mocked(getSession).mockReturnValue(mockSessionData);
  });

  it('NO debería mostrar "Login" y "Registrarse"', () => {
    renderNavBar();
    
    // Verificamos que los links de Login y Registro NO están
    expect(screen.queryByRole('link', { name: /Login/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Registrarse/i })).not.toBeInTheDocument();
  });

  it('debería llamar a clearSession() y window.location.reload() al hacer clic en "Cerrar sesión"', async () => {
    const user = userEvent.setup();
    renderNavBar();

    // 1. Buscamos el botón
    const logoutButton = screen.getByRole('button', { name: /Cerrar sesión/i });

    // 2. Acción: Simular clic
    await user.click(logoutButton);

    // 3. Verificamos que las funciones (que mockeamos) fueron llamadas
    expect(clearSession).toHaveBeenCalledOnce();
    expect(window.location.reload).toHaveBeenCalledOnce();
  });
});