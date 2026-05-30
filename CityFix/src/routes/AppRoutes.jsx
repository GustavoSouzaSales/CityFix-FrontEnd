import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../modules/auth/pages/login";
import CriarConta from "../modules/auth/pages/CriarConta";
import EsqueceuSenha from "../modules/auth/pages/EsqueceuSenha";
import Home from "../modules/dashboard/pages/Home";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/criar-conta" element={<CriarConta />} />
        <Route path="/esqueci-senha" element={<EsqueceuSenha />} />

        {/* HOME */}
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;