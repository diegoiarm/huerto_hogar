import { render, screen, cleanup, within } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';

// --- 1. Mocks para Importaciones de CSS ---
vi.mock('../src/css/styles.css', () => ({ default: {} }));
vi.mock('../src/css/visual.css', () => ({ default: {} }));

// --- 2. Importación del Componente ---
// (Ajusta la ruta si tu archivo Blog.jsx no está en 'pages/')
import Blog from '../../pages/Blog'; 

// --- 3. Configuración ---
afterEach(cleanup); // Limpia el DOM virtual después de cada prueba

// --- 4. Las Pruebas ---
describe('Componente Blog', () => {

  it('debería renderizar el título principal y el subtítulo de la sección', () => {
    render(<Blog />);
    
    // Verifica el título H2
    expect(screen.getByRole('heading', { level: 2, name: /Blog/i })).toBeInTheDocument();
    
    // Verifica el párrafo subtítulo
    expect(screen.getByText(/Últimas noticias y artículos/i)).toBeInTheDocument();
  });

  it('debería renderizar el primer artículo del blog (¿Sabías que…?)', () => {
    render(<Blog />);

    // Buscamos el artículo por su título
    const articulo1 = screen.getByText('¿Sabías que…?').closest('article');
    
    // Verificamos que el artículo existe
    expect(articulo1).toBeInTheDocument();

    // Verificamos el contenido dentro de ese artículo
    // Usamos 'within' para buscar solo dentro del 'articulo1'
    expect(within(articulo1).getByText('Frescura')).toBeInTheDocument();
    expect(within(articulo1).getByText(/Huella de carbono menor/i)).toBeInTheDocument();
    
    // Verificamos la imagen
    const img = within(articulo1).getByRole('img');
    expect(img).toHaveAttribute('alt', 'Cosecha en cajón directo desde el campo');
    expect(img).toHaveAttribute('src', 'img/cajondev.webp');

    // Verificamos el enlace/botón (Prueba de Propiedad 'href')
    const link = within(articulo1).getByRole('link', { name: /Leer más/i });
    expect(link).toHaveAttribute('href', '/blog/dato1');
  });

  it('debería renderizar el segundo artículo del blog (Curiosidad Verde)', () => {
    render(<Blog />);

    // Buscamos el artículo por su título
    const articulo2 = screen.getByText('Curiosidad Verde').closest('article');
    
    // Verificamos que el artículo existe
    expect(articulo2).toBeInTheDocument();

    
    // Verificamos la imagen
    const img = within(articulo2).getByRole('img');
    expect(img).toHaveAttribute('alt', 'Empaques sostenibles y biodegradables');
    expect(img).toHaveAttribute('src', 'img/empaque.webp');

    // Verificamos el enlace/botón (Prueba de Propiedad 'href')
    const link = within(articulo2).getByRole('link', { name: /Leer más/i });
    expect(link).toHaveAttribute('href', '/blog/dato2');
  });

});