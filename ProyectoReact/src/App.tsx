// src/App.tsx
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { StatusScreen } from "./components/StatusScreen";
import Controls from "./components/Controls";
import Button from "./components/Button";

// --- PERSONAJE 1: ORIGINAL (Tama) ---
import imgFeliz from "./assets/sprites/happy.gif";
import imgTriste from "./assets/sprites/triste.jpeg";
import imgDormir from "./assets/sprites/dormir.jpeg";

// --- PERSONAJE 2: SOMBRÍO (Vampiro GIFs) ---
import imgVampiroIdle from "./assets/sprites/gatonom.gif";
import imgVampiroPlay from "./assets/sprites/gatoplay.gif";
import imgVampiroTriste from "./assets/sprites/gatotriste.gif";

// --- PERSONAJE 3: NARANJA ---
import imgNaranjaIdle from "./assets/sprites/gatoidle.gif";
import imgNaranjaPlay from "./assets/sprites/gatojuego.gif";
import imgNaranjaMimir from "./assets/sprites/gatomimirnaranja.gif";

// COMÚN
import imgMuerte from "./assets/sprites/muerte3.jpeg";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function App() {
  const [stats, setStats] = useState({
    health: 100,
    hunger: 20,
    happiness: 100,
    durmiendo: false,
    is_alive: true,
  });

  const [skin, setSkin] = useState<"original" | "vampiro" | "naranja">(
    "original",
  );
  const [showMenu, setShowMenu] = useState(false);
  const [isAnimatingPlay, setIsAnimatingPlay] = useState(false);

  // Sincronización con Backend
  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/tick`, { method: "POST" });
        const data = await res.json();
        setStats(data);
      } catch (e) {
        console.error("Backend offline");
      }
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const jugar = async () => {
    setIsAnimatingPlay(true);
    await fetch(`${API_URL}/jugar`, { method: "POST" });
    setTimeout(() => setIsAnimatingPlay(false), 2500); // 2.5 seg de animación
  };

  const comer = () => fetch(`${API_URL}/comer`, { method: "POST" });
  const dormir = () => fetch(`${API_URL}/dormir`, { method: "POST" });
  const revivir = () => fetch(`${API_URL}/revivir`, { method: "POST" });

  // --- LÓGICA DE IMAGEN POR PERSONAJE ---
  const getCurrentImage = () => {
    if (!stats.is_alive) return imgMuerte;

    switch (skin) {
      case "vampiro":
        if (isAnimatingPlay) return imgVampiroPlay;
        if (stats.hunger > 70) return imgVampiroTriste;
        return imgVampiroIdle;

      case "naranja":
        if (stats.durmiendo) return imgNaranjaMimir;
        if (isAnimatingPlay) return imgNaranjaPlay;
        return imgNaranjaIdle;

      default: // Original / Tama
        if (stats.durmiendo) return imgDormir;
        if (stats.hunger > 70 || stats.happiness < 30) return imgTriste;
        return imgFeliz;
    }
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
          texto="🔄 Cambiar Personaje"
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

      {/* MODAL DE SELECCIÓN CON 3 OPCIONES */}
      {showMenu && (
        <div className="avatar-menu-overlay" onClick={() => setShowMenu(false)}>
          <div className="avatar-menu" onClick={(e) => e.stopPropagation()}>
            <h3>¿Quién quieres ser hoy?</h3>
            <div className="avatar-grid">
              <div
                className={`avatar-option ${skin === "original" ? "selected" : ""}`}
                onClick={() => {
                  setSkin("original");
                  setShowMenu(false);
                }}
              >
                <img src={imgFeliz} alt="Tama" />
                <span>Tama</span>
              </div>
              <div
                className={`avatar-option ${skin === "vampiro" ? "selected" : ""}`}
                onClick={() => {
                  setSkin("vampiro");
                  setShowMenu(false);
                }}
              >
                <img src={imgVampiroIdle} alt="Sombrío" />
                <span>Sombrío</span>
              </div>
              <div
                className={`avatar-option ${skin === "naranja" ? "selected" : ""}`}
                onClick={() => {
                  setSkin("naranja");
                  setShowMenu(false);
                }}
              >
                <img src={imgNaranjaIdle} alt="Naranja" />
                <span>Naranjita</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
