// src/App.tsx
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { StatusScreen } from "./components/StatusScreen";
import Controls from "./components/Controls";
import Button from "./components/Button";

// --- NUEVOS GIFS (Skin Original) ---
import imgFeliz from "./assets/sprites/gatofeliz.gif";
import imgMimir from "./assets/sprites/gatomimir.gif";
import imgPlay from "./assets/sprites/gatoplay.gif";
import imgTriste from "./assets/sprites/gatotriste.gif";
import imgMuerte from "./assets/sprites/muerte3.jpeg";

// --- SKIN DRÁCULA (Mantenemos la opción) ---
import imgDracula from "./assets/sprites/draculacat.png"; // O el .gif si lo prefieres

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function App() {
  const [stats, setStats] = useState({
    health: 100,
    hunger: 20,
    happiness: 100,
    durmiendo: false,
    is_alive: true,
  });

  const [skin, setSkin] = useState<"original" | "dracula">("original");
  const [showMenu, setShowMenu] = useState(false);
  const [isAnimatingPlay, setIsAnimatingPlay] = useState(false);

  // Lógica de sincronización con Backend
  useEffect(() => {
    const fetchEstado = async () => {
      try {
        const response = await fetch(`${API_URL}/estado`);
        const data = await response.json();
        setStats(data);
      } catch (e) {
        console.error("Error al conectar");
      }
    };
    fetchEstado();
  }, []);

  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const response = await fetch(`${API_URL}/tick`, { method: "POST" });
        const data = await response.json();
        setStats(data);
      } catch (e) {
        console.error("Servidor OFF");
      }
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Acciones
  const jugar = async () => {
    setIsAnimatingPlay(true);
    await fetch(`${API_URL}/jugar`, { method: "POST" });
    setTimeout(() => setIsAnimatingPlay(false), 3000);
  };

  const comer = () => fetch(`${API_URL}/comer`, { method: "POST" });
  const dormir = () => fetch(`${API_URL}/dormir`, { method: "POST" });
  const revivir = () => fetch(`${API_URL}/revivir`, { method: "POST" });

  // --- LÓGICA DE SELECCIÓN DE IMAGEN (El corazón de la App) ---
  const getCurrentImage = () => {
    // Caso 1: Skin Drácula (Usa su PNG/GIF)
    if (skin === "dracula") return imgDracula;

    // Caso 2: Skin Original (Usa los nuevos GIFs según estado)
    if (!stats.is_alive) return imgMuerte;
    if (stats.durmiendo) return imgMimir;
    if (isAnimatingPlay) return imgPlay;
    if (stats.hunger > 80 || stats.happiness < 30) return imgTriste;
    return imgFeliz;
  };

  return (
    <div className="app-container">
      <h1>GATITO VIRTUAL</h1>

      <StatusScreen
        health={stats.health}
        hunger={stats.hunger}
        happiness={stats.happiness}
        petImage={getCurrentImage()}
        skin={skin}
        onTick={() => {}}
      />

      {/* RE-AÑADIDO: Botón de cambiar avatar */}
      <div style={{ marginTop: "15px" }}>
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

      {/* RE-AÑADIDO: Modal de selección */}
      {showMenu && (
        <div className="avatar-menu-overlay" onClick={() => setShowMenu(false)}>
          <div className="avatar-menu" onClick={(e) => e.stopPropagation()}>
            <h3>Elige tu Mascota</h3>
            <div className="avatar-grid">
              <div
                className={`avatar-option ${skin === "original" ? "selected" : ""}`}
                onClick={() => {
                  setSkin("original");
                  setShowMenu(false);
                }}
              >
                <img src={imgFeliz} alt="Original" />
                <span>Tama</span>
              </div>
              <div
                className={`avatar-option ${skin === "dracula" ? "selected" : ""}`}
                onClick={() => {
                  setSkin("dracula");
                  setShowMenu(false);
                }}
              >
                <img
                  src={imgDracula}
                  alt="Dracula"
                  style={{ imageRendering: "pixelated" }}
                />
                <span>Vampiro</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
