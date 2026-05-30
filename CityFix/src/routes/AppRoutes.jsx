import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../modules/auth/pages/login";
import CriarConta from "../modules/auth/pages/CriarConta";
import EsqueceuSenha from "../modules/auth/pages/EsqueceuSenha";
import Home from "../modules/dashboard/pages/Home";
import Perfil from "../modules/profile/pages/perfil";
import Sobre from "../modules/dashboard/pages/sobre";
import RegistrarDenuncia from "../modules/dashboard/pages/RegistrarDenuncia";


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/criar-conta" element={<CriarConta />} />
        <Route path="/esqueci-senha" element={<EsqueceuSenha />} />
        <Route path="/registrar-denuncia" element={<RegistrarDenuncia />} />

        {/* HOME */}
        <Route path="/home" element={<Home />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/sobre" element={<Sobre />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;