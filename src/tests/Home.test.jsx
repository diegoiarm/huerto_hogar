import { render, screen, cleanup, within } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom'; // Necesario para <Link>

// --- 1. Mocks de CSS ---
// Rutas relativas desde ESTE ARCHIVO DE PRUEBA (src/tests/)
vi.mock('../css/styles.css', () => ({ default: {} }));
vi.mock('../css/visual.css', () => ({ default: {} }));

// --- 2. Importación del Componente ---
import Home from '../../pages/Home'; 

// --- 3. Wrapper de Renderizado ---
// OBLIGATORIO porque el componente usa <Link> de react-router-dom
const renderHome = () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
};

// --- 4. Configuración ---
afterEach(cleanup); // Limpia el JSDOM

// --- 5. Las Pruebas ---

describe('Componente Home', () => {

  it('debería renderizar el titular, subtítulo y botones del Hero', () => {
    renderHome();
    
    // 1. Renderizado Correcto (Titular)
    // --- CORRECCIÓN 1 ---
    // El texto se renderiza sin espacio entre 'a' y 'HUERTO'.
    // Buscamos el H1 por su rol
    const h1 = screen.getByRole('heading', { level: 1 });
    // Verificamos el contenido de texto exacto que renderiza React
    expect(h1).toHaveTextContent('Bienvenido aHUERTOHOGAR');
    
    // 2. Renderizado Correcto (Subtítulo)
    expect(screen.getByText(/Las mejores frutas y verduras al alcance de todos/i)).toBeInTheDocument();
    
    // 3. Prueba de Propiedades (Botones)
    // Buscamos por role="button" (porque son <Button> de React-Bootstrap)
    const botonProductos = screen.getByRole('button', { name: /Ver Productos/i });
    expect(botonProductos).toBeInTheDocument();
    expect(botonProductos).toHaveAttribute('href', '/productos'); // Verificamos el 'to'
    
    const botonUnirse = screen.getByRole('button', { name: /Únete Ahora/i });
    expect(botonUnirse).toBeInTheDocument();
    expect(botonUnirse).toHaveAttribute('href', '/registro'); // Verificamos el 'to'
  });

  it('debería renderizar la sección de características con imágenes', () => {
    renderHome();

    // 1. Renderizado Correcto (Títulos)
    expect(screen.getByRole('heading', { level: 3, name: /Productos Frescos/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /Conexión con el Entorno/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /Compromiso Sustentable/i })).toBeInTheDocument();

    // 2. Prueba de Propiedades (Imágenes)
    expect(screen.getByAltText('Productos Frescos')).toHaveAttribute('src', 'img/frutasyverduras.png');
    expect(screen.getByAltText('Conexión Local')).toHaveAttribute('src', 'img/agricultor.png');
    expect(screen.getByAltText('Sustentabilidad')).toHaveAttribute('src', 'img/SUS.png');
  });

  it('debería renderizar la sección de productos destacados con sus enlaces', () => {
    renderHome();

    // 1. Renderizado Correcto (Título de sección)
    expect(screen.getByRole('heading', { level: 2, name: /Productos Destacados/i })).toBeInTheDocument();

    // 2. Verificamos los 3 productos y sus enlaces (que son <a>, no <Button>)
    
    // --- CORRECCIÓN 2 ---
    // Tu nuevo código usa href="/productos" en lugar de "productos.html"
    
    const cardManzana = screen.getByText('Manzana Fuji').closest('.card');
    const linkManzana = within(cardManzana).getByRole('link', { name: /Ver Detalles/i });
    expect(linkManzana).toHaveAttribute('href', '/productos');
    
    const cardNaranja = screen.getByText('Naranja Valencia').closest('.card');
    const linkNaranja = within(cardNaranja).getByRole('link', { name: /Ver Detalles/i });
    expect(linkNaranja).toHaveAttribute('href', '/productos');

    const cardPlatano = screen.getByText('Plátano Cavendish').closest('.card');
    const linkPlatano = within(cardPlatano).getByRole('link', { name: /Ver Detalles/i });
    expect(linkPlatano).toHaveAttribute('href', '/productos');
  });

  it('debería renderizar la sección de beneficios (Por qué elegirnos)', () => {
    renderHome();

    // 1. Renderizado Correcto (Título de sección)
    expect(screen.getByRole('heading', { level: 2, name: /¿Por qué elegir Huerto Hogar\?/i })).toBeInTheDocument();

    // 2. Renderizado Correcto (Beneficios)
    expect(screen.getByRole('heading', { level: 4, name: /Envío Rápido/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: /100% Orgánico/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: /Calidad Premium/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: /Apoyo Local/i })).toBeInTheDocument();
  });

  it('debería renderizar la sección "Call to Action" con los enlaces correctos', () => {
    renderHome();

    // 1. Renderizado Correcto (Título de sección)
    expect(screen.getByRole('heading', { level: 2, name: /¿Listo para empezar\?/i })).toBeInTheDocument();

    // 2. Prueba de Propiedades (Botones <Button as={Link}>)
    const btnExplorar = screen.getByRole('button', { name: /Explorar Productos/i });
    expect(btnExplorar).toBeInTheDocument();
    expect(btnExplorar).toHaveAttribute('href', '/productos'); // Corregido

    const btnConoce = screen.getByRole('button', { name: /Conoce Más/i });
    expect(btnConoce).toBeInTheDocument();
    expect(btnConoce).toHaveAttribute('href', '/nosotros'); // Corregido
  });

});