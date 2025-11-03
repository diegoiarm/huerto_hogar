import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

// --- 1. Mocks de CSS ---
vi.mock('../src/css/styles.css', () => ({ default: {} }));
vi.mock('../src/css/visual.css', () => ({ default: {} }));

// --- 2. Importación del Módulo a Espiar ---
// (Ajusta la ruta si 'js/registro.js' no está en la raíz)
import * as registroFunctions from '../../js/registro.js';

// --- 3. Importación del Componente ---
// (Ajusta la ruta si 'Registro.jsx' no está en 'pages/')
import Registro from '../../pages/Registro'; 

// --- 4. Configuración ---
afterEach(() => {
  cleanup(); 
  vi.restoreAllMocks(); // Restaura todos los espías
});

// Declaramos las variables de los espías fuera
let spyInit;
let spyRegistrar;

beforeEach(() => {
  // Creamos los espías ANTES de cada test
  spyInit = vi.spyOn(registroFunctions, 'initRegistroPage').mockImplementation(() => {});
  spyRegistrar = vi.spyOn(registroFunctions, 'registrarUsuario').mockImplementation(() => {});
});

// --- 5. Las Pruebas ---

describe('Componente Registro', () => {

  it('debería renderizar el formulario y llamar a initRegistroPage() al montar', () => {
    render(<Registro />);

    // Verificamos el renderizado
    expect(screen.getByRole('heading', { level: 1, name: /Registro de usuario/i })).toBeInTheDocument();
    
    // Verificamos los campos (¡Esto podría fallar! Ver nota abajo)
    expect(screen.getByLabelText(/Nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/RUT/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirmar contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Región/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Comuna/i)).toBeInTheDocument();
    
    expect(screen.getByRole('button', { name: /Registrar/i })).toBeInTheDocument();

    // Verificamos que el useEffect llamó a nuestro espía
    expect(spyInit).toHaveBeenCalledOnce();
  });

  it('debería llamar a registrarUsuario() al hacer clic en el botón "Registrar"', async () => {
    const user = userEvent.setup();
    render(<Registro />);

    // Limpiamos el 'spyInit' que se llamó durante el renderizado inicial
    spyInit.mockClear();

    // 1. Buscamos el botón de submit
    const submitButton = screen.getByRole('button', { name: /Registrar/i });

    // 2. Acción: Simular clic del usuario
    await user.click(submitButton);

    // 3. Assertions (Verificaciones)
    // Verificamos que la función de registro (nuestro espía) fue llamada
    expect(spyRegistrar).toHaveBeenCalledOnce();
    
    // --- ¡AQUÍ ESTÁ EL ARREGLO! ---
    // Se agregaron los paréntesis () y el punto y coma ;
    // y los cierres } y )
    expect(spyInit).not.toHaveBeenCalled();
  });

});