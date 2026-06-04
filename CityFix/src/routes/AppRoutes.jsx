import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../modules/auth/pages/login";
import CriarConta from "../modules/auth/pages/CriarConta";
import EsqueceuSenha from "../modules/auth/pages/EsqueceuSenha";
import Home from "../modules/dashboard/pages/Home";
import Perfil from "../modules/profile/pages/perfil";
import Sobre from "../modules/dashboard/pages/sobre";
import RegistrarDenuncia from "../modules/dashboard/pages/RegistrarDenuncia";
import DenunciasPublicas from "../modules/dashboard/pages/DenunciasPublicas";
import Admin from "../modules/admin/pages/admin";
import NovaSenha from "../modules/auth/pages/NovaSenha";


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/criar-conta" element={<CriarConta />} />
        <Route path="/esqueci-senha" element={<EsqueceuSenha />} />
        <Route path="/registrar-denuncia" element={<RegistrarDenuncia />} />
        <Route path="/denuncias-publicas" element={<DenunciasPublicas />} />
        <Route path="/nova-senha" element={<NovaSenha />} />

        {/* HOME */}
        <Route path="/home" element={<Home />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;