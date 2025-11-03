import { useEffect } from "react";
import { initRegistroPage, registrarUsuario } from "../js/registro";

function Registro() {
  useEffect(() => {
    initRegistroPage();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    registrarUsuario(); 
  };

  return (
    <main className="container my-5">
      <section className="section-bg mx-auto" style={{ maxWidth: 720 }}>
        <h1 className="h4 mb-3 text-center">Registro de usuario</h1>

        <form id="frmRegistro" onSubmit={handleSubmit} noValidate>
          <div className="row g-3">
            <div className="col-12">
              <label htmlFor="txtNombre" className="form-label">Nombre completo</label>
              <input type="text" className="form-control" id="txtNombre" required minLength={2} maxLength={50} placeholder="Ingrese su nombre completo" />
            </div>

            <div className="col-12">
              <label htmlFor="txtRut" className="form-label">RUT</label>
              <input type="text" className="form-control" id="txtRut" required maxLength={12} placeholder="ej: 12.345.678-9" />
            </div>

            <div className="col-12">
              <label htmlFor="txtEmail" className="form-label">Correo</label>
              <input type="email" className="form-control" id="txtEmail" required maxLength={100} placeholder="ej: nombre@duoc.cl" />
            </div>

            <div className="col-md-6">
              <label htmlFor="txtPass1" className="form-label">Contraseña</label>
              <input type="password" className="form-control" id="txtPass1" required minLength={4} maxLength={10} placeholder="entre 4 y 10 caracteres" />
            </div>
            <div className="col-md-6">
              <label htmlFor="txtPass2" className="form-label">Confirmar contraseña</label>
              <input type="password" className="form-control" id="txtPass2" required minLength={4} maxLength={10} />
            </div>

            <div className="col-md-6">
              <label htmlFor="txtTelefono" className="form-label">Teléfono (opcional)</label>
              <input type="tel" className="form-control" id="txtTelefono" placeholder="+56 9 1234 5678"
                     pattern="(\+56\s?)?9\s?\d{4}\s?\d{4}" title="Formato: +56 9 1234 5678 o 9 1234 5678" />
            </div>

            <div className="col-md-6">
              <label htmlFor="selRegion" className="form-label">Región</label>
              <select id="selRegion" className="form-select" required>
                <option value="">— Seleccione la región —</option>
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="selComuna" className="form-label">Comuna</label>
              <select id="selComuna" className="form-select" required>
                <option value="">— Seleccione la comuna —</option>
              </select>
            </div>

            <div className="col-12">
              <button className="btn btn-primary w-100" type="submit">Registrar</button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Registro;
