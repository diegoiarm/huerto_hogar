function Footer() {
  return (
    <footer className="py-4 text-center mt-5 footer-custom">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>Contáctanos</h5>
            <p className="mb-0">Email: info@huertohogar.cl</p>
            <p className="mb-0">Teléfono: +56 9 1234 5678</p>
          </div>
          <div className="col-md-4">
            <h5>Síguenos</h5>
            <div className="social-links">
              <a href="#" className="text-white text-decoration-none mx-2">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-white text-decoration-none mx-2">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-white text-decoration-none mx-2">
                <i className="fab fa-x-twitter"></i>
              </a>
            </div>
          </div>
          <div className="col-md-4 mt-3">
            <p>© 2025 HUERTO HOGAR<br />Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

