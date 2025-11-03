import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';

// --- 1. Mocks para Importaciones de CSS ---
// Le decimos a Vitest que ignore las importaciones de CSS
// Las rutas deben ser las mismas que usa el componente Home.jsx
vi.mock('../src/css/styles.css', () => ({ default: {} }));
vi.mock('../src/css/visual.css', () => ({ default: {} }));

// --- 2. Importación del Componente ---
// (Asumiendo 'pages/Home.jsx' y 'src/tests/Home.test.jsx')
import Home from '../../pages/Home';

// --- 3. Configuración ---
afterEach(cleanup); // Limpia el DOM virtual después de cada prueba

// --- 4. Las Pruebas ---
describe('Componente Home', () => {

  it('debería renderizar el titular, subtítulo y botones del Hero', () => {
    render(<Home />);
    
    // 1. Renderizado Correcto (Titular)
    expect(screen.getByRole('heading', { level: 1, name: /Bienvenido a HUERTO HOGAR/i })).toBeInTheDocument();
    
    // 2. Renderizado Correcto (Subtítulo)
    expect(screen.getByText(/Las mejores frutas y verduras al alcance de todos/i)).toBeInTheDocument();
    
    // 3. Prueba de Propiedades (Botón 1)
    // Buscamos por role="button" (como aprendimos del error anterior)
    const botonProductos = screen.getByRole('button', { name: /Ver Productos/i });
    expect(botonProductos).toBeInTheDocument();
    expect(botonProductos).toHaveAttribute('href', '/productos'); // Corregido a la nueva ruta
    
    // 4. Prueba de Propiedades (Botón 2)
    const botonUnirse = screen.getByRole('button', { name: /Únete Ahora/i });
    expect(botonUnirse).toBeInTheDocument();
    expect(botonUnirse).toHaveAttribute('href', '/registro'); // Corregido a la nueva ruta
  });

  it('debería renderizar la sección de características con imágenes', () => {
    render(<Home />);

    // 1. Renderizado Correcto (Títulos de características)
    expect(screen.getByRole('heading', { level: 3, name: /Productos Frescos/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /Conexión con el Entorno/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /Compromiso Sustentable/i })).toBeInTheDocument();

    // 2. Prueba de Propiedades (Imágenes)
    expect(screen.getByAltText('Productos Frescos')).toHaveAttribute('src', 'img/frutasyverduras.png');
    expect(screen.getByAltText('Conexión Local')).toHaveAttribute('src', 'img/agricultor.png');
    expect(screen.getByAltText('Sustentabilidad')).toHaveAttribute('src', 'img/SUS.png');
  });

  it('debería renderizar la sección de productos destacados', () => {
    render(<Home />);

    // 1. Renderizado Correcto (Título de sección)
    expect(screen.getByRole('heading', { level: 2, name: /Productos Destacados/i })).toBeInTheDocument();

    // 2. Renderizado Correcto (Productos hardcodeados)
    expect(screen.getByRole('heading', { level: 5, name: /Manzana Fuji/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 5, name: /Naranja Valencia/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 5, name: /Plátano Cavendish/i })).toBeInTheDocument();
  });

  it('debería renderizar la sección de beneficios (Por qué elegirnos)', () => {
    render(<Home />);

    // 1. Renderizado Correcto (Título de sección)
    expect(screen.getByRole('heading', { level: 2, name: /¿Por qué elegir Huerto Hogar\?/i })).toBeInTheDocument();

    // 2. Renderizado Correcto (Beneficios)
    expect(screen.getByRole('heading', { level: 4, name: /Envío Rápido/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: /100% Orgánico/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: /Calidad Premium/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: /Apoyo Local/i })).toBeInTheDocument();
  });

  it('debería renderizar la sección "Call to Action" con los enlaces correctos', () => {
    render(<Home />);

    // 1. Renderizado Correcto (Título de sección)
    expect(screen.getByRole('heading', { level: 2, name: /¿Listo para empezar\?/i })).toBeInTheDocument();

    // 2. Prueba de Propiedades (Botón 1)
    const btnExplorar = screen.getByRole('button', { name: /Explorar Productos/i });
    expect(btnExplorar).toBeInTheDocument();
    expect(btnExplorar).toHaveAttribute('href', 'productos.html');

    // 3. Prueba de Propiedades (Botón 2)
    const btnConoce = screen.getByRole('button', { name: /Conoce Más/i });
    expect(btnConoce).toBeInTheDocument();
    expect(btnConoce).toHaveAttribute('href', 'nosotros.html');
  });

});