import { useState } from "react";
import { useNavigate } from "react-router-dom";

function FormularioDireccion() {
  const [formData, setFormData] = useState({
    direccion: "",
    comuna: "",
    region: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const cambio = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const enviarDatos = (e) => {
    e.preventDefault();

    if (formData.direccion.trim().length < 5) {
      setError("La dirección debe tener al menos 5 caracteres.");
      return;
    }

    // Aquí simulamos una compra exitosa:
    const compraExitosa = true;

    if (compraExitosa) {
      navigate("/compra-exitosa");
    } else {
      navigate("/compra-fallida");
    }
  };

  return (
    <main>
      <h1>Formulario de Dirección</h1>

      {error && <p style={{ color: "tomato" }}>{error}</p>}

      <form onSubmit={enviarDatos}>
        <label htmlFor="direccion">Dirección:</label>
        <input
          type="text"
          id="direccion"
          name="direccion"
          value={formData.direccion}
          onChange={cambio}
        />

        <label htmlFor="comuna">Comuna:</label>
        <input
          type="text"
          id="comuna"
          name="comuna"
          value={formData.comuna}
          onChange={cambio}
        />

        <label htmlFor="region">Región:</label>
        <input
          type="text"
          id="region"
          name="region"
          value={formData.region}
          onChange={cambio}
        />

        <input type="submit" value="Confirmar Compra" />
        <input type="reset" value="Limpiar" />
      </form>
    </main>
  );
}

export default FormularioDireccion;
