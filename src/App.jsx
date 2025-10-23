import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
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
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;