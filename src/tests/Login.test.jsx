import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

// --- 1. Mocks de CSS (esto queda igual) ---
vi.mock('../src/css/styles.css', () => ({ default: {} }));
vi.mock('../src/css/visual.css', () => ({ default: {} }));

// --- 2. Importación del Módulo a Espiar ---
// IMPORTANTE: ¡Ruta corregida aquí!
import * as loginFunctions from '../../js/login.js';

// --- 3. Importación del Componente ---
// (Ajusta la ruta si es necesario)
import Login from '../../pages/Login'; 

// --- 4. Configuración ---
afterEach(() => {
  cleanup(); 
  vi.restoreAllMocks(); // Esto limpia los espías de 'spyOn'
});

// Declaramos las variables de los espías aquí
let spyInit;
let spyValidar;

beforeEach(() => {
  // ANTES de cada test, creamos los espías en el módulo real
  spyInit = vi.spyOn(loginFunctions, 'initLoginPage').mockImplementation(() => {});
  spyValidar = vi.spyOn(loginFunctions, 'validarTodo').mockImplementation(() => {});
});

// --- 5. Las Pruebas ---

describe('Componente Login', () => {

  it('debería renderizar el formulario y llamar a initLoginPage() al montar', () => {
    render(<Login />);

    // Verificamos el renderizado
    expect(screen.getByRole('heading', { level: 1, name: /Iniciar sesión/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();

    // Verificamos que el useEffect llamó a nuestro espía
    expect(spyInit).toHaveBeenCalledOnce();
  });

  it('debería llamar a validarTodo() al hacer clic en el botón "Entrar"', async () => {
    const user = userEvent.setup();
    render(<Login />);

    // Limpiamos la llamada de 'spyInit' que ocurrió en el render inicial
    spyInit.mockClear();

    // 1. Buscamos el botón
    const submitButton = screen.getByRole('button', { name: /Entrar/i });

    // 2. Acción
    await user.click(submitButton);

    // 3. Assertions
    // Verificamos que la función de validación (nuestro espía) fue llamada
    expect(spyValidar).toHaveBeenCalledOnce();
    
    // Verificamos que initLoginPage NO se volvió a llamar
    expect(spyInit).not.toHaveBeenCalled();
  });
});