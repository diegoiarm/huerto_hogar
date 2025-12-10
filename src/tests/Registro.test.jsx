import { render, screen, cleanup, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Registro from '../../pages/Registro';
import * as api from '../api_rest';
import Swal from 'sweetalert2';

// Mock de CSS
vi.mock('../css/styles.css', () => ({ default: {} }));
vi.mock('../css/visual.css', () => ({ default: {} }));

// Mock de api_rest
vi.mock('../api_rest', () => ({
    register: vi.fn(),
}));

// Mock de Swal
vi.mock('sweetalert2', () => ({
    default: {
        fire: vi.fn().mockResolvedValue({ isConfirmed: true }),
    }
}));

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Componente Registro', () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('debería renderizar el formulario correctamente', () => {
        render(
            <MemoryRouter>
                <Registro />
            </MemoryRouter>
        );
        expect(screen.getByRole('heading', { name: /Registro de usuario/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/Nombre completo/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/RUT/i)).toBeInTheDocument();
    });

    it('debería mostrar error si las contraseñas no coinciden', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <Registro />
            </MemoryRouter>
        );

        // Llenar campos requeridos para saltar la validación HTML5
        await user.type(screen.getByLabelText(/Nombre completo/i), 'Usuario Test');
        await user.type(screen.getByLabelText(/RUT/i), '11.111.111-1');
        await user.type(screen.getByLabelText(/Correo/i), 'test@test.com');
        await user.selectOptions(screen.getByLabelText(/Región/i), "Región Metropolitana de Santiago");
        await user.selectOptions(screen.getByLabelText(/Comuna/i), "Santiago");

        await user.type(screen.getByLabelText('Contraseña'), '1234');
        await user.type(screen.getByLabelText(/Confirmar contraseña/i), '5678');
        await user.click(screen.getByRole('button', { name: /Registrar/i }));

        expect(Swal.fire).toHaveBeenCalledWith("Error", "Las contraseñas no coinciden", "error");
        expect(api.register).not.toHaveBeenCalled();
    });

    it('debería registrar exitosamente y redirigir', async () => {
        const user = userEvent.setup();
        vi.mocked(api.register).mockResolvedValue({ data: { success: true } });

        render(
            <MemoryRouter>
                <Registro />
            </MemoryRouter>
        );

        // Llenar formulario
        await user.type(screen.getByLabelText(/Nombre completo/i), 'Pepe');
        await user.type(screen.getByLabelText(/RUT/i), '12345678-9');
        await user.type(screen.getByLabelText(/Correo/i), 'pepe@test.com');
        await user.type(screen.getByLabelText('Contraseña'), '1234');
        await user.type(screen.getByLabelText(/Confirmar contraseña/i), '1234');

        await user.selectOptions(screen.getByLabelText(/Región/i), "Región Metropolitana de Santiago");
        await user.selectOptions(screen.getByLabelText(/Comuna/i), "Santiago");

        await user.click(screen.getByRole('button', { name: /Registrar/i }));

        expect(api.register).toHaveBeenCalled();

        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ title: "Registro exitoso" }));
        });

        // Verificar navegación después de la confirmación de Swal
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/login");
        });
    });

    it('debería redirigir si ya hay token', () => {
        localStorage.setItem('token', 'exists');
        render(
            <MemoryRouter>
                <Registro />
            </MemoryRouter>
        );
        expect(mockNavigate).toHaveBeenCalledWith('/panel');
    });
});