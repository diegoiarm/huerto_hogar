import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../src/api_rest";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/panel");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await login({ email, password });
      // Asumiendo que el backend devuelve el token en response.data.token o similar
      // Ajustar según la respuesta real del backend.
      // Si el backend devuelve el token directamente o en un objeto
      const token = response.data.token || response.data; 
      
      localStorage.setItem("token", token);
      // Guardar usuario si viene en la respuesta, opcional
      // localStorage.setItem("user", JSON.stringify(response.data.user));
      
      window.dispatchEvent(new Event("authChange"));
      navigate("/panel");
    } catch (err) {
      console.error("Login error:", err);
      setError("Credenciales inválidas o error en el servidor.");
    }
  };

  return (
    <main className="container my-5">
      <section className="section-bg mx-auto" style={{ maxWidth: 560 }}>
        <h1 className="h3 text-center mb-3">Iniciar sesión</h1>
        <p className="text-secondary text-center mb-4">
          Accede con tu correo y contraseña.
        </p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form id="frmLogin" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="txtEmail" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="txtEmail"
              name="txtEmail"
              placeholder="ej: juanito@duoc.cl"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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
