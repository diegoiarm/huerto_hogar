import '../src/css/styles.css'
import '../src/css/visual.css'
import { Navbar, Nav, Container } from "react-bootstrap";

function NavBar() {
  return (
    <Navbar expand="lg">
      <Container>
        <Navbar.Brand href="#">
          <img src="img/logo-blanco.png" alt="Huerto Hogar" height="60" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav" className="justify-content-end">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="/">
                Inicio
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="productos">
                Productos
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="nosotros">
                Nosotros
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="blog">
                Blog
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="contacto.html">
                Contacto
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="login.html">
                Login
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="registro.html">
                Registrarse
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="carrito.html">
                🛒
              </a>
            </li>
          </ul>
        </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
