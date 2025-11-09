import { render, screen, cleanup, within } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';

// --- 1. Mocks de CSS (Asumiendo que los importas) ---
// (Si tu Footer.jsx no importa CSS, puedes borrar estas líneas)
vi.mock('../src/css/styles.css', () => ({ default: {} }));
vi.mock('../src/css/visual.css', () => ({ default: {} }));

// --- 2. Importación del Componente ---
// (Ajusta la ruta si 'Footer.jsx' no está en 'pages/')
import Footer from '../../pages/Footer'; 

// --- 3. Configuración ---
afterEach(cleanup); // Limpia el JSDOM después de cada prueba

// --- 4. Las Pruebas ---
describe('Componente Footer', () => {


  // Test TC-015: Verificar renderizado de información de contacto
  it('debería renderizar la información de contacto', () => {
    render(<Footer />);

    // Verifica el título de la sección
    expect(screen.getByRole('heading', { level: 5, name: /Contáctanos/i })).toBeInTheDocument();
    
    // Verifica el email y el teléfono
    expect(screen.getByText('Email: info@huertohogar.cl')).toBeInTheDocument();
    expect(screen.getByText('Teléfono: +56 9 1234 5678')).toBeInTheDocument();
  });

  // Test TC-016: Verificar renderizado de enlaces de redes sociales
  it('debería renderizar los enlaces de redes sociales', () => {
    render(<Footer />);

    // Busca la sección "Síguenos" por su título
    const siguenosSection = screen.getByRole('heading', { level: 5, name: /Síguenos/i });
    expect(siguenosSection).toBeInTheDocument();

    // Usamos 'within' para buscar solo dentro del elemento padre de "Síguenos"
    // Esto asegura que no estemos encontrando links de otra parte de la página
    const socialLinksContainer = siguenosSection.parentElement;
    
    // Busca todos los elementos con role="link" (etiquetas <a>) dentro de ese contenedor
    const socialLinks = within(socialLinksContainer).getAllByRole('link');
    
    // Verifica que encontró los 3 enlaces
    expect(socialLinks).toHaveLength(3);
    
    // Verifica que todos tienen el 'href' correcto
    socialLinks.forEach(link => {
      expect(link).toHaveAttribute('href', '#');
    });
  });

  // Test TC-017: Verificar renderizado del texto de copyright
  it('debería renderizar el texto de copyright', () => {
    render(<Footer />);

    // Verifica los textos de copyright
    expect(screen.getByText(/© 2025 HUERTO HOGAR/i)).toBeInTheDocument();
    expect(screen.getByText(/Todos los derechos reservados/i)).toBeInTheDocument();
  });

});