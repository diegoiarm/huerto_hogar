import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useNavigate } from 'react-router-dom'; // Importamos useNavigate

// --- 1. Mocks de CSS ---
vi.mock('../css/styles.css', () => ({ default: {} }));
vi.mock('../css/visual.css', () => ({ default: {} }));

// --- 2. Mock del módulo 'login.js' ---
// (Usamos la ruta corregida desde el test)
vi.mock('../../js/login', () => ({
  getSession: vi.fn(),
  initLoginPage: vi.fn(),
  validarTodo: vi.fn(),
}));

// --- 3. Mock de 'react-router-dom' ---
// Necesitamos un "espía" para 'useNavigate'
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const original = await importOriginal(); // Importa el módulo original
  return {
    ...original, // Mantenemos todas las exportaciones (como <MemoryRouter>)
    useNavigate: () => mockNavigate, // PERO reemplazamos useNavigate con nuestro espía
  };
});

// --- 4. Importación del Componente y Mocks ---
import Login from '../../pages/Login';
// Importamos los mocks para poder controlarlos
import { getSession, initLoginPage, validarTodo } from '../../js/login';

// --- 5. Wrapper de Renderizado ---
// Creamos una función helper para envolver <Login> en el Router
const renderLogin = () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
};

// --- 6. Configuración ---
afterEach(cleanup);
beforeEach(() => {
  vi.resetAllMocks(); // Limpia todos los mocks
});

// --- 7. Las Pruebas ---

describe('Componente Login (Usuario Desconectado)', () => {

  beforeEach(() => {
    // Para este bloque, simulamos que NO hay sesión
    vi.mocked(getSession).mockReturnValue(null);
  });

  it('debería renderizar el formulario y llamar a initLoginPage() al montar', () => {
    renderLogin();

    // 1. Verificamos el renderizado del formulario
    expect(screen.getByRole('heading', { level: 1, name: /Iniciar sesión/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();

    // 2. Verificamos la lógica del useEffect (sin sesión)
    expect(getSession).toHaveBeenCalledOnce();
    expect(initLoginPage).toHaveBeenCalledOnce(); // Debe llamar a init
    expect(mockNavigate).not.toHaveBeenCalled();  // NO debe navegar
  });

  it('debería llamar a validarTodo() al hacer clic en el botón "Entrar"', async () => {
    const user = userEvent.setup();
    renderLogin();

    // Limpiamos los mocks del render inicial
    vi.mocked(getSession).mockClear();
    vi.mocked(initLoginPage).mockClear();

    // 1. Acción: Clic en el botón
    const submitButton = screen.getByRole('button', { name: /Entrar/i });
    await user.click(submitButton);

    // 2. Assertions
    expect(validarTodo).toHaveBeenCalledOnce(); // Función de submit llamada
    expect(mockNavigate).not.toHaveBeenCalled(); // No debe navegar
    expect(initLoginPage).not.toHaveBeenCalled(); // No debe reinicializar
  });
});

describe('Componente Login (Usuario Ya Conectado)', () => {

  it('debería llamar a getSession(), navegar a /panel y NO llamar a initLoginPage', () => {
    // 1. Setup: Simulamos que SÍ hay sesión
    vi.mocked(getSession).mockReturnValue({ email: 'test@huerto.com', role: 'admin' });

    // 2. Acción: Renderizar
    renderLogin();

    // 3. Assertions (Verificamos la lógica del useEffect)
    expect(getSession).toHaveBeenCalledOnce();
    expect(mockNavigate).toHaveBeenCalledOnce(); // SÍ debe navegar
    expect(mockNavigate).toHaveBeenCalledWith('/panel'); // A la ruta correcta
    expect(initLoginPage).not.toHaveBeenCalled(); // NO debe inicializar el form
  });
});