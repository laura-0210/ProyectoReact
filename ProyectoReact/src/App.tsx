// src/App.tsx
import { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { StatusScreen } from "./components/StatusScreen";
import Controls from "./components/Controls";
import Button from "./components/Button";

// --- PERSONAJE 1: TAMA (Original) ---
import imgTamaHappy from "./assets/sprites/happy.gif";
import imgTamaTriste from "./assets/sprites/triste.jpeg";
import imgTamaMimir from "./assets/sprites/dormir.jpeg";

// --- PERSONAJE 2: SOMBRÍO (Mapeo exacto solicitado) ---
import imgSombrioIdle from "./assets/sprites/gatofeliz.gif";
import imgSombrioNom from "./assets/sprites/gatonom.gif";
import imgSombrioPlay from "./assets/sprites/gatoplay.gif";
import imgSombrioMimir from "./assets/sprites/gatomimir.gif";

// --- PERSONAJE 3: NARANJA ---
import imgNaranjaIdle from "./assets/sprites/gatoidle.gif";
import imgNaranjaPlay from "./assets/sprites/gatojuego.gif";
import imgNaranjaMimir from "./assets/sprites/gatomimirnaranja.gif";

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
  const [currentAction, setCurrentAction] = useState<
    "eating" | "playing" | null
  >(null);

  // ✅ SOLUCIÓN AL ERROR: Usamos 'number' en lugar de 'NodeJS.Timeout'
  const actionTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/tick`, { method: "POST" });
        const data = await res.json();
        setStats(data);
      } catch (e) {
        console.error("Error tick");
      }
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Función para manejar acciones e interrumpir las anteriores de inmediato
  const startAction = (type: "eating" | "playing") => {
    // Si ya había un temporizador, lo matamos para cambiar al nuevo GIF ya mismo
    if (actionTimerRef.current) window.clearTimeout(actionTimerRef.current);

    setCurrentAction(type); // Cambio instantáneo

    // Programamos la vuelta al estado normal
    actionTimerRef.current = window.setTimeout(() => {
      setCurrentAction(null);
    }, 3000);
  };

  const jugar = async () => {
    startAction("playing");
    await fetch(`${API_URL}/jugar`, { method: "POST" });
  };

  const comer = async () => {
    startAction("eating");
    await fetch(`${API_URL}/comer`, { method: "POST" });
  };

  const dormir = async () => {
    if (actionTimerRef.current) window.clearTimeout(actionTimerRef.current);
    setCurrentAction(null);
    await fetch(`${API_URL}/dormir`, { method: "POST" });
  };

  const revivir = () => fetch(`${API_URL}/revivir`, { method: "POST" });

  const getCurrentImage = () => {
    if (!stats.is_alive) return imgMuerte;

    switch (skin) {
      case "vampiro": // GATO SOMBRÍO
        if (stats.durmiendo) return imgSombrioMimir;
        if (currentAction === "eating") return imgSombrioNom;
        if (currentAction === "playing") return imgSombrioPlay;
        return imgSombrioIdle;

      case "naranja": // GATO NARANJA
        if (stats.durmiendo) return imgNaranjaMimir;
        if (currentAction === "playing") return imgNaranjaPlay;
        return imgNaranjaIdle;

      default: // TAMA ORIGINAL
        if (stats.durmiendo) return imgTamaMimir;
        if (currentAction === "playing") return imgTamaHappy;
        if (stats.hunger > 80) return imgTamaTriste;
        return imgTamaHappy;
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
      {showMenu && (
        <div className="avatar-menu-overlay" onClick={() => setShowMenu(false)}>
          <div className="avatar-menu" onClick={(e) => e.stopPropagation()}>
            <div className="avatar-grid">
              <div
                className="avatar-option"
                onClick={() => {
                  setSkin("original");
                  setShowMenu(false);
                }}
              >
                <img src={imgTamaHappy} alt="Tama" />
                <span>Tama</span>
              </div>
              <div
                className="avatar-option"
                onClick={() => {
                  setSkin("vampiro");
                  setShowMenu(false);
                }}
              >
                <img src={imgSombrioIdle} alt="Sombrío" />
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
                <span>Naranja</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
