import { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { getProfile } from "../src/api_rest";

function NavBar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchUser = () => {
    const token = localStorage.getItem("token");
    if (token) {
      getProfile()
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
          localStorage.removeItem("token");
          setUser(null);
        });
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
    window.addEventListener("authChange", fetchUser);
    return () => {
      window.removeEventListener("authChange", fetchUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.dispatchEvent(new Event("authChange"));
    navigate("/");
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
            {!user && (
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
            {user && (
              <>
                {/* Divisor visual para separar opciones de usuario */}
                <div className="vr text-white d-none d-lg-block mx-3" style={{ height: '35px', opacity: 0.3 }}></div>
                
                {/* Sección de usuario */}
                <div className="d-flex align-items-center ms-lg-3 gap-2">
                  <Nav.Link as={Link} to="/panel" className="p-0">
                    <i className="fas fa-user text-white" style={{ fontSize: '1.1rem', cursor: 'pointer' }}></i>
                  </Nav.Link>
                  <span className="badge bg-light text-dark">
                    {user.email} ({user.role || "user"})
                  </span>
                  <Button variant="primary" size="sm" onClick={handleLogout}>
                    Cerrar sesión
                  </Button>
                </div>
              </>
            )}
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
