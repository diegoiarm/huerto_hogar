import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./css/styles.css";
import "./css/visual.css";

import Home from "../pages/Home";
import NavBar from "../pages/NavBar";
import Footer from "../pages/Footer";
import Blog from "../pages/Blog";
import Dato1 from "../pages/Dato1";
import Dato2 from "../pages/Dato2";
import Nosotros from "../pages/Nosotros";
import Productos from "../pages/Productos";
import Carrito from "../pages/Carrito";
import FormularioDireccion from "../pages/FormularioDireccion";
import CompraExitosa from "../pages/CompraExitosa";
import CompraFallida from "../pages/CompraFallida";
import Contacto from "../pages/Contacto";
import Registro from "../pages/Registro";
import Login from "../pages/Login";
import Panel from "../pages/Panel";


import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/dato1" element={<Dato1 />} />
        <Route path="/blog/dato2" element={<Dato2 />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/formulario-direccion" element={<FormularioDireccion />} />
        <Route path="/compra-exitosa" element={<CompraExitosa />} />
        <Route path="/compra-fallida" element={<CompraFallida />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/panel" element={<Panel />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;