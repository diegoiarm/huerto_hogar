function Footer() {
  return (
    <footer class="py-4 text-center mt-5 footer-custom">
      <div class="container">
        <div class="row">
          <div class="col-md-4">
            <h5>Contáctanos</h5>
            <p class="mb-0">Email: info@huertohogar.cl</p>
            <p class="mb-0">Teléfono: +56 9 1234 5678</p>
          </div>
          <div class="col-md-4">
            <h5>Síguenos</h5>
            <div class="social-links">
              <a href="#" class="text-white text-decoration-none mx-2">
                <i class="fab fa-facebook"></i>
              </a>
              <a href="#" class="text-white text-decoration-none mx-2">
                <i class="fab fa-instagram"></i>
              </a>
              <a href="#" class="text-white text-decoration-none mx-2">
                <i class="fab fa-x"></i>
              </a>
            </div>
          </div>
          <div class="col-md-4">
            <p class="mb-0">© 2025 HUERTO HOGAR</p>
            <p class="mb-0">Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
