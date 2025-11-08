import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { initLoginPage, validarTodo, getSession } from "../js/login";

function Login() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Verificar si ya hay una sesión activa
    const session = getSession();
    if (session) {
      navigate('/panel');
      return;
    }
    initLoginPage();
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    validarTodo(); 
  };

  return (
    <main className="container my-5">
      <section className="section-bg mx-auto" style={{ maxWidth: 560 }}>
        <h1 className="h3 text-center mb-3">Iniciar sesión</h1>
        <p className="text-secondary text-center mb-4">
          Accede con tu correo y contraseña. Si tus credenciales son de administrador, verás el panel correspondiente.
        </p>

        <form id="frmLogin" onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="txtEmail" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="txtEmail"
              name="txtEmail"
              placeholder="ej: juanito@duoc.cl"
              required
              maxLength={100}
            />
            <div className="invalid-feedback" id="emailError"></div>
          </div>

          <div className="mb-3">
            <label htmlFor="txtPass" className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="txtPass"
              name="txtPass"
              placeholder="tu contraseña"
              required
              minLength={4}
              maxLength={10}
            />
            <div className="invalid-feedback" id="passError"></div>
          </div>

          <button type="submit" className="btn btn-primary w-100">Entrar</button>

          <div className="mt-3 text-secondary small">
            Usuarios de prueba: <b>admin</b> juanito@duoc.cl / 1234 &nbsp;|&nbsp; <b>user</b> maria@duoc.cl / abcd
          </div>
        </form>
      </section>
    </main>
  );
}

export default Login;
