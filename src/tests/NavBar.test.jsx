import { render, screen, cleanup, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import NavBar from '../../pages/NavBar';
import * as api from '../api_rest';

// Mock de CSS
vi.mock('../css/styles.css', () => ({ default: {} }));
vi.mock('../css/visual.css', () => ({ default: {} }));

// Mock de api_rest
vi.mock('../api_rest', () => ({
    getProfile: vi.fn(),
}));

describe('Componente NavBar', () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('debería mostrar enlaces públicos cuando no hay sesión', async () => {
        // Mock de getSession (profile) fallido o token nulo
        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );

        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByText('Registrarse')).toBeInTheDocument();
        expect(screen.queryByText('Cerrar sesión')).not.toBeInTheDocument();
    });

    it('debería mostrar usuario y botón de cerrar sesión cuando hay token', async () => {
        localStorage.setItem('token', 'valid-token');
        const usuarioMock = { email: 'test@test.com', role: 'admin' };
        vi.mocked(api.getProfile).mockResolvedValue({ data: usuarioMock });

        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/test@test.com/)).toBeInTheDocument();
        });
        expect(screen.getByText('Cerrar sesión')).toBeInTheDocument();
        expect(screen.queryByText('Login')).not.toBeInTheDocument();
    });

    it('debería cerrar sesión correctamente', async () => {
        const user = userEvent.setup();
        localStorage.setItem('token', 'valid-token');
        vi.mocked(api.getProfile).mockResolvedValue({ data: { email: 'u', role: 'u' } });

        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText('Cerrar sesión')).toBeInTheDocument());

        await user.click(screen.getByText('Cerrar sesión'));

        expect(localStorage.getItem('token')).toBeNull();
        expect(screen.getByText('Login')).toBeInTheDocument();
    });
});