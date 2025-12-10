import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Login from '../../pages/Login';
import * as api from '../api_rest';

// Mock de CSS
vi.mock('../css/styles.css', () => ({ default: {} }));
vi.mock('../css/visual.css', () => ({ default: {} }));

// Mock de api_rest
vi.mock('../api_rest', () => ({
    login: vi.fn(),
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

describe('Componente Login', () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('debería renderizar el formulario correctamente', () => {
        // Mock de getSession retorna null implícitamente por el mock por defecto
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );
        expect(screen.getByRole('heading', { name: /Iniciar sesión/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();
    });

    it('debería redirigir si ya existe un token en localStorage', () => {
        localStorage.setItem('token', 'fake-token');
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );
        expect(mockNavigate).toHaveBeenCalledWith('/panel');
    });

    it('debería mostrar error si el login falla', async () => {
        const user = userEvent.setup();
        vi.mocked(api.login).mockRejectedValue(new Error('Fallo en login'));

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        await user.type(screen.getByLabelText(/Email/i), 'wrong@test.com');
        await user.type(screen.getByLabelText(/Contraseña/i), 'wrongpass');
        await user.click(screen.getByRole('button', { name: /Entrar/i }));

        expect(api.login).toHaveBeenCalledWith({ email: 'wrong@test.com', password: 'wrongpass' });

        await waitFor(() => {
            expect(screen.getByText(/Credenciales inválidas/i)).toBeInTheDocument();
        });
    });

    it('debería guardar token y redirigir al login exitoso', async () => {
        const user = userEvent.setup();
        const fakeToken = 'abc-123';
        // Mock de respuesta exitosa de login
        vi.mocked(api.login).mockResolvedValue({ data: { token: fakeToken } });

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        await user.type(screen.getByLabelText(/Email/i), 'user@test.com');
        await user.type(screen.getByLabelText(/Contraseña/i), 'password');
        await user.click(screen.getByRole('button', { name: /Entrar/i }));

        await waitFor(() => {
            expect(localStorage.getItem('token')).toBe(fakeToken);
            expect(mockNavigate).toHaveBeenCalledWith('/panel');
        });
    });
});