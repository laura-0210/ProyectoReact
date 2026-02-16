import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { StatusScreen } from "./components/StatusScreen";
import Controls from "./components/Controls";
import Button from "./components/Button";

// Imágenes
import imgFeliz from "./assets/sprites/happy.gif";
import imgEnfadado from "./assets/sprites/enfadado.jpeg";
import imgTriste from "./assets/sprites/triste.jpeg";
import imgNeutral from "./assets/sprites/neutral.jpeg";
import imgDormir from "./assets/sprites/dormir.jpeg";
import imgMuerteCaida from "./assets/sprites/muerte2.jpeg";
import imgMuerteFinal from "./assets/sprites/muerte3.jpeg";
import imgDracula from "./assets/sprites/draculacat.png";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function App() {
  const [stats, setStats] = useState({
    health: 100,
    hunger: 20,
    happiness: 100,
    durmiendo: false,
    is_alive: true,
  });

  const [muerteFinalizada, setMuerteFinalizada] = useState(false);
  const [skin, setSkin] = useState<"original" | "dracula">("original");
  const [showMenu, setShowMenu] = useState(false);

  // DEBUG
  useEffect(() => {
    console.log("🎨 Skin actual:", skin);
  }, [skin]);

  const fetchEstado = async () => {
    try {
      const response = await fetch(`${API_URL}/estado`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error conectando con el backend:", error);
    }
  };

  useEffect(() => {
    fetchEstado();
  }, []);

  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const response = await fetch(`${API_URL}/tick`, { method: "POST" });
        const data = await response.json();
        setStats(data);

        if (!data.is_alive && !muerteFinalizada) {
          setTimeout(() => setMuerteFinalizada(true), 3000);
        }
      } catch (error) {
        console.error("El servidor está apagado o no responde");
      }
    }, 2000);

    return () => clearInterval(timer);
  }, [muerteFinalizada]);

  const comer = async () => {
    const res = await fetch(`${API_URL}/comer`, { method: "POST" });
    const data = await res.json();
    setStats(data);
  };

  const jugar = async () => {
    const res = await fetch(`${API_URL}/jugar`, { method: "POST" });
    const data = await res.json();
    setStats(data);
  };

  const dormir = async () => {
    const res = await fetch(`${API_URL}/dormir`, { method: "POST" });
    const data = await res.json();
    setStats(data);
  };

  const revivir = async () => {
    const res = await fetch(`${API_URL}/revivir`, { method: "POST" });
    const data = await res.json();
    setStats(data);
    setMuerteFinalizada(false);
  };

  const getCurrentImage = () => {
    if (skin === "dracula") return imgDracula;
    if (stats.health <= 0) {
      if (muerteFinalizada) return imgMuerteFinal;
      return imgMuerteCaida;
    }
    if (stats.durmiendo) return imgDormir;
    if (stats.hunger > 80) return imgEnfadado;
    if (stats.happiness < 30) return imgTriste;
    if (stats.happiness > 70) return imgFeliz;
    return imgNeutral;
  };

  return (
    <div className="app-container">
      <h1>GATITO VIRTUAL</h1>

      <StatusScreen
        health={stats.health}
        hunger={stats.hunger}
        happiness={stats.happiness}
        petImage={getCurrentImage()}
        onTick={() => {}}
      />

      <div style={{ marginTop: "10px" }}>
        <Button
          texto="🔄 Cambiar Avatar"
          color="lila-button"
          onClick={() => setShowMenu(true)}
          desactivado={false}
        />
      </div>

      {!stats.is_alive ? (
        <Button
          texto="Revivir❤️"
          color="rojo-button"
          onClick={revivir}
          desactivado={false}
        />
      ) : (
        <Controls
          comer={comer}
          jugar={jugar}
          dormir={dormir}
          vivo={stats.is_alive}
        />
      )}

      {showMenu && (
        <div className="avatar-menu-overlay" onClick={() => setShowMenu(false)}>
          <div className="avatar-menu" onClick={(e) => e.stopPropagation()}>
            <h3>✨ Elige tu Mascota ✨</h3>

            <div className="avatar-grid">
              <div
                className={`avatar-option ${skin === "original" ? "selected" : ""}`}
                onClick={() => {
                  setSkin("original");
                  setShowMenu(false);
                }}
              >
                <img src={imgFeliz} alt="Original" className="preview-normal" />
                <span className="avatar-name">Tama</span>
              </div>

              <div
                className={`avatar-option ${skin === "dracula" ? "selected" : ""}`}
                onClick={() => {
                  setSkin("dracula");
                  setShowMenu(false);
                }}
              >
                {/* PREVIEW DEL MENÚ - CORREGIDO */}
                <div
  className="preview-dracula-animated"
  style={{
    backgroundImage: `url(${imgDracula})`,
  }}
/>
                <span className="avatar-name">Vampiro</span>
              </div>
            </div>

            <div style={{ marginTop: "20px" }}>
              <small>¡Haz clic fuera para cerrar!</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;