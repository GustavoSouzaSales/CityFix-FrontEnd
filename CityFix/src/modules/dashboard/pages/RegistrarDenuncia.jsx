import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "../styles/RegistrarDenuncia.css";

function RegistrarDenuncia() {
  const navigate = useNavigate();

  const [descricao, setDescricao] = useState("");
  const [privacidade, setPrivacidade] = useState(true);
  const [imagens, setImagens] = useState([]);
  const fileInputRef = useRef(null);
  const [mostrarMapa, setMostrarMapa] = useState(false);

  const handleDescricaoChange = (e) => {
    if (e.target.value.length <= 1000) setDescricao(e.target.value);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      ["image/jpeg", "image/png"].includes(f.type)
    );
    setImagens((prev) => [...prev, ...files].slice(0, 5));
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files).filter((f) =>
      ["image/jpeg", "image/png"].includes(f.type)
    );
    setImagens((prev) => [...prev, ...files].slice(0, 5));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Denúncia enviada com sucesso!");
    navigate("/home");
  };

  return (
    <>
      <NavBar />

      <div className="rd-topbar">
        <button className="rd-notif-btn">
          <span>🔔</span>
          <span className="rd-notif-badge">2</span>
        </button>
      </div>

      <div className="rd-page">
        <div className="rd-content">

          {/* ── HEADER ── */}
          <header className="rd-header">
            <button className="rd-back-btn" onClick={() => navigate(-1)}>←</button>
            <div className="rd-header-text">
              <div className="rd-header-eyebrow">CityFix · Cidadão</div>
              <h1>Registrar denúncia</h1>
              <p>Ajude a melhorar a nossa cidade informando um problema.</p>
            </div>
          </header>

          {/* ── ETAPAS VISUAIS ── */}
          <div className="rd-steps">
            <div className="rd-step rd-step--active">
              <div className="rd-step-dot">1</div>
              <span>Identificação</span>
            </div>
            <div className="rd-step-line" />
            <div className="rd-step rd-step--active">
              <div className="rd-step-dot">2</div>
              <span>Detalhes</span>
            </div>
            <div className="rd-step-line" />
            <div className="rd-step">
              <div className="rd-step-dot">3</div>
              <span>Revisão</span>
            </div>
          </div>

          <form className="rd-form" onSubmit={handleSubmit}>

            {/* ── SEÇÃO 1: IDENTIFICAÇÃO ── */}
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
                  {/* Tipo */}
                  <div className="rd-field">
                    <label className="rd-label">
                      Tipo de problema <span className="rd-required">*</span>
                    </label>
                    <div className="rd-select-wrap">
                      <span className="rd-select-icon">⚠️</span>
                      <select defaultValue="">
                        <option value="" disabled>Selecione o tipo de problema</option>
                        <option value="buraco">Buraco na via</option>
                        <option value="iluminacao">Iluminação defeituosa</option>
                        <option value="lixo">Acúmulo de lixo</option>
                        <option value="calcada">Calçada danificada</option>
                        <option value="vandalismo">Vandalismo</option>
                        <option value="outros">Outros</option>
                      </select>
                      <span className="rd-select-arrow">▼</span>
                    </div>
                  </div>

                  {/* Localização */}
                  <div className="rd-field">
                    <label className="rd-label">
                      Localização <span className="rd-required">*</span>
                    </label>
                    <div className="rd-location-wrap">
                      <span className="rd-location-icon">📍</span>
                      <input
                        type="text"
                        placeholder="Digite o endereço ou selecione no mapa"
                      />
                      <button
                        type="button"
                        className="rd-map-btn"
                        title="Selecionar no mapa"
                        onClick={() => setMostrarMapa(true)}
                      >
                        🗺️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── SEÇÃO 2: DETALHES ── */}
            <section className="rd-section">
              <div className="rd-section-header">
                <div className="rd-section-icon">✏️</div>
                <div>
                  <h2>Detalhes da ocorrência</h2>
                  <p>Descreva o problema e adicione imagens se desejar.</p>
                </div>
              </div>

              <div className="rd-section-body">
                {/* Descrição */}
                <div className="rd-field">
                  <label className="rd-label">
                    Descrição do problema <span className="rd-required">*</span>
                  </label>
                  <div className="rd-textarea-wrap">
                    <span className="rd-textarea-icon">✏️</span>
                    <textarea
                      placeholder="Descreva o problema com o máximo de detalhes possível..."
                      value={descricao}
                      onChange={handleDescricaoChange}
                    />
                    <span className={`rd-char-count ${descricao.length > 900 ? "rd-char-count--warn" : ""}`}>
                      {descricao.length}/1000
                    </span>
                  </div>
                </div>

                {/* Imagens */}
                <div className="rd-field">
                  <label className="rd-label">
                    Anexar imagens <span className="rd-optional">(opcional)</span>
                  </label>
                  <div className="rd-images-row">
                    <div
                      className={`rd-dropzone ${imagens.length > 0 ? "rd-dropzone--active" : ""}`}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current.click()}
                    >
                      <span className="rd-dropzone-icon">☁️</span>
                      <p className="rd-dropzone-title">Clique para adicionar imagens</p>
                      <p className="rd-dropzone-sub">
                        ou arraste e solte os arquivos aqui<br />
                        Formatos: JPG, PNG · máx. 5MB cada
                      </p>
                      {imagens.length > 0 && (
                        <div className="rd-dropzone-count">
                          ✅ {imagens.length} imagem(ns) selecionada(s)
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png"
                        multiple
                        style={{ display: "none" }}
                        onChange={handleFileInput}
                      />
                    </div>

                    <div className="rd-image-hints">
                      <div className="rd-hint-item">
                        <span className="rd-hint-icon">📷</span>
                        <p>Fotos ajudam a entender melhor o problema.</p>
                      </div>
                      <div className="rd-hint-item">
                        <span className="rd-hint-icon">🖼️</span>
                        <p>Você pode enviar até 5 imagens.</p>
                      </div>
                      <div className="rd-hint-item">
                        <span className="rd-hint-icon">🔒</span>
                        <p>Suas informações estão seguras e protegidas.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── SEÇÃO 3: PRIVACIDADE + AÇÕES ── */}
            <section className="rd-section rd-section--footer">
              <div className="rd-privacy-card">
                <div className="rd-privacy-left">
                  <span className="rd-privacy-icon">🔒</span>
                  <div className="rd-privacy-text">
                    <h4>Privacidade</h4>
                    <p>Sua denúncia será pública, mas seus dados pessoais ficarão em sigilo.</p>
                  </div>
                </div>
                <div
                  className="rd-privacy-toggle"
                  style={{ background: privacidade ? "#31bf49" : "#444" }}
                  onClick={() => setPrivacidade(!privacidade)}
                >
                  <div
                    className="rd-privacy-thumb"
                    style={{ right: privacidade ? 3 : "auto", left: privacidade ? "auto" : 3 }}
                  />
                </div>
              </div>

              <div className="rd-actions">
                <button
                  type="button"
                  className="rd-btn-cancel"
                  onClick={() => navigate(-1)}
                >
                  Cancelar
                </button>
                <button type="submit" className="rd-btn-submit">
                  <span>📨</span> Enviar denúncia
                </button>
              </div>
            </section>

          </form>
        </div>
      </div>

      {mostrarMapa && (
  <div
    className="rd-modal-overlay"
    onClick={() => setMostrarMapa(false)}
  >
    <div
      className="rd-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="rd-modal-header">
        <div className="rd-modal-title">
          <span>🗺️</span>
          <h3>Mapa da cidade</h3>
        </div>

        <button
          type="button"
          className="rd-modal-close"
          onClick={() => setMostrarMapa(false)}
        >
          ✕
        </button>
      </div>

      <iframe
        title="Mapa de Irecê"
        src="https://maps.google.com/maps?q=Irec%C3%AA%20BA&t=&z=13&ie=UTF8&iwloc=&output=embed"
        width="100%"
        height="400"
        style={{ border: 0, borderRadius: "12px" }}
      />
    </div>
  </div>
)}
</>
);
}

export default RegistrarDenuncia;