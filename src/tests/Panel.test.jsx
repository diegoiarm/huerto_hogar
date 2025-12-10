import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Panel from '../../pages/Panel';
import * as api from '../api_rest';
import Swal from 'sweetalert2';

// 1. Mock de CSS e Imágenes para evitar errores de importación
vi.mock('../css/visual.css', () => ({ default: {} }));

// 2. Mock de SweetAlert2
vi.mock('sweetalert2', () => ({
    default: {
        fire: vi.fn().mockResolvedValue({ isConfirmed: true }), // Simula click en "Sí"
    },
}));

// 3. Mock de api_rest (Todas las funciones que usa Panel.jsx)
vi.mock('../api_rest', () => ({
    getProfile: vi.fn(),
    getAllUsers: vi.fn(),
    deleteUser: vi.fn(),
    updateUser: vi.fn(),
    getProducts: vi.fn(),
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
    createUser: vi.fn(),
    getCategories: vi.fn(),
    getOrders: vi.fn(),
}));

// 4. Mock de react-router-dom (useNavigate)
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Componente Panel', () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('debería redirigir al login si no hay token', async () => {
        render(
            <MemoryRouter>
                <Panel />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    });

    it('debería renderizar la vista de CLIENTE correctamente', async () => {
        localStorage.setItem('token', 'fake-token');

        // Mock perfil de usuario normal
        vi.mocked(api.getProfile).mockResolvedValue({
            data: { email: 'cliente@test.com', role: 'CLIENTE' }
        });

        render(
            <MemoryRouter>
                <Panel />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/Mi Panel de Usuario/i)).toBeInTheDocument();
            expect(screen.getByText('cliente@test.com')).toBeInTheDocument();
            // Verificar que NO ve elementos de admin
            expect(screen.queryByText(/Gestión de Usuarios/i)).not.toBeInTheDocument();
        });
    });

    it('debería renderizar la vista de ADMIN y cargar listas', async () => {
        localStorage.setItem('token', 'admin-token');

        // Datos simulados
        const mockUsers = [
            { id: 1, email: 'user1@test.com', role: 'CLIENTE' },
            { id: 2, email: 'admin@test.com', role: 'ADMIN' }
        ];
        const mockProducts = [
            { id: 10, nombre: 'Manzana', precio: 1000, stock: 50 }
        ];

        // Mocks de respuestas
        vi.mocked(api.getProfile).mockResolvedValue({
            data: { email: 'admin@test.com', role: 'ADMIN' }
        });
        vi.mocked(api.getAllUsers).mockResolvedValue({ data: mockUsers });
        vi.mocked(api.getProducts).mockResolvedValue({ data: mockProducts });
        vi.mocked(api.getCategories).mockResolvedValue({ data: [] });
        vi.mocked(api.getOrders).mockResolvedValue({ data: [] });

        render(
            <MemoryRouter>
                <Panel />
            </MemoryRouter>
        );

        // Esperar a que cargue el perfil y la vista de admin
        await waitFor(() => {
            expect(screen.getByText(/Panel de Gestión/i)).toBeInTheDocument();
            expect(screen.getByText(/Administrador/i)).toBeInTheDocument();
        });

        // Verificar tabs
        expect(screen.getByText(/Gestión de Usuarios/i)).toBeInTheDocument();
        expect(screen.getByText(/Gestión de Productos/i)).toBeInTheDocument();

        // Verificar que se cargaron los usuarios (Tab por defecto o al cambiar)
        // Nota: En tu código Admin inicia en tab "users" si es ADMIN
        await waitFor(() => {
            expect(screen.getByText('user1@test.com')).toBeInTheDocument();
        });
    });

    it('debería permitir eliminar un usuario (Admin)', async () => {
        localStorage.setItem('token', 'admin-token');

        vi.mocked(api.getProfile).mockResolvedValue({ data: { role: 'ADMIN' } });
        vi.mocked(api.getAllUsers).mockResolvedValue({
            data: [{ id: 99, email: 'delete-me@test.com', role: 'CLIENTE' }]
        });
        vi.mocked(api.deleteUser).mockResolvedValue({}); // Éxito

        render(
            <MemoryRouter>
                <Panel />
            </MemoryRouter>
        );

        await waitFor(() => screen.getByText('delete-me@test.com'));

        // Buscar botón eliminar y clickear
        const deleteBtns = screen.getAllByText('Eliminar');
        fireEvent.click(deleteBtns[0]);

        // Verificar llamada a SweetAlert
        expect(Swal.fire).toHaveBeenCalled();

        // Verificar llamada a API
        await waitFor(() => {
            expect(api.deleteUser).toHaveBeenCalledWith(99);
        });
    });

    it('debería renderizar vista VENDEDOR (sin gestión de usuarios)', async () => {
        localStorage.setItem('token', 'vendedor-token');

        vi.mocked(api.getProfile).mockResolvedValue({
            data: { email: 'vend@test.com', role: 'VENDEDOR' }
        });
        vi.mocked(api.getProducts).mockResolvedValue({ data: [] });
        vi.mocked(api.getCategories).mockResolvedValue({ data: [] });
        vi.mocked(api.getOrders).mockResolvedValue({ data: [] });

        render(
            <MemoryRouter>
                <Panel />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/Vendedor/i)).toBeInTheDocument();
            // Vendedor ve productos y ordenes, pero NO usuarios
            expect(screen.queryByText(/Gestión de Usuarios/i)).not.toBeInTheDocument();
        });
    });
});