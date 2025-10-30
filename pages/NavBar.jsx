import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getSession, clearSession } from "../js/login.js";

function NavBar() {
  const session = getSession();

  const handleLogout = () => {
    clearSession();
    window.location.reload();
  };

  return (
    <Navbar expand="lg" className="py-3">
      <Container fluid className="px-5">
        <Navbar.Brand as={Link} to="/">
          <img src="/img/logo-blanco.png" alt="Huerto Hogar" height="60" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav" className="justify-content-end">
          <Nav>
            <Nav.Link as={Link} to="/">
              Inicio
            </Nav.Link>
            <Nav.Link as={Link} to="/productos">
              Productos
            </Nav.Link>
            <Nav.Link as={Link} to="/nosotros">
              Nosotros
            </Nav.Link>
            <Nav.Link as={Link} to="/blog">
              Blog
            </Nav.Link>
            <Nav.Link as={Link} to="/contacto">
              Contacto
            </Nav.Link>
            {/* si no hay sesión, muestra Login / Registro */}
            {!session && (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/registro">
                  Registrarse
                </Nav.Link>
              </>
            )}

            {/* carrito visible siempre */}
            <Nav.Link as={Link} to="/carrito">
              🛒
            </Nav.Link>

            {/* si hay sesión, muestra badge y botón logout */}
            {session && (
              <div className="d-flex align-items-center ms-lg-3">
                <span className="badge bg-light text-dark me-2">
                  {session.email} ({session.role})
                </span>
                <Button variant="primary" size="sm" onClick={handleLogout}>
                  Cerrar sesión
                </Button>
              </div>
            )}
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
