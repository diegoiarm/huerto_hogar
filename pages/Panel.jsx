import { useEffect } from "react";
import { initPanelPage } from "../js/panel-admin";

function Panel() {
  useEffect(() => {
    initPanelPage(); // verifica sesión, renderiza según rol y ata listeners
  }, []);

  return (
    <main className="container my-5">
      {/* PANEL ADMIN */}
      <section id="adminView" className="section-bg hidden">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="h3 mb-0">Panel de Administración</h1>
          <span className="badge bg-warning text-dark">Admin</span>
        </div>
        <p className="text-secondary">Gestión básica de los usuarios nuevos y registrados.</p>

        <div className="card p-3 mb-4">
          <div className="d-flex flex-column flex-md-row gap-2 align-items-md-center">
            <div className="flex-grow-1">
              <label className="form-label">Nuevo usuario</label>
              <div className="row g-2">
                <div className="col-md-4">
                  <input id="nuEmail" className="form-control" placeholder="email@dominio.com" />
                </div>
                <div className="col-md-3">
                  <input id="nuPass" className="form-control" placeholder="contraseña" />
                </div>
                <div className="col-md-3">
                  <select id="nuRole" className="form-select">
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </div>
                <div className="col-md-2 d-grid">
                  <button id="btnCrearUsuario" className="btn btn-primary">Crear</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="h5 mb-3">Usuarios registrados</h2>
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead className="table-light">
              <tr>
                <th>Email</th>
                <th>Rol</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody id="tblUsers"></tbody>
          </table>
        </div>
      </section>

      {/* PANEL USUARIO */}
      <section id="userView" className="section-bg hidden">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="h3 mb-0">Panel de Usuario</h1>
          <span className="badge bg-info text-dark">Usuario</span>
        </div>
        <p className="text-secondary">
          Bienvenido/a. Aquí puedes agregar tu contenido de usuario (favoritos, pedidos, notas, etc.).
        </p>

        <div className="card p-3">
          <h2 className="h6">Mis notas (demo)</h2>
          <form className="row g-2" id="frmNotas">
            <div className="col-9 col-md-10">
              <input id="txtNota" className="form-control" placeholder="Escribe una nota..." />
            </div>
            <div className="col-3 col-md-2 d-grid">
              <button className="btn btn-primary" type="submit">Agregar</button>
            </div>
          </form>
          <ul id="listaNotas" className="mt-3 mb-0"></ul>
        </div>
      </section>
    </main>
  );
}

export default Panel;
