import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

// --- 1. Mocks de CSS (Se elevan/hoisted) ---
vi.mock('../src/css/styles.css', () => ({ default: {} }));
vi.mock('../src/css/visual.css', () => ({ default: {} }));

// --- 2. Mock del módulo 'contacto.js' ---
// ¡Importante! Mockeamos el módulo ANTES de importarlo.
// Definimos las funciones mockeadas (vi.fn()) DENTRO de la fábrica.
vi.mock('../../js/contacto.js', () => ({
  initialFormState: { nombre: '', email: '', mensaje: '' },
  handleFormSubmit: vi.fn(),
  handleInputChange: vi.fn(),
}));

// --- 3. Importación del Componente Y LOS MOCKS ---
// El componente 'Contacto' importará automáticamente las funciones mockeadas de arriba.
import Contacto from '../../pages/Contacto.jsx';
// Importamos las funciones mockeadas NOSOTROS MISMOS para poder espiarlas.
import { handleFormSubmit, handleInputChange } from '../../js/contacto.js';

// --- 4. Configuración ---
afterEach(cleanup);
beforeEach(() => {
  // Reseteamos los "espías" antes de cada prueba.
  // Usamos vi.mocked() para ayudar al autocompletado.
  vi.mocked(handleFormSubmit).mockClear();
  vi.mocked(handleInputChange).mockClear();
});

// --- 5. Las Pruebas ---
describe('Componente Contacto', () => {

  it('debería renderizar el formulario correctamente', () => {
    render(<Contacto />);
    expect(screen.getByRole('heading', { name: /Contáctanos/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mensaje/i)).toBeInTheDocument();
  });

  it('debería llamar a handleInputChange cuando el usuario escribe', async () => {
    const user = userEvent.setup();
    render(<Contacto />);

    // Simula al usuario escribiendo "Test"
    const nombreInput = screen.getByLabelText(/Nombre completo/i);
    await user.type(nombreInput, 'Test');

    // Verifica que la función (que importamos del mock) fue llamada 4 veces
    expect(handleInputChange).toHaveBeenCalledTimes(4);
  });

  it('debería llamar a handleFormSubmit al hacer clic en enviar', async () => {
    const user = userEvent.setup();
    render(<Contacto />);

    const submitButton = screen.getByRole('button', { name: /Enviar mensaje/i });
    await user.click(submitButton);

    // Verifica que la función de submit (importada del mock) fue llamada
    expect(handleFormSubmit).toHaveBeenCalledOnce();
  });

});