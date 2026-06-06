import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, CircleMarker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import NavBar from "../components/NavBar";
import "../styles/RegistrarDenuncia.css";

/* ══ TOAST ══ */
function Toast({ toasts, removeToast }) {
  return (
    <div className="rd-toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`rd-toast rd-toast--${t.type}`}>
          <span className="rd-toast-icon">
            {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}
          </span>
          <span className="rd-toast-msg">{t.message}</span>
          <button className="rd-toast-close" onClick={() => removeToast(t.id)}>✕</button>
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
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
  }, []);
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  return { toasts, addToast, removeToast };
}

/* ══ COMPONENTE ══ */
function RegistrarDenuncia() {
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  const [descricao, setDescricao] = useState("");
  const [imagens, setImagens] = useState([]);
  const fileInputRef = useRef(null);

  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [coordenadas, setCoordenadas] = useState(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [etapaAtual, setEtapaAtual] = useState(1);

  useEffect(() => {
    async function carregarCategorias() {
      try {
        const response = await fetch("http://localhost:8080/categorias");
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    }
    carregarCategorias();
  }, []);

  const handleDescricaoChange = (e) => {
    if (e.target.value.length <= 1000) setDescricao(e.target.value);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      ["image/jpeg", "image/png"].includes(file.type)
    );
    setImagens((prev) => [...prev, ...files].slice(0, 5));
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files).filter((file) =>
      ["image/jpeg", "image/png"].includes(file.type)
    );
    setImagens((prev) => [...prev, ...files].slice(0, 5));
  };

  async function buscarEnderecoPorCoordenadas(lat, lng) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=pt-BR`
      );
      const data = await response.json();
      if (data?.display_name) {
        setLocalizacao(data.display_name);
      } else {
        setLocalizacao(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      }
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
      setLocalizacao(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    }
  }

  function LocationPicker() {
    useMapEvents({
      click(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        setCoordenadas([lat, lng]);
        setLatitude(lat.toFixed(6));
        setLongitude(lng.toFixed(6));
        buscarEnderecoPorCoordenadas(lat, lng);
        setMostrarMapa(false);
      },
    });
    return null;
  }

  function avancarEtapa() {
    if (etapaAtual === 1) {
      if (!categoriaSelecionada || !localizacao.trim()) {
        addToast("Selecione o tipo de problema e informe a localização para continuar.", "error");
        return;
      }
      setEtapaAtual(2);
      return;
    }
    if (etapaAtual === 2) {
      if (!descricao.trim()) {
        addToast("Descreva o problema antes de avançar para a revisão.", "error");
        return;
      }
      setEtapaAtual(3);
    }
  }

  async function enviarDenuncia() {
    if (etapaAtual !== 3) return;

    const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));

    if (!usuarioLogado) {
      addToast("Você precisa estar logado para registrar uma denúncia.", "error");
      setTimeout(() => navigate("/login"), 1600);
      return;
    }

    if (!categoriaSelecionada || !localizacao.trim() || !descricao.trim()) {
      addToast("Preencha todos os campos obrigatórios antes de enviar.", "error");
      return;
    }

    try {
      const categoria = categorias.find((item) => item.id === Number(categoriaSelecionada));

      const formData = new FormData();
      formData.append("titulo", categoria?.nome || "Denúncia");
      formData.append("descricao", descricao);
      formData.append("localizacao", localizacao);
      formData.append("categoriaId", categoriaSelecionada);
      formData.append("usuarioId", usuarioLogado.id);
      imagens.forEach((imagem) => formData.append("imagens", imagem));

      const response = await fetch("http://localhost:8080/denuncias", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        addToast("Não foi possível registrar a denúncia. Tente novamente.", "error");
        return;
      }

      addToast("Denúncia enviada com sucesso! Redirecionando...", "success");
      setTimeout(() => navigate("/home"), 1400);
    } catch (error) {
      console.error("Erro ao registrar denúncia:", error);
      addToast("Falha na conexão com o servidor. Verifique sua internet.", "error");
    }
  }

  return (
    <>
      <NavBar />
      <Toast toasts={toasts} removeToast={removeToast} />

      <div className="rd-page">
        <div className="rd-content">
          <header className="rd-header">
            <button className="rd-back-btn" type="button" onClick={() => navigate(-1)}>←</button>
            <div className="rd-header-text">
              <div className="rd-header-eyebrow">CityFix · Cidadão</div>
              <h1>Registrar denúncia</h1>
              <p>Ajude a melhorar a nossa cidade informando um problema.</p>
            </div>
          </header>

          <div className="rd-steps">
            <div className={`rd-step ${etapaAtual >= 1 ? "rd-step--active" : ""} ${etapaAtual === 1 ? "rd-step--current" : ""}`}>
              <div className="rd-step-dot">
                {etapaAtual > 1 ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : "1"}
              </div>
              <span>Identificação</span>
            </div>

            <div className={`rd-step-line ${etapaAtual > 1 ? "rd-step-line--done" : ""}`} />

            <div className={`rd-step ${etapaAtual >= 2 ? "rd-step--active" : ""} ${etapaAtual === 2 ? "rd-step--current" : ""}`}>
              <div className="rd-step-dot">
                {etapaAtual > 2 ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : "2"}
              </div>
              <span>Detalhes</span>
            </div>

            <div className={`rd-step-line ${etapaAtual > 2 ? "rd-step-line--done" : ""}`} />

            <div className={`rd-step ${etapaAtual >= 3 ? "rd-step--active" : ""} ${etapaAtual === 3 ? "rd-step--current" : ""}`}>
              <div className="rd-step-dot">3</div>
              <span>Revisão</span>
            </div>
          </div>

          <form className="rd-form" onSubmit={(e) => e.preventDefault()}>
            {etapaAtual === 1 && (
              <section className="rd-section">
                <div className="rd-section-header">
                  <div className="rd-section-icon">⚠️</div>
                  <div>
                    <h2>Identificação do problema</h2>
                    <p>Informe o tipo e a localização da ocorrência.</p>
                  </div>
                </div>
                <div className="rd-section-body">
                  <div className="rd-row">
                    <div className="rd-field">
                      <label className="rd-label">Tipo de problema <span className="rd-required">*</span></label>
                      <div className="rd-select-wrap">
                        <span className="rd-select-icon">⚠️</span>
                        <select value={categoriaSelecionada} onChange={(e) => setCategoriaSelecionada(e.target.value)}>
                          <option value="" disabled>Selecione o tipo de problema</option>
                          {categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
                          ))}
                        </select>
                        <span className="rd-select-arrow">▼</span>
                      </div>
                    </div>
                    <div className="rd-field">
                      <label className="rd-label">Localização <span className="rd-required">*</span></label>
                      <div className="rd-location-wrap">
                        <span className="rd-location-icon">📍</span>
                        <input
                          type="text"
                          placeholder="Digite o endereço ou selecione no mapa"
                          value={localizacao}
                          onChange={(e) => { setLocalizacao(e.target.value); setLatitude(""); setLongitude(""); setCoordenadas(null); }}
                        />
                        <button type="button" className="rd-map-btn" title="Selecionar no mapa" onClick={() => setMostrarMapa(true)}>🗺️</button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {etapaAtual === 2 && (
              <section className="rd-section">
                <div className="rd-section-header">
                  <div className="rd-section-icon">✏️</div>
                  <div>
                    <h2>Detalhes da ocorrência</h2>
                    <p>Descreva o problema e adicione imagens se desejar.</p>
                  </div>
                </div>
                <div className="rd-section-body">
                  <div className="rd-field">
                    <label className="rd-label">Descrição do problema <span className="rd-required">*</span></label>
                    <div className="rd-textarea-wrap">
                      <span className="rd-textarea-icon">✏️</span>
                      <textarea placeholder="Descreva o problema com o máximo de detalhes possível..." value={descricao} onChange={handleDescricaoChange} />
                      <span className={`rd-char-count ${descricao.length > 900 ? "rd-char-count--warn" : ""}`}>{descricao.length}/1000</span>
                    </div>
                  </div>
                  <div className="rd-field">
                    <label className="rd-label">Anexar imagens <span className="rd-optional">(opcional)</span></label>
                    <div className="rd-images-row">
                      <div
                        className={`rd-dropzone ${imagens.length > 0 ? "rd-dropzone--active" : ""}`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current.click()}
                      >
                        <span className="rd-dropzone-icon">☁️</span>
                        <p className="rd-dropzone-title">Clique para adicionar imagens</p>
                        <p className="rd-dropzone-sub">ou arraste e solte os arquivos aqui<br />Formatos: JPG, PNG · máx. 5MB cada</p>
                        {imagens.length > 0 && <div className="rd-dropzone-count">✅ {imagens.length} imagem(ns) selecionada(s)</div>}
                        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" multiple style={{ display: "none" }} onChange={handleFileInput} />
                      </div>
                      <div className="rd-hints-panel">
                        <div className="rd-hints-label">Dicas para uma boa denúncia</div>
                        <div className="rd-hint-item">
                          <div className="rd-hint-icon-wrap rd-hint-icon-wrap--camera">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
                            </svg>
                          </div>
                          <div className="rd-hint-text"><strong>Fotos aumentam a prioridade</strong><p>Imagens ajudam a equipe a entender a gravidade do problema rapidamente.</p></div>
                        </div>
                        <div className="rd-hint-item">
                          <div className="rd-hint-icon-wrap rd-hint-icon-wrap--image">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                            </svg>
                          </div>
                          <div className="rd-hint-text"><strong>Sem foto? Sem problema</strong><p>Uma imagem padrão será usada automaticamente caso nenhuma seja enviada.</p></div>
                        </div>
                        <div className="rd-hint-item">
                          <div className="rd-hint-icon-wrap rd-hint-icon-wrap--pin">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                            </svg>
                          </div>
                          <div className="rd-hint-text"><strong>Localização precisa</strong><p>Usar o mapa para marcar o ponto exato agiliza o atendimento da ocorrência.</p></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {etapaAtual === 3 && (
              <section className="rd-section">
                <div className="rd-section-header">
                  <div className="rd-section-icon rd-section-icon--check">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div>
                    <h2>Revisão da denúncia</h2>
                    <p>Confira os dados antes de enviar.</p>
                  </div>
                </div>

                <div className="rd-section-body rd-review-body">

                  {/* ── Confirmação ── */}
                  <div className="rd-review-confirm">
                    <div className="rd-review-confirm-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                      </svg>
                    </div>
                    <div>
                      <strong>Tudo certo por aqui?</strong>
                      <p>Revise as informações abaixo antes de enviar à equipe responsável.</p>
                    </div>
                  </div>

                  {/* ── Linha 1: categoria + localização ── */}
                  <div className="rd-review-row">

                    <div className="rd-review-field">
                      <div className="rd-review-field-header">
                        <span className="rd-review-field-icon rd-rfi--cat">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                          </svg>
                        </span>
                        <span className="rd-review-field-label">Categoria</span>
                      </div>
                      <p className="rd-review-field-value">
                        {categorias.find((c) => c.id === Number(categoriaSelecionada))?.nome || "Não informado"}
                      </p>
                    </div>

                    <div className="rd-review-field rd-review-field--wide">
                      <div className="rd-review-field-header">
                        <span className="rd-review-field-icon rd-rfi--pin">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                          </svg>
                        </span>
                        <span className="rd-review-field-label">Localização</span>
                      </div>
                      <p className="rd-review-field-value">{localizacao}</p>
                    </div>

                  </div>

                  {/* ── Coordenadas (condicional) ── */}
                  {latitude && longitude && (
                    <div className="rd-review-field rd-review-field--coord">
                      <div className="rd-review-field-header">
                        <span className="rd-review-field-icon rd-rfi--coord">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                          </svg>
                        </span>
                        <span className="rd-review-field-label">Coordenadas GPS</span>
                      </div>
                      <p className="rd-review-field-value rd-review-field-value--mono">{latitude}, {longitude}</p>
                    </div>
                  )}

                  {/* ── Descrição ── */}
                  <div className="rd-review-field rd-review-field--desc">
                    <div className="rd-review-field-header">
                      <span className="rd-review-field-icon rd-rfi--desc">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/>
                          <line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/>
                        </svg>
                      </span>
                      <span className="rd-review-field-label">Descrição do problema</span>
                    </div>
                    <p className="rd-review-field-value rd-review-field-value--multiline">{descricao}</p>
                  </div>

                  {/* ── Imagens ── */}
                  <div className="rd-review-field">
                    <div className="rd-review-field-header">
                      <span className="rd-review-field-icon rd-rfi--img">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </span>
                      <span className="rd-review-field-label">Imagens</span>
                      {imagens.length > 0 && (
                        <span className="rd-review-img-badge">{imagens.length}</span>
                      )}
                    </div>
                    <p className="rd-review-field-value">
                      {imagens.length > 0
                        ? `${imagens.length} imagem(ns) anexada(s)`
                        : "Nenhuma imagem — será usada a imagem padrão"}
                    </p>
                  </div>

                  {/* ── Aviso final ── */}
                  <div className="rd-review-notice">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <p>Após o envio, sua denúncia será analisada e você receberá notificações sobre o andamento.</p>
                  </div>

                </div>
              </section>
            )}

            <section className="rd-section rd-section--footer">
              <div className="rd-actions">
                {etapaAtual > 1 && (
                  <button type="button" className="rd-btn-cancel" onClick={() => setEtapaAtual((prev) => prev - 1)}>← Voltar</button>
                )}
                {etapaAtual < 3 ? (
                  <button type="button" className="rd-btn-submit" onClick={avancarEtapa}>Continuar →</button>
                ) : (
                  <button type="button" className="rd-btn-submit" onClick={enviarDenuncia}><span>📨</span>Enviar denúncia</button>
                )}
              </div>
            </section>
          </form>
        </div>
      </div>

      {mostrarMapa && (
        <div className="rd-modal-overlay" onClick={() => setMostrarMapa(false)}>
          <div className="rd-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rd-modal-header">
              <div className="rd-modal-title"><span>🗺️</span><h3>Selecione a localização</h3></div>
              <button type="button" className="rd-modal-close" onClick={() => setMostrarMapa(false)}>✕</button>
            </div>
            <p style={{ marginBottom: "12px", color: "#666" }}>Clique no ponto exato da ocorrência no mapa.</p>
            <MapContainer center={coordenadas || [-11.3042, -41.8565]} zoom={13} style={{ height: "400px", width: "100%", borderRadius: "12px" }}>
              <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationPicker />
              {coordenadas && (
                <CircleMarker center={coordenadas} radius={10} pathOptions={{ color: "red", fillColor: "red", fillOpacity: 0.7 }} />
              )}
            </MapContainer>
          </div>
        </div>
      )}
    </>
  );
}

export default RegistrarDenuncia;