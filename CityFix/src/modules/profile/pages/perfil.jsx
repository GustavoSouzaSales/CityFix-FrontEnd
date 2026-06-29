import "../styles/perfil.css";
import { useEffect, useState, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, CircleMarker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import NavBar from "../../dashboard/components/NavBar";
import Notificacoes from "../../dashboard/components/Notificacao";

function Toast({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.type}`}>
          <span className="toast-icon">{t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}</span>
          <span className="toast-msg">{t.message}</span>
          <button className="toast-close" onClick={() => removeToast(t.id)}>✕</button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);
  const removeToast = useCallback((id) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);
  return { toasts, addToast, removeToast };
}

function EyeIcon({ visible }) {
  if (!visible) return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function calcularForca(senha) {
  if (!senha) return { nivel: 0, label: "", cor: "" };
  let score = 0;
  if (senha.length >= 8)  score++;
  if (senha.length >= 12) score++;
  if (/[A-Z]/.test(senha)) score++;
  if (/[0-9]/.test(senha)) score++;
  if (/[^A-Za-z0-9]/.test(senha)) score++;
  if (score <= 1) return { nivel: 1, label: "Fraca", cor: "forca--fraca" };
  if (score <= 3) return { nivel: 2, label: "Média", cor: "forca--media" };
  return { nivel: 3, label: "Forte", cor: "forca--forte" };
}

function BarraForca({ senha }) {
  const { nivel, label, cor } = calcularForca(senha);
  if (!senha) return null;
  return (
    <div className="barra-forca-wrap">
      <div className="barra-forca-tracks">
        {[1, 2, 3].map((i) => <div key={i} className={`barra-forca-track ${i <= nivel ? cor : ""}`} />)}
      </div>
      <span className={`barra-forca-label ${cor}`}>{label}</span>
    </div>
  );
}

function IconComment() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}
function IconHeart({ filled }) {
  return filled ? (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="#ff6b6b" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ) : (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}
function IconSend() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  );
}
function IconEdit() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}
function IconTrash() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
    </svg>
  );
}

function mascararTelefone(valor) {
  const digits = valor.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`;
  return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
}
function formatarStatus(s) {
  if (s === "ABERTA") return "Aberta";
  if (s === "EM_ANDAMENTO") return "Em andamento";
  if (s === "RESOLVIDA") return "Resolvida";
  return s;
}
function classeStatus(s) {
  if (s === "ABERTA") return "aberta";
  if (s === "EM_ANDAMENTO") return "andamento";
  if (s === "RESOLVIDA") return "resolvida";
  return "";
}
function formatarData(data) {
  if (!data) return "Data não informada";
  return new Date(data).toLocaleDateString("pt-BR");
}

function ConfirmModal({ aberto, onConfirmar, onCancelar, titulo = "Apagar comentário", mensagem = "Esta ação não pode ser desfeita. Deseja apagar este comentário?" }) {
  if (!aberto) return null;
  return (
    <div className="perfil-confirm-overlay" onClick={onCancelar}>
      <div className="perfil-confirm-box" onClick={(e) => e.stopPropagation()}>
        <div className="perfil-confirm-icon"><IconTrash /></div>
        <h3 className="perfil-confirm-title">{titulo}</h3>
        <p className="perfil-confirm-msg">{mensagem}</p>
        <div className="perfil-confirm-actions">
          <button className="perfil-confirm-cancel" onClick={onCancelar}>Cancelar</button>
          <button className="perfil-confirm-delete" onClick={onConfirmar}>Apagar</button>
        </div>
      </div>
    </div>
  );
}

function Perfil() {
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  const [modalAberto, setModalAberto] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [modalDenunciasAberto, setModalDenunciasAberto] = useState(false);

  const [usuario, setUsuario] = useState({ nome: "", email: "", telefone: "", cidade: "" });
  const [formUsuario, setFormUsuario] = useState({ nome: "", email: "", telefone: "", cidade: "" });

  const [minhasDenuncias, setMinhasDenuncias] = useState([]);
  const [abaDenuncia, setAbaDenuncia] = useState("Todas");
  const [categorias, setCategorias] = useState([]);

  const [modalEditarDenuncia, setModalEditarDenuncia] = useState(false);
  const [denunciaEditando, setDenunciaEditando] = useState(null);
  const [formDenuncia, setFormDenuncia] = useState({ titulo: "", descricao: "", localizacao: "", categoriaId: "" });

  /* ── Mapa no modal de edição ── */
  const [mostrarMapaEdicao, setMostrarMapaEdicao] = useState(false);
  const [coordenadasEdicao, setCoordenadasEdicao] = useState(null);
  const [latitudeEdicao, setLatitudeEdicao] = useState("");
  const [longitudeEdicao, setLongitudeEdicao] = useState("");

  /* ── Imagens no modal de edição ── */
  const fileInputEdicaoRef = useRef(null);
  const [imagensParaDeletar, setImagensParaDeletar] = useState([]);
  const [novasImagens, setNovasImagens] = useState([]);

  const [confirm, setConfirm] = useState({ aberto: false, comentarioId: null });
  const [confirmDenuncia, setConfirmDenuncia] = useState({ aberto: false, denuncia: null });

  const [totaisComentarios, setTotaisComentarios] = useState({});
  const [totaisCurtidas, setTotaisCurtidas] = useState({});
  const [curtidasUsuario, setCurtidasUsuario] = useState({});

  const [denunciaDetalhe, setDenunciaDetalhe] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState("");
  const [comentarioEditandoId, setComentarioEditandoId] = useState(null);
  const [textoEditando, setTextoEditando] = useState("");

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [verSenhaAtual, setVerSenhaAtual] = useState(false);
  const [verNovaSenha, setVerNovaSenha] = useState(false);
  const [verConfirmarSenha, setVerConfirmarSenha] = useState(false);
  const [erroConfirmar, setErroConfirmar] = useState("");
  const [imagemAberta, setImagemAberta] = useState(null);

  const API_COMENTARIOS = "http://localhost:8080/comentarios";
  const API_CURTIDAS    = "http://localhost:8080/curtidas";
  const API_DENUNCIAS   = "http://localhost:8080/denuncias";
  const API_CATEGORIAS  = "http://localhost:8080/categorias";

  function usuarioLogadoLocal() { return JSON.parse(localStorage.getItem("usuario")); }
  function usuarioIdLogado() { const u = usuarioLogadoLocal(); return u?.id || u?.usuarioId; }
  function usuarioEhAdmin() { return usuarioLogadoLocal()?.tipoUsuario === "ADMINISTRADOR"; }
  function podeEditarComentario(c) { return c.usuarioId === usuarioIdLogado(); }
  function podeApagarComentario(c) { return c.usuarioId === usuarioIdLogado() || usuarioEhAdmin(); }
  function podeEditarDenuncia(d) { return d.usuario?.id === usuarioIdLogado(); }
  function podeExcluirDenuncia(d) { return d.usuario?.id === usuarioIdLogado() || usuarioEhAdmin(); }

  async function carregarInteracoes(denuncias, uid) {
    const ct = {}, cu = {}, cuu = {};
    await Promise.all(denuncias.map(async (d) => {
      try {
        const rc = await fetch(`${API_COMENTARIOS}/denuncia/${d.id}/total`);
        ct[d.id] = await rc.json();
        const rcu = await fetch(`${API_CURTIDAS}/denuncia/${d.id}/total`);
        cu[d.id] = await rcu.json();
        if (uid) {
          const ru = await fetch(`${API_CURTIDAS}/denuncia/${d.id}/usuario/${uid}`);
          cuu[d.id] = await ru.json();
        }
      } catch { ct[d.id] = 0; cu[d.id] = 0; cuu[d.id] = false; }
    }));
    setTotaisComentarios(ct);
    setTotaisCurtidas(cu);
    setCurtidasUsuario(cuu);
  }

  async function carregarDados() {
    const u = JSON.parse(localStorage.getItem("usuario"));
    if (!u) return;
    setUsuario(u);
    setFormUsuario(u);
    try {
      const resCat = await fetch(API_CATEGORIAS);
      const dataCat = await resCat.json();
      setCategorias(Array.isArray(dataCat) ? dataCat : []);
      const resDen = await fetch(`${API_DENUNCIAS}/usuario/${u.id}`);
      const denuncias = await resDen.json();
      setMinhasDenuncias(Array.isArray(denuncias) ? denuncias : []);
      await carregarInteracoes(Array.isArray(denuncias) ? denuncias : [], u.id || u.usuarioId);
    } catch { addToast("Erro ao carregar dados do perfil.", "error"); }
  }

  useEffect(() => { carregarDados(); }, []);

  function abrirDetalhesDenuncia(denuncia) {
    setDenunciaDetalhe(denuncia);
    setNovoComentario(""); setComentarioEditandoId(null); setTextoEditando("");
    fetch(`${API_COMENTARIOS}/denuncia/${denuncia.id}`)
      .then((r) => r.json())
      .then((data) => setComentarios(Array.isArray(data) ? data : []))
      .catch(() => addToast("Erro ao carregar comentários.", "error"));
  }

  function fecharDetalhesDenuncia() {
    setDenunciaDetalhe(null); setComentarios([]);
    setNovoComentario(""); setComentarioEditandoId(null); setTextoEditando("");
  }

  async function enviarComentario() {
    const uid = usuarioIdLogado();
    const denunciaId = denunciaDetalhe?.id;
    if (!uid) { addToast("Você precisa estar logado para comentar.", "error"); return; }
    if (!novoComentario.trim()) { addToast("Digite um comentário.", "error"); return; }
    try {
      const r = await fetch(API_COMENTARIOS, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: novoComentario, usuarioId: uid, denunciaId }),
      });
      if (!r.ok) { addToast("Erro ao enviar comentário.", "error"); return; }
      const salvo = await r.json();
      setComentarios((p) => [salvo, ...p]);
      setNovoComentario("");
      setTotaisComentarios((p) => ({ ...p, [denunciaId]: (p[denunciaId] || 0) + 1 }));
      addToast("Comentário enviado!", "success");
    } catch { addToast("Erro ao enviar comentário.", "error"); }
  }

  function iniciarEdicao(c) { setComentarioEditandoId(c.id); setTextoEditando(c.texto); }
  function cancelarEdicao() { setComentarioEditandoId(null); setTextoEditando(""); }

  async function salvarEdicao(cid) {
    const uid = usuarioIdLogado();
    const denunciaId = denunciaDetalhe?.id;
    if (!textoEditando.trim()) { addToast("O comentário não pode ficar vazio.", "error"); return; }
    try {
      const r = await fetch(`${API_COMENTARIOS}/${cid}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: textoEditando, usuarioId: uid, denunciaId }),
      });
      if (!r.ok) { addToast("Erro ao editar comentário.", "error"); return; }
      const atualizado = await r.json();
      setComentarios((p) => p.map((c) => (c.id === cid ? atualizado : c)));
      cancelarEdicao();
      addToast("Comentário editado!", "success");
    } catch { addToast("Erro ao editar comentário.", "error"); }
  }

  function apagarComentario(cid) { setConfirm({ aberto: true, comentarioId: cid }); }

  async function confirmarApagar() {
    const uid = usuarioIdLogado();
    const denunciaId = denunciaDetalhe?.id;
    const { comentarioId } = confirm;
    setConfirm({ aberto: false, comentarioId: null });
    try {
      const r = await fetch(`${API_COMENTARIOS}/${comentarioId}/usuario/${uid}`, { method: "DELETE" });
      if (!r.ok) { addToast("Erro ao apagar comentário.", "error"); return; }
      setComentarios((p) => p.filter((c) => c.id !== comentarioId));
      if (denunciaId) setTotaisComentarios((p) => ({ ...p, [denunciaId]: Math.max((p[denunciaId] || 1) - 1, 0) }));
      addToast("Comentário apagado.", "info");
    } catch { addToast("Erro ao apagar comentário.", "error"); }
  }

  async function alternarCurtida(denunciaId) {
    const uid = usuarioIdLogado();
    if (!uid) { addToast("Você precisa estar logado para curtir.", "error"); return; }
    const jaCurtiu = curtidasUsuario[denunciaId];
    try {
      const r = await fetch(API_CURTIDAS, {
        method: jaCurtiu ? "DELETE" : "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuarioId: uid, denunciaId }),
      });
      if (!r.ok) { addToast("Erro ao atualizar curtida.", "error"); return; }
      setCurtidasUsuario((p) => ({ ...p, [denunciaId]: !jaCurtiu }));
      setTotaisCurtidas((p) => ({ ...p, [denunciaId]: jaCurtiu ? Math.max((p[denunciaId]||1)-1,0) : (p[denunciaId]||0)+1 }));
    } catch { addToast("Erro ao atualizar curtida.", "error"); }
  }

  async function buscarEnderecoEdicao(lat, lng) {
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=pt-BR`);
      const data = await r.json();
      setFormDenuncia(p => ({ ...p, localizacao: data?.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}` }));
    } catch {
      setFormDenuncia(p => ({ ...p, localizacao: `${lat.toFixed(6)}, ${lng.toFixed(6)}` }));
    }
  }

  function LocationPickerEdicao() {
    useMapEvents({
      click(e) {
        const lat = e.latlng.lat, lng = e.latlng.lng;
        setCoordenadasEdicao([lat, lng]);
        setLatitudeEdicao(lat.toFixed(6));
        setLongitudeEdicao(lng.toFixed(6));
        buscarEnderecoEdicao(lat, lng);
        setMostrarMapaEdicao(false);
      },
    });
    return null;
  }

  function abrirEditarDenuncia(denuncia) {
    if (!podeEditarDenuncia(denuncia)) { addToast("Você só pode editar denúncias criadas por você.", "error"); return; }
    setDenunciaEditando(denuncia);
    setFormDenuncia({ titulo: denuncia.titulo || "", descricao: denuncia.descricao || "", localizacao: denuncia.localizacao || "", categoriaId: denuncia.categoria?.id || "" });
    setLatitudeEdicao(denuncia.latitude || "");
    setLongitudeEdicao(denuncia.longitude || "");
    setCoordenadasEdicao(denuncia.latitude && denuncia.longitude ? [Number(denuncia.latitude), Number(denuncia.longitude)] : null);
    setImagensParaDeletar([]);
    setNovasImagens([]);
    setModalEditarDenuncia(true);
  }

  function fecharEditarDenuncia() {
    setModalEditarDenuncia(false); setDenunciaEditando(null);
    setFormDenuncia({ titulo: "", descricao: "", localizacao: "", categoriaId: "" });
    setLatitudeEdicao(""); setLongitudeEdicao(""); setCoordenadasEdicao(null);
    setImagensParaDeletar([]); setNovasImagens([]);
    setMostrarMapaEdicao(false);
  }

  async function salvarDenunciaEditada() {
    if (!denunciaEditando) return;
    if (!formDenuncia.titulo.trim() || !formDenuncia.descricao.trim() || !formDenuncia.localizacao.trim() || !formDenuncia.categoriaId) {
      addToast("Preencha todos os campos da denúncia.", "error"); return;
    }
    try {
      // 1. Atualiza dados básicos via JSON
      const r = await fetch(`${API_DENUNCIAS}/${denunciaEditando.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: formDenuncia.titulo,
          descricao: formDenuncia.descricao,
          localizacao: formDenuncia.localizacao,
          categoriaId: Number(formDenuncia.categoriaId),
          usuarioId: usuarioIdLogado(),
          latitude: latitudeEdicao ? Number(latitudeEdicao) : null,
          longitude: longitudeEdicao ? Number(longitudeEdicao) : null,
        }),
      });
      if (!r.ok) { addToast("Não foi possível editar a denúncia.", "error"); return; }
      let atualizada = await r.json();

      // 2. Remove imagens marcadas para deletar
      for (const imgId of imagensParaDeletar) {
        try {
          await fetch(`${API_DENUNCIAS}/${denunciaEditando.id}/imagens/${imgId}`, { method: "DELETE" });
        } catch { /* ignora falha individual */ }
      }

      // 3. Adiciona novas imagens
      if (novasImagens.length > 0) {
        const formData = new FormData();
        novasImagens.forEach(img => formData.append("imagens", img));
        try {
          const rImg = await fetch(`${API_DENUNCIAS}/${denunciaEditando.id}/imagens`, { method: "POST", body: formData });
          if (rImg.ok) atualizada = await rImg.json();
        } catch { /* ignora falha de imagem */ }
      }

      // 4. Recarrega a denúncia atualizada do servidor para pegar imagens finais
      try {
        const rFinal = await fetch(`${API_DENUNCIAS}/${denunciaEditando.id}`);
        if (rFinal.ok) atualizada = await rFinal.json();
      } catch { /* usa a versão que temos */ }

      setMinhasDenuncias((p) => p.map((d) => (d.id === atualizada.id ? atualizada : d)));
      if (denunciaDetalhe?.id === atualizada.id) setDenunciaDetalhe(atualizada);
      addToast("Denúncia editada com sucesso!", "success");
      fecharEditarDenuncia();
    } catch { addToast("Falha na conexão ao editar denúncia.", "error"); }
  }

  function pedirExcluirDenuncia(denuncia) {
    if (!podeExcluirDenuncia(denuncia)) { addToast("Você não tem permissão para excluir esta denúncia.", "error"); return; }
    setConfirmDenuncia({ aberto: true, denuncia });
  }

  async function confirmarExcluirDenuncia() {
    const denuncia = confirmDenuncia.denuncia;
    if (!denuncia) return;
    setConfirmDenuncia({ aberto: false, denuncia: null });
    try {
      const r = await fetch(`${API_DENUNCIAS}/${denuncia.id}`, { method: "DELETE" });
      if (!r.ok) { addToast("Não foi possível excluir a denúncia.", "error"); return; }
      setMinhasDenuncias((p) => p.filter((d) => d.id !== denuncia.id));
      if (denunciaDetalhe?.id === denuncia.id) fecharDetalhesDenuncia();
      addToast("Denúncia excluída com sucesso.", "success");
    } catch { addToast("Falha na conexão ao excluir denúncia.", "error"); }
  }

  function abrirModal() { setFormUsuario(usuario); setModalAberto(true); }
  function fecharModal() {
    setModalAberto(false); setMostrarSenha(false);
    setVerSenhaAtual(false); setVerNovaSenha(false); setVerConfirmarSenha(false);
    setSenhaAtual(""); setNovaSenha(""); setConfirmarSenha(""); setErroConfirmar("");
  }
  function handleConfirmarSenha(val) { setConfirmarSenha(val); setErroConfirmar(val && val !== novaSenha ? "As senhas não coincidem." : ""); }
  function handleNovaSenha(val) { setNovaSenha(val); setErroConfirmar(confirmarSenha && val !== confirmarSenha ? "As senhas não coincidem." : ""); }

  async function salvarAlteracoes(e) {
    e.preventDefault();
    if (mostrarSenha) {
      if (novaSenha.length < 8) { addToast("A nova senha deve ter no mínimo 8 caracteres.", "error"); return; }
      if (novaSenha !== confirmarSenha) { addToast("As senhas não coincidem. Verifique e tente novamente.", "error"); return; }
    }
    try {
      const r = await fetch(`http://localhost:8080/usuarios/${usuario.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formUsuario),
      });
      if (!r.ok) { addToast("Não foi possível atualizar o perfil. Tente novamente.", "error"); return; }
      const usuarioAtualizado = await r.json();
      if (mostrarSenha) {
        const rs = await fetch(`http://localhost:8080/usuarios/${usuario.id}/senha`, {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ senhaAtual, novaSenha, confirmarSenha }),
        });
        if (!rs.ok) { addToast("Senha atual incorreta ou dados inválidos.", "error"); return; }
      }
      setUsuario(usuarioAtualizado); setFormUsuario(usuarioAtualizado);
      localStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));
      addToast("Perfil atualizado com sucesso!", "success");
      fecharModal();
    } catch { addToast("Falha na conexão com o servidor.", "error"); }
  }

  const iniciais = usuario.nome ? usuario.nome.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "??";

  const denunciasFiltradas = abaDenuncia === "Todas" ? minhasDenuncias
    : minhasDenuncias.filter((d) => {
        if (abaDenuncia === "Aberta") return d.status === "ABERTA";
        if (abaDenuncia === "Em andamento") return d.status === "EM_ANDAMENTO";
        if (abaDenuncia === "Resolvida") return d.status === "RESOLVIDA";
        return true;
      });

  const totalDenuncias  = minhasDenuncias.length;
  const totalAbertas    = minhasDenuncias.filter((d) => d.status === "ABERTA").length;
  const totalAndamento  = minhasDenuncias.filter((d) => d.status === "EM_ANDAMENTO").length;
  const totalResolvidas = minhasDenuncias.filter((d) => d.status === "RESOLVIDA").length;

  const stats = [
    { emoji: "📋", valor: totalDenuncias,  label: "Denúncias feitas", cor: "stat--blue"   },
    { emoji: "🟡", valor: totalAndamento,  label: "Em andamento",     cor: "stat--yellow" },
    { emoji: "✅", valor: totalResolvidas, label: "Resolvidas",        cor: "stat--green"  },
    { emoji: "🔴", valor: totalAbertas,    label: "Abertas",           cor: "stat--red"    },
  ];
  const senhasIguais = novaSenha && confirmarSenha && novaSenha === confirmarSenha;

  return (
    <div className="perfil-page">
      <NavBar />
      <Toast toasts={toasts} removeToast={removeToast} />

      <main className="perfil-main">
        <header className="perfil-header">
  <div className="perfil-header-eyebrow">
    {usuario.tipoUsuario === "ADMINISTRADOR"
      ? "Painel do administrador"
      : "Painel do cidadão"}
  </div>

  <h1>Meu Perfil</h1>

  <p>
    {usuario.tipoUsuario === "ADMINISTRADOR"
      ? "Gerencie sua conta e acompanhe as denúncias do sistema."
      : "Gerencie seus dados e acompanhe suas denúncias."}
  </p>
</header>

        <section className="perfil-layout">
          <aside className="perfil-user-card">
            <div className="perfil-avatar-wrap">
              <div className="perfil-avatar">{iniciais}</div>
              <div className="perfil-avatar-ring" />
            </div>
            <h2 className="perfil-nome">{usuario.nome}</h2>
            <p className="perfil-email">{usuario.email}</p>
            <div className={usuario.tipoUsuario === "ADMINISTRADOR" ? "perfil-badge perfil-badge-admin" : "perfil-badge"}>
              👤 {usuario.tipoUsuario === "ADMINISTRADOR" ? "Administrador" : "Cidadão"}
            </div>
            <div className="perfil-divider" />
            <div className="perfil-info">
              <div className="perfil-info-item"><span className="info-icon">📍</span><span>{usuario.cidade || "Cidade não informada"}</span></div>
              <div className="perfil-info-item"><span className="info-icon">📞</span><span>{usuario.telefone || "Telefone não informado"}</span></div>
            </div>
            <div className="perfil-divider" />
            <button className="btn-editar" onClick={abrirModal}>✏️ Editar perfil</button>
          </aside>

          <section className="perfil-content">
            <div className="perfil-stats">
              {stats.map((s) => (
                <article key={s.label} className={`stat-card ${s.cor}`}>
                  <span className="stat-emoji">{s.emoji}</span>
                  <h3 className="stat-num">{s.valor}</h3>
                  <p className="stat-label">{s.label}</p>
                </article>
              ))}
            </div>

            <section className="perfil-section">
              <div className="section-title">
                <div className="section-title-left">
                  <span className="section-icon">📋</span>
                  <h2>Minhas denúncias</h2>
                </div>
                <button className="btn-ver-todas" onClick={() => setModalDenunciasAberto(true)}>Ver todas →</button>
              </div>

              <div className="denuncias-list">
                {minhasDenuncias.length > 0 ? (
                  minhasDenuncias.map((d) => (
                    <article className="denuncia-item" key={d.id}>
                      {/* Thumbnail lateral */}
                      {d.imagens?.length > 0 ? (
                        <img src={d.imagens[0].imagemUrl} alt={d.titulo} className="denuncia-item-thumb" onClick={() => setImagemAberta(d.imagens[0].imagemUrl)} />
                      ) : (
                        <div className="denuncia-item-thumb-placeholder">📋</div>
                      )}
                      <div className="denuncia-left">
                        <h3>{d.titulo}</h3>
                        <p>{d.localizacao}</p>
                        <small>{formatarData(d.dataCriacao)}</small>
                        <div className="denuncia-item-acoes">
                          {podeEditarDenuncia(d) && (
                            <button type="button" className="perfil-editar-denuncia-btn" onClick={() => abrirEditarDenuncia(d)}>
                              <IconEdit /> Editar
                            </button>
                          )}
                          {podeExcluirDenuncia(d) && (
                            <button type="button" className="perfil-excluir-denuncia-btn" onClick={() => pedirExcluirDenuncia(d)}>
                              <IconTrash /> Excluir
                            </button>
                          )}
                        </div>
                      </div>
                      <span className={`perfil-status ${classeStatus(d.status)}`}>{formatarStatus(d.status)}</span>
                    </article>
                  ))
                ) : (
                  <p>Nenhuma denúncia registrada ainda.</p>
                )}
              </div>
            </section>

            <section className="perfil-section">
              <div className="section-title">
                <div className="section-title-left">
                  <span className="section-icon">⚙️</span>
                  <h2>Configurações da conta</h2>
                </div>
              </div>
              <div className="config-list">
                <button className="config-btn" onClick={() => { abrirModal(); setMostrarSenha(true); }}>
                  <span className="config-btn-icon">🔐</span>
                  <div className="config-btn-text"><strong>Alterar senha</strong><small>Atualize sua senha de acesso</small></div>
                  <span className="config-btn-arrow">›</span>
                </button>
                <div className="config-btn-notif-wrap">
                  <button className="config-btn" onClick={() => { const bell = document.querySelector(".perfil-notif-anchor .notif-bell"); if (bell) bell.click(); }}>
                    <span className="config-btn-icon">🔔</span>
                    <div className="config-btn-text"><strong>Notificações</strong><small>Veja suas notificações de denúncias</small></div>
                    <span className="config-btn-arrow">›</span>
                  </button>
                  <div className="perfil-notif-anchor"><Notificacoes /></div>
                </div>
                <button className="config-btn config-btn--danger" onClick={() => { localStorage.removeItem("usuario"); sessionStorage.clear(); navigate("/login"); }}>
                  <span className="config-btn-icon">🚪</span>
                  <div className="config-btn-text"><strong>Sair da conta</strong><small>Encerrar sessão atual</small></div>
                  <span className="config-btn-arrow">›</span>
                </button>
              </div>
            </section>
          </section>
        </section>
      </main>

      {/* ══ MODAL EDITAR PERFIL ══ */}
      {modalAberto && (
        <div className="perfil-modal-overlay" onClick={fecharModal}>
          <div className="perfil-modal" onClick={(e) => e.stopPropagation()}>
            <div className="perfil-modal-header">
              <div><h2>Editar perfil</h2><p>Atualize suas informações pessoais.</p></div>
              <button className="modal-close" onClick={fecharModal}>✕</button>
            </div>
            <form className="perfil-modal-form" onSubmit={salvarAlteracoes}>
              <div className="modal-grid">
                <div className="modal-form-group"><label>Nome</label><input type="text" value={formUsuario.nome || ""} onChange={(e) => setFormUsuario({ ...formUsuario, nome: e.target.value })} /></div>
                <div className="modal-form-group"><label>E-mail</label><input type="email" value={formUsuario.email || ""} onChange={(e) => setFormUsuario({ ...formUsuario, email: e.target.value })} /></div>
                <div className="modal-form-group"><label>Telefone</label><input type="text" value={formUsuario.telefone || ""} placeholder="(XX) XXXXX-XXXX" maxLength={15} onChange={(e) => setFormUsuario({ ...formUsuario, telefone: mascararTelefone(e.target.value) })} /></div>
                <div className="modal-form-group"><label>Cidade onde mora</label><input type="text" value={formUsuario.cidade || ""} onChange={(e) => setFormUsuario({ ...formUsuario, cidade: e.target.value })} /></div>
              </div>
              <div className="password-area">
                <div className="password-area-top">
                  <button type="button" className="change-password-btn" onClick={() => setMostrarSenha(!mostrarSenha)}>🔐 {mostrarSenha ? "Ocultar campos de senha" : "Mudar senha"}</button>
                  <Link to="/esqueci-senha" className="forgot-password-modal">Esqueceu sua senha?</Link>
                </div>
                {mostrarSenha && (
                  <div className="modal-grid password-fields">
                    <div className="modal-form-group">
                      <label>Senha atual</label>
                      <div className="input-senha-wrap">
                        <input type={verSenhaAtual ? "text" : "password"} placeholder="Digite sua senha atual" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} />
                        <button type="button" className="olho-btn" onClick={() => setVerSenhaAtual(!verSenhaAtual)}><EyeIcon visible={verSenhaAtual} /></button>
                      </div>
                    </div>
                    <div className="modal-form-group">
                      <label>Nova senha</label>
                      <div className="input-senha-wrap">
                        <input type={verNovaSenha ? "text" : "password"} placeholder="Mínimo de 8 caracteres" value={novaSenha} onChange={(e) => handleNovaSenha(e.target.value)} />
                        <button type="button" className="olho-btn" onClick={() => setVerNovaSenha(!verNovaSenha)}><EyeIcon visible={verNovaSenha} /></button>
                      </div>
                      <BarraForca senha={novaSenha} />
                      {novaSenha && novaSenha.length < 8 && <span className="campo-erro">Mínimo de 8 caracteres</span>}
                    </div>
                    <div className="modal-form-group">
                      <label>Confirmar senha</label>
                      <div className={`input-senha-wrap ${erroConfirmar ? "input-senha-wrap--erro" : ""} ${senhasIguais ? "input-senha-wrap--ok" : ""}`}>
                        <input type={verConfirmarSenha ? "text" : "password"} placeholder="Confirme nova senha" value={confirmarSenha} onChange={(e) => handleConfirmarSenha(e.target.value)} />
                        <button type="button" className="olho-btn" onClick={() => setVerConfirmarSenha(!verConfirmarSenha)}><EyeIcon visible={verConfirmarSenha} /></button>
                      </div>
                      {erroConfirmar && <span className="campo-erro">{erroConfirmar}</span>}
                      {senhasIguais && <span className="campo-ok">Senhas coincidem ✓</span>}
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={fecharModal}>Cancelar</button>
                <button type="submit" className="save-btn">Salvar alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══ CONFIRM MODALS ══ */}
      <ConfirmModal aberto={confirm.aberto} onConfirmar={confirmarApagar} onCancelar={() => setConfirm({ aberto: false, comentarioId: null })} />
      <ConfirmModal aberto={confirmDenuncia.aberto} titulo="Excluir denúncia" mensagem="Deseja excluir esta denúncia? Essa ação não pode ser desfeita." onConfirmar={confirmarExcluirDenuncia} onCancelar={() => setConfirmDenuncia({ aberto: false, denuncia: null })} />

      {/* ══ MODAL VER TODAS ══ */}
      {modalDenunciasAberto && (
        <div className="perfil-modal-overlay" onClick={() => { setModalDenunciasAberto(false); fecharDetalhesDenuncia(); }}>
          <div className="perfil-modal denuncias-modal" onClick={(e) => e.stopPropagation()}>
            <div className="perfil-modal-header">
              <div><h2>Minhas denúncias</h2><p>Acompanhe todas as denúncias registradas por você.</p></div>
              <button className="modal-close" onClick={() => { setModalDenunciasAberto(false); fecharDetalhesDenuncia(); }}>✕</button>
            </div>

            <div className="denuncias-tabs">
              {["Todas", "Aberta", "Em andamento", "Resolvida"].map((aba) => (
                <button key={aba} className={abaDenuncia === aba ? "active" : ""} onClick={() => setAbaDenuncia(aba)}>{aba}</button>
              ))}
            </div>

            <div className="denuncias-modal-list">
              {denunciasFiltradas.map((d) => (
                <article className="denuncia-item perfil-denuncia-click" key={d.id}>
                  <div className="denuncia-left">
                    <h3>{d.titulo}</h3>
                    <p>{d.localizacao}</p>
                    <small>{formatarData(d.dataCriacao)}</small>
                    <div className="perfil-denuncia-interacoes">
                      <span className="perfil-stat-comment"><IconComment /> {totaisComentarios[d.id] || 0}</span>
                      <button type="button" className={`perfil-like-btn ${curtidasUsuario[d.id] ? "perfil-like-btn--active" : ""}`} onClick={(e) => { e.stopPropagation(); alternarCurtida(d.id); }}>
                        <IconHeart filled={!!curtidasUsuario[d.id]} /> {totaisCurtidas[d.id] || 0}
                      </button>
                      <button type="button" className="perfil-ver-comentarios-btn" onClick={() => abrirDetalhesDenuncia(d)}>
                        <IconComment /> Ver comentários
                      </button>
                      {podeEditarDenuncia(d) && (
                        <button type="button" className="perfil-editar-denuncia-btn" onClick={() => abrirEditarDenuncia(d)}>
                          <IconEdit /> Editar
                        </button>
                      )}
                      {podeExcluirDenuncia(d) && (
                        <button type="button" className="perfil-excluir-denuncia-btn" onClick={() => pedirExcluirDenuncia(d)}>
                          <IconTrash /> Excluir
                        </button>
                      )}
                    </div>
                    {d.imagens?.length > 0 && (
                      <div className="perfil-imagens">
                        {d.imagens.map((img) => (
                          <img key={img.id} src={img.imagemUrl} alt={d.titulo} className="perfil-imagem" onClick={() => setImagemAberta(img.imagemUrl)} />
                        ))}
                      </div>
                    )}
                  </div>
                  <span className={`perfil-status ${classeStatus(d.status)}`}>{formatarStatus(d.status)}</span>
                </article>
              ))}
              {denunciasFiltradas.length === 0 && <p>Nenhuma denúncia encontrada nessa aba.</p>}
            </div>

            {/* ── Painel de comentários ── */}
            {denunciaDetalhe && (
              <div className="perfil-detalhe-panel">
                <div className="perfil-detalhe-neon" />
                <div className="perfil-detalhe-header">
                  <div className="perfil-detalhe-header-info">
                    <p className="perfil-detalhe-eyebrow">Comentários da denúncia</p>
                    <h3>{denunciaDetalhe.titulo}</h3>
                    <p className="perfil-detalhe-local">📍 {denunciaDetalhe.localizacao}</p>
                  </div>
                  <button type="button" className="perfil-detalhe-close" onClick={fecharDetalhesDenuncia}>✕ Fechar</button>
                </div>
                <p className="perfil-denuncia-desc">{denunciaDetalhe.descricao}</p>
                <div className="perfil-comentario-form">
                  <div className="perfil-form-avatar">{iniciais}</div>
                  <div className="perfil-form-inner">
                    <textarea placeholder="Escreva um comentário..." value={novoComentario} onChange={(e) => setNovoComentario(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) enviarComentario(); }} />
                    <div className="perfil-form-footer">
                      <span className="perfil-form-hint">Ctrl + Enter para enviar</span>
                      <button type="button" className="perfil-send-btn" onClick={enviarComentario}><IconSend /> Comentar</button>
                    </div>
                  </div>
                </div>
                <div className="perfil-comentarios-label">
                  <IconComment /> Comentários
                  {comentarios.length > 0 && <span className="perfil-count-badge">{comentarios.length}</span>}
                </div>
                <div className="perfil-comentarios-list">
                  {comentarios.length > 0 ? (
                    comentarios.map((comentario, i) => (
                      <div key={comentario.id} className="perfil-comentario-item" style={{ animationDelay: `${i * 0.05}s` }}>
                        <div className="perfil-comentario-avatar">
                          {(comentario.nomeUsuario || "?").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div className="perfil-comentario-content">
                          <div className="perfil-comentario-top">
                            <strong className="perfil-comentario-nome">{comentario.nomeUsuario}</strong>
                            {(podeEditarComentario(comentario) || podeApagarComentario(comentario)) && (
                              <div className="perfil-comentario-actions">
                                {podeEditarComentario(comentario) && (
                                  <button type="button" className="perfil-action-btn perfil-action-btn--edit" onClick={() => iniciarEdicao(comentario)}>
                                    <IconEdit /> Editar
                                  </button>
                                )}
                                {podeApagarComentario(comentario) && (
                                  <button type="button" className="perfil-action-btn perfil-action-btn--delete" onClick={() => apagarComentario(comentario.id)}>
                                    <IconTrash /> Apagar
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                          {comentarioEditandoId === comentario.id ? (
                            <div className="perfil-edit-form">
                              <textarea value={textoEditando} onChange={(e) => setTextoEditando(e.target.value)} />
                              <div className="perfil-edit-actions">
                                <button type="button" className="perfil-edit-save" onClick={() => salvarEdicao(comentario.id)}>Salvar</button>
                                <button type="button" className="perfil-edit-cancel" onClick={cancelarEdicao}>Cancelar</button>
                              </div>
                            </div>
                          ) : (
                            <p className="perfil-comentario-texto">{comentario.texto}</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="perfil-sem-comentarios">
                      <IconComment /><p>Nenhum comentário ainda.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ MODAL EDITAR DENÚNCIA — REDESENHADO ══ */}
      {modalEditarDenuncia && (
        <div className="perfil-modal-overlay" onClick={fecharEditarDenuncia}>
          <div className="perfil-modal perfil-editar-denuncia-modal" onClick={(e) => e.stopPropagation()}>

            {/* Linha neon */}
            <div className="ped-neon" />

            <div className="perfil-modal-header">
              <div>
                <p className="ped-eyebrow">Edição · Denúncia</p>
                <h2>Editar denúncia</h2>
                <p>Atualize as informações da ocorrência registrada.</p>
              </div>
              <button className="modal-close" onClick={fecharEditarDenuncia}>✕</button>
            </div>

            {/* ── Seção 1: Dados básicos ── */}
            <div className="ped-section">
              <div className="ped-section-label">
                <span className="ped-section-dot ped-dot--green" />
                Identificação
              </div>
              <div className="ped-grid">
                <div className="modal-form-group">
                  <label>Título</label>
                  <input type="text" value={formDenuncia.titulo} onChange={(e) => setFormDenuncia({ ...formDenuncia, titulo: e.target.value })} placeholder="Título da denúncia" />
                </div>
                <div className="modal-form-group">
                  <label>Categoria</label>
                  <select className="perfil-select" value={formDenuncia.categoriaId} onChange={(e) => setFormDenuncia({ ...formDenuncia, categoriaId: e.target.value })}>
                    <option value="">Selecione uma categoria</option>
                    {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* ── Seção 2: Localização com mapa ── */}
            <div className="ped-section">
              <div className="ped-section-label">
                <span className="ped-section-dot ped-dot--yellow" />
                Localização
              </div>
              <div className="modal-form-group">
                <label>Endereço</label>
                <div className="ped-location-wrap">
                  <span className="ped-location-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={formDenuncia.localizacao}
                    onChange={(e) => { setFormDenuncia({ ...formDenuncia, localizacao: e.target.value }); setLatitudeEdicao(""); setLongitudeEdicao(""); setCoordenadasEdicao(null); }}
                    placeholder="Digite o endereço ou selecione no mapa"
                  />
                  <button type="button" className="ped-map-btn" title="Selecionar no mapa" onClick={() => setMostrarMapaEdicao(true)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
                    </svg>
                  </button>
                </div>
                {latitudeEdicao && longitudeEdicao && (
                  <div className="ped-coords-badge">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                    GPS: {latitudeEdicao}, {longitudeEdicao}
                    <button type="button" className="ped-coords-clear" onClick={() => { setLatitudeEdicao(""); setLongitudeEdicao(""); setCoordenadasEdicao(null); }}>✕</button>
                  </div>
                )}
              </div>
            </div>

            {/* ── Seção 3: Descrição ── */}
            <div className="ped-section">
              <div className="ped-section-label">
                <span className="ped-section-dot ped-dot--purple" />
                Descrição
              </div>
              <div className="modal-form-group">
                <label>Descreva o problema</label>
                <textarea className="perfil-textarea" value={formDenuncia.descricao} onChange={(e) => setFormDenuncia({ ...formDenuncia, descricao: e.target.value })} placeholder="Descreva o problema com detalhes..." />
              </div>
            </div>

            {/* ── Seção 4: Imagens ── */}
            <div className="ped-section">
              <div className="ped-section-label">
                <span className="ped-section-dot ped-dot--amber" />
                Imagens
              </div>

              {/* Imagens existentes */}
              {denunciaEditando?.imagens?.length > 0 && (
                <div className="ped-imagens-atuais">
                  <p className="ped-imagens-titulo">Imagens atuais — clique no ✕ para remover</p>
                  <div className="ped-imagens-grid">
                    {denunciaEditando.imagens.map((img) => {
                      const marcadaParaDeletar = imagensParaDeletar.includes(img.id);
                      return (
                        <div key={img.id} className={`ped-imagem-wrap ${marcadaParaDeletar ? "ped-imagem-wrap--deletar" : ""}`}>
                          <img src={img.imagemUrl} alt="imagem" onClick={() => setImagemAberta(img.imagemUrl)} />
                          <button
                            type="button"
                            className="ped-imagem-remove"
                            title={marcadaParaDeletar ? "Cancelar remoção" : "Remover imagem"}
                            onClick={() => setImagensParaDeletar(p => marcadaParaDeletar ? p.filter(id => id !== img.id) : [...p, img.id])}
                          >
                            {marcadaParaDeletar ? "↩" : "✕"}
                          </button>
                          {marcadaParaDeletar && <div className="ped-imagem-overlay-delete">Será removida</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Novas imagens */}
              <div
                className={`ped-dropzone ${novasImagens.length > 0 ? "ped-dropzone--active" : ""}`}
                onClick={() => fileInputEdicaoRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const files = Array.from(e.dataTransfer.files).filter(f => ["image/jpeg","image/png"].includes(f.type));
                  setNovasImagens(p => [...p, ...files].slice(0, 5));
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{opacity:0.5}}>
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
                <p>{novasImagens.length > 0 ? `${novasImagens.length} nova(s) imagem(ns) selecionada(s)` : "Clique ou arraste para adicionar novas imagens"}</p>
                <small>JPG, PNG · máx. 5 por envio</small>
                <input ref={fileInputEdicaoRef} type="file" accept="image/jpeg,image/png" multiple style={{ display: "none" }}
                  onChange={(e) => {
                    const files = Array.from(e.target.files).filter(f => ["image/jpeg","image/png"].includes(f.type));
                    setNovasImagens(p => [...p, ...files].slice(0, 5));
                  }}
                />
              </div>
              {novasImagens.length > 0 && (
                <div className="ped-novas-imagens-list">
                  {novasImagens.map((f, i) => (
                    <div key={i} className="ped-nova-imagem-item">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                      </svg>
                      <span>{f.name}</span>
                      <button type="button" onClick={() => setNovasImagens(p => p.filter((_, j) => j !== i))}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={fecharEditarDenuncia}>Cancelar</button>
              <button type="button" className="save-btn" onClick={salvarDenunciaEditada}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Salvar alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL MAPA EDIÇÃO ══ */}
      {mostrarMapaEdicao && (
        <div className="perfil-modal-overlay" style={{ zIndex: 9998 }} onClick={() => setMostrarMapaEdicao(false)}>
          <div className="perfil-modal" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
            <div className="perfil-modal-header">
              <div>
                <h2>Selecionar localização</h2>
                <p>Clique no mapa para marcar o ponto exato da ocorrência.</p>
              </div>
              <button className="modal-close" onClick={() => setMostrarMapaEdicao(false)}>✕</button>
            </div>
            <MapContainer center={coordenadasEdicao || [-11.3042, -41.8565]} zoom={13} style={{ height: "400px", width: "100%", borderRadius: "12px" }}>
              <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationPickerEdicao />
              {coordenadasEdicao && (
                <CircleMarker center={coordenadasEdicao} radius={10} pathOptions={{ color: "#31bf49", fillColor: "#31bf49", fillOpacity: 0.7 }} />
              )}
            </MapContainer>
          </div>
        </div>
      )}

      {/* ══ PREVIEW IMAGEM ══ */}
      {imagemAberta && (
        <div className="perfil-imagem-preview-overlay" onClick={() => setImagemAberta(null)}>
          <button className="perfil-imagem-preview-close">✕</button>
          <img src={imagemAberta} alt="Imagem da denúncia" className="perfil-imagem-preview" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

export default Perfil;