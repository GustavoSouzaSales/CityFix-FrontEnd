import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, CircleMarker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import NavBar from "../components/NavBar";
import "../styles/RegistrarDenuncia.css";

function RegistrarDenuncia() {
  const navigate = useNavigate();

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
    if (e.target.value.length <= 1000) {
      setDescricao(e.target.value);
    }
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
        alert("Preencha o tipo do problema e a localização para continuar.");
        return;
      }

      setEtapaAtual(2);
      return;
    }

    if (etapaAtual === 2) {
      if (!descricao.trim()) {
        alert("Preencha a descrição do problema para continuar.");
        return;
      }

      setEtapaAtual(3);
    }
  }

  async function enviarDenuncia() {
    if (etapaAtual !== 3) return;

    const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));

    if (!usuarioLogado) {
      alert("Você precisa estar logado para registrar uma denúncia.");
      navigate("/login");
      return;
    }

    if (!categoriaSelecionada || !localizacao.trim() || !descricao.trim()) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const categoria = categorias.find(
        (item) => item.id === Number(categoriaSelecionada)
      );

      const formData = new FormData();

      formData.append("titulo", categoria?.nome || "Denúncia");
      formData.append("descricao", descricao);
      formData.append("localizacao", localizacao);
      formData.append("categoriaId", categoriaSelecionada);
      formData.append("usuarioId", usuarioLogado.id);

      imagens.forEach((imagem) => {
        formData.append("imagens", imagem);
      });

      const response = await fetch("http://localhost:8080/denuncias", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        alert("Erro ao registrar denúncia.");
        return;
      }

      alert("Denúncia enviada com sucesso!");
      navigate("/home");
    } catch (error) {
      console.error("Erro ao registrar denúncia:", error);
      alert("Erro ao conectar com o servidor.");
    }
  }

  return (
    <>
      <NavBar />

      <div className="rd-page">
        <div className="rd-content">
          <header className="rd-header">
            <button
              className="rd-back-btn"
              type="button"
              onClick={() => navigate(-1)}
            >
              ←
            </button>

            <div className="rd-header-text">
              <div className="rd-header-eyebrow">CityFix · Cidadão</div>
              <h1>Registrar denúncia</h1>
              <p>Ajude a melhorar a nossa cidade informando um problema.</p>
            </div>
          </header>

          <div className="rd-steps">
            <div className={`rd-step ${etapaAtual >= 1 ? "rd-step--active" : ""}`}>
              <div className="rd-step-dot">1</div>
              <span>Identificação</span>
            </div>

            <div className="rd-step-line" />

            <div className={`rd-step ${etapaAtual >= 2 ? "rd-step--active" : ""}`}>
              <div className="rd-step-dot">2</div>
              <span>Detalhes</span>
            </div>

            <div className="rd-step-line" />

            <div className={`rd-step ${etapaAtual >= 3 ? "rd-step--active" : ""}`}>
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
                      <label className="rd-label">
                        Tipo de problema <span className="rd-required">*</span>
                      </label>

                      <div className="rd-select-wrap">
                        <span className="rd-select-icon">⚠️</span>

                        <select
                          value={categoriaSelecionada}
                          onChange={(e) =>
                            setCategoriaSelecionada(e.target.value)
                          }
                        >
                          <option value="" disabled>
                            Selecione o tipo de problema
                          </option>

                          {categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>
                              {categoria.nome}
                            </option>
                          ))}
                        </select>

                        <span className="rd-select-arrow">▼</span>
                      </div>
                    </div>

                    <div className="rd-field">
                      <label className="rd-label">
                        Localização <span className="rd-required">*</span>
                      </label>

                      <div className="rd-location-wrap">
                        <span className="rd-location-icon">📍</span>

                        <input
                          type="text"
                          placeholder="Digite o endereço ou selecione no mapa"
                          value={localizacao}
                          onChange={(e) => {
                            setLocalizacao(e.target.value);
                            setLatitude("");
                            setLongitude("");
                            setCoordenadas(null);
                          }}
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

                      <span
                        className={`rd-char-count ${
                          descricao.length > 900 ? "rd-char-count--warn" : ""
                        }`}
                      >
                        {descricao.length}/1000
                      </span>
                    </div>
                  </div>

                  <div className="rd-field">
                    <label className="rd-label">
                      Anexar imagens{" "}
                      <span className="rd-optional">(opcional)</span>
                    </label>

                    <div className="rd-images-row">
                      <div
                        className={`rd-dropzone ${
                          imagens.length > 0 ? "rd-dropzone--active" : ""
                        }`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current.click()}
                      >
                        <span className="rd-dropzone-icon">☁️</span>

                        <p className="rd-dropzone-title">
                          Clique para adicionar imagens
                        </p>

                        <p className="rd-dropzone-sub">
                          ou arraste e solte os arquivos aqui
                          <br />
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
                          <p>Se nenhuma imagem for enviada, será usada uma imagem padrão.</p>
                        </div>

                        <div className="rd-hint-item">
                          <span className="rd-hint-icon">📍</span>
                          <p>A localização ajuda a equipe a encontrar o problema.</p>
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
                  <div className="rd-section-icon">✅</div>

                  <div>
                    <h2>Revisão da denúncia</h2>
                    <p>Confira os dados antes de enviar.</p>
                  </div>
                </div>

                <div className="rd-section-body">
                  <div className="rd-review-card">
                    <strong>Categoria:</strong>
                    <p>
                      {categorias.find(
                        (categoria) =>
                          categoria.id === Number(categoriaSelecionada)
                      )?.nome || "Não informado"}
                    </p>
                  </div>

                  <div className="rd-review-card">
                    <strong>Localização:</strong>
                    <p>{localizacao}</p>
                  </div>

                  {latitude && longitude && (
                    <div className="rd-review-card">
                      <strong>Coordenadas:</strong>
                      <p>
                        {latitude}, {longitude}
                      </p>
                    </div>
                  )}

                  <div className="rd-review-card">
                    <strong>Descrição:</strong>
                    <p>{descricao}</p>
                  </div>

                  <div className="rd-review-card">
                    <strong>Imagens:</strong>
                    <p>
                      {imagens.length > 0
                        ? `${imagens.length} imagem(ns)`
                        : "Imagem padrão será usada"}
                    </p>
                  </div>
                </div>
              </section>
            )}

            <section className="rd-section rd-section--footer">
              <div className="rd-actions">
                {etapaAtual > 1 && (
                  <button
                    type="button"
                    className="rd-btn-cancel"
                    onClick={() => setEtapaAtual((prev) => prev - 1)}
                  >
                    ← Voltar
                  </button>
                )}

                {etapaAtual < 3 ? (
                  <button
                    type="button"
                    className="rd-btn-submit"
                    onClick={avancarEtapa}
                  >
                    Continuar →
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rd-btn-submit"
                    onClick={enviarDenuncia}
                  >
                    <span>📨</span>
                    Enviar denúncia
                  </button>
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
              <div className="rd-modal-title">
                <span>🗺️</span>
                <h3>Selecione a localização</h3>
              </div>

              <button
                type="button"
                className="rd-modal-close"
                onClick={() => setMostrarMapa(false)}
              >
                ✕
              </button>
            </div>

            <p style={{ marginBottom: "12px", color: "#666" }}>
              Clique no ponto exato da ocorrência no mapa.
            </p>

            <MapContainer
              center={coordenadas || [-11.3042, -41.8565]}
              zoom={13}
              style={{
                height: "400px",
                width: "100%",
                borderRadius: "12px",
              }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <LocationPicker />

              {coordenadas && (
                <CircleMarker
                  center={coordenadas}
                  radius={10}
                  pathOptions={{
                    color: "red",
                    fillColor: "red",
                    fillOpacity: 0.7,
                  }}
                />
              )}
            </MapContainer>
          </div>
        </div>
      )}
    </>
  );
}

export default RegistrarDenuncia;