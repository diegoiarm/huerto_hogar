import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useNavigate } from 'react-router-dom';

// --- 1. Mocks de Módulos ---

// Mockeamos el hook 'useNavigate' de react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original, // Mantenemos <MemoryRouter>, etc.
    useNavigate: () => mockNavigate, // Reemplazamos useNavigate con nuestro espía
  };
});

// Mockeamos 'js/login.js'
vi.mock('../../js/login', () => ({
  getSession: vi.fn(),
}));

// Mockeamos 'js/registro.js'
vi.mock('../../js/registro', () => ({
  initRegistroPage: vi.fn(),
  registrarUsuario: vi.fn(),
}));

// --- 2. Importación del Componente y Mocks ---
import Registro from '../../pages/Registro';
// Importamos los mocks para poder controlarlos
import { getSession } from '../../js/login';
import { initRegistroPage, registrarUsuario } from '../../js/registro';

// --- 3. Wrapper de Renderizado ---
// OBLIGATORIO porque el componente usa 'useNavigate'
const renderRegistro = () => {
  render(
    <MemoryRouter>
      <Registro />
    </MemoryRouter>
  );
};

// --- 4. Configuración ---
afterEach(cleanup);
beforeEach(() => {
  vi.resetAllMocks(); // Limpia todos los mocks (navigate, getSession, etc.)
});

// --- 5. Las Pruebas ---

describe('Componente Registro (Usuario Desconectado)', () => {

  beforeEach(() => {
    // Para este escenario, getSession() no devuelve nada
    vi.mocked(getSession).mockReturnValue(null);
  });

  // Test TC-036: Verificación de renderizado y lógica inicial de useEffect
  it('debería renderizar el formulario completo y llamar a initRegistroPage()', () => {
    renderRegistro();

    // 1. Verificamos el renderizado
    expect(screen.getByRole('heading', { level: 1, name: /Registro de usuario/i })).toBeInTheDocument();
    
    // Verificamos los campos (¡Ahora funciona porque el JSX tiene htmlFor/id!)
    expect(screen.getByLabelText(/Nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/RUT/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument(); // Texto exacto
    expect(screen.getByLabelText(/Confirmar contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Región/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Comuna/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Registrar/i })).toBeInTheDocument();

    // 2. Verificamos la lógica del useEffect
    expect(getSession).toHaveBeenCalledOnce();
    expect(initRegistroPage).toHaveBeenCalledOnce(); // SÍ debe inicializar
    expect(mockNavigate).not.toHaveBeenCalled();  // NO debe navegar
  });

  // Test TC-037: Verificación de evento de submit del formulario
  it('debería llamar a registrarUsuario() al hacer clic en el botón "Registrar"', async () => {
    const user = userEvent.setup();
    renderRegistro();

    // Limpiamos los mocks del render inicial
    vi.mocked(getSession).mockClear();
    vi.mocked(initRegistroPage).mockClear();

    // 1. Acción: Clic en el botón
    const submitButton = screen.getByRole('button', { name: /Registrar/i });
    await user.click(submitButton);

    // 2. Assertions
    expect(registrarUsuario).toHaveBeenCalledOnce(); // Función de submit llamada
    expect(initRegistroPage).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

describe('Componente Registro (Usuario Conectado)', () => {

  // Test TC-038: Verificación de redirección si ya hay sesión
  it('debería redirigir a /panel y NO llamar a initRegistroPage()', () => {
    // 1. Setup: Simulamos que SÍ hay sesión
    vi.mocked(getSession).mockReturnValue({ email: 'test@user.com' });

    // 2. Acción: Renderizar
    renderRegistro();

    // 3. Assertions (Verificamos la lógica del useEffect)
    expect(getSession).toHaveBeenCalledOnce();
    expect(mockNavigate).toHaveBeenCalledOnce(); // SÍ debe navegar
    expect(mockNavigate).toHaveBeenCalledWith('/panel'); // A la ruta correcta
    expect(initRegistroPage).not.toHaveBeenCalled(); // NO debe inicializar
  });
});