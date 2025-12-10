import { render, screen, cleanup, waitFor, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import Productos from '../../pages/Productos';
import * as api from '../api_rest';

// Mock de CSS
vi.mock('../css/styles.css', () => ({ default: {} }));
vi.mock('../css/visual.css', () => ({ default: {} }));

// Mock de api_rest
vi.mock('../api_rest', () => ({
    getProducts: vi.fn(),
    getCategories: vi.fn(),
}));

const productosPrueba = [
    { id: 1, nombre: 'Tomate', precio: 1500, categoria: 'Verduras', imagen: 'img1.jpg', descripcion: 'Un tomate' },
    { id: 2, nombre: 'Manzana', precio: 1200, categoria: 'Frutas', imagen: 'img2.jpg', descripcion: 'Una manzana' }
];

const categoriasPrueba = [
    { id: 1, nombre: 'Verduras' },
    { id: 2, nombre: 'Frutas' }
];

describe('Componente Productos', () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
        localStorage.clear();
    });

    beforeEach(() => {
        vi.mocked(api.getProducts).mockResolvedValue({ data: productosPrueba });
        vi.mocked(api.getCategories).mockResolvedValue({ data: categoriasPrueba });
    });

    it('debería renderizar y cargar productos', async () => {
        render(<Productos />);

        expect(screen.getByText('Catálogo de Productos')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Tomate')).toBeInTheDocument();
            expect(screen.getByText('Manzana')).toBeInTheDocument();
        });
    });

    it('debería filtrar productos por categoría', async () => {
        const user = userEvent.setup();
        render(<Productos />);

        await waitFor(() => expect(screen.getByText('Tomate')).toBeInTheDocument());

        const select = screen.getByLabelText('Categoría');
        await user.selectOptions(select, 'Verduras');

        expect(screen.getByText('Tomate')).toBeInTheDocument();
        expect(screen.queryByText('Manzana')).not.toBeInTheDocument();
    });

    it('debería agregar al carrito y mostrar toast', async () => {
        const user = userEvent.setup();
        render(<Productos />);

        await waitFor(() => expect(screen.getByText('Tomate')).toBeInTheDocument());

        const tarjetaTomate = screen.getByText('Tomate').closest('.card');
        const botonAgregar = within(tarjetaTomate).getByRole('button', { name: /Agregar al carrito/i });

        await user.click(botonAgregar);

        // Verificar notificación (toast)
        expect(await screen.findByText('Tomate agregado al carrito')).toBeInTheDocument();

        // Verificar localStorage
        const carrito = JSON.parse(localStorage.getItem('cart.items'));
        expect(carrito).toHaveLength(1);
        expect(carrito[0].nombre).toBe('Tomate');
    });
});