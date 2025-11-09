import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';

// --- 1. Mocks para Importaciones de CSS ---
// Ignoramos las importaciones de CSS
vi.mock('../src/css/styles.css', () => ({ default: {} }));
vi.mock('../src/css/visual.css', () => ({ default: {} }));

// --- 2. Importación del Componente ---
// Ajusta esta ruta si tu archivo Nosotros.jsx no está en 'pages/'
// (Asumiendo 'pages/Nosotros.jsx' y 'src/tests/Nosotros.test.jsx')
import Nosotros from '../../pages/Nosotros';

// --- 3. Configuración ---
afterEach(cleanup); // Limpia el DOM virtual después de cada prueba

// --- 4. Las Pruebas ---
describe('Componente Nosotros', () => {

    // Test TC-030: Verificación de contenido principal
    it('debería renderizar la sección "Quiénes Somos" con la misión y visión', () => {
        render(<Nosotros />);
        
        // Verificamos el título principal de la sección
        expect(screen.getByRole('heading', { level: 2, name: /Quiénes Somos/i })).toBeInTheDocument();
    
        // --- CORRECCIÓN ---
        // Buscamos el <p> que contiene "HuertoHogar es una tienda online..."
        // 1. Buscamos el texto "HuertoHogar" (que está dentro del <strong>)
        // 2. Usamos .closest('p') para "subir" al elemento <p> que lo contiene
        const pElement = screen.getByText('HuertoHogar').closest('p');
        
        // 3. Ahora SÍ podemos verificar el contenido de texto total de ese <p>
        expect(pElement).toHaveTextContent(/HuertoHogar es una tienda online/i);
    
        // Hacemos lo mismo para misión y visión
        const pMission = screen.getByText('misión').closest('p');
        expect(pMission).toHaveTextContent(/Nuestra misión es conectar/i);
    
        const pVision = screen.getByText('visión').closest('p');
        expect(pVision).toHaveTextContent(/Nuestra visión es ser la tienda online líder/i);
        
        // Verificamos la imagen
        const img = screen.getByRole('img', { name: /HuertoHogar/i });
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', '/img/planta.png');
      });

  // Test TC-031: Verificación de sección de cifras (KPIs)
  it('debería renderizar la sección de cifras (KPIs)', () => {
    render(<Nosotros />);

    // Verificamos que todas las cifras y sus descripciones estén
    expect(screen.getByText('6+')).toBeInTheDocument();
    expect(screen.getByText('Años de experiencia')).toBeInTheDocument();

    expect(screen.getByText('9+')).toBeInTheDocument();
    expect(screen.getByText('Ciudades activas')).toBeInTheDocument();
    
    expect(screen.getByText('150+')).toBeInTheDocument();
    expect(screen.getByText('Agricultores aliados')).toBeInTheDocument();

    expect(screen.getByText('98%')).toBeInTheDocument();
    expect(screen.getByText('Satisfacción clientes')).toBeInTheDocument();
  });

  // Test TC-032: Verificación de sección de valores
  it('debería renderizar la sección de "Nuestros valores"', () => {
    render(<Nosotros />);

    // Verificamos el título de la sección
    expect(screen.getByRole('heading', { level: 2, name: /Nuestros valores/i })).toBeInTheDocument();

    // Verificamos las 3 tarjetas de valores
    expect(screen.getByRole('heading', { level: 5, name: /Sostenibilidad/i })).toBeInTheDocument();
    expect(screen.getByText(/Trabajamos con prácticas responsables/i)).toBeInTheDocument();
    
    expect(screen.getByRole('heading', { level: 5, name: /Comunidad/i })).toBeInTheDocument();
    expect(screen.getByText(/Impulsamos economías locales/i)).toBeInTheDocument();
    
    expect(screen.getByRole('heading', { level: 5, name: /Calidad/i })).toBeInTheDocument();
    expect(screen.getByText(/Selección rigurosa y procesos de frío/i)).toBeInTheDocument();
  });

});