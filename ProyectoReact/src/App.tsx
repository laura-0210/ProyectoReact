import { useState, useEffect, useRef, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { StatusScreen } from "./components/StatusScreen";
import Controls from "./components/Controls";
import Button from "./components/Button";

// --- IMPORTS (Basados en tu carpeta sprites) ---
import imgTamaHappy from "./assets/sprites/happy.gif";
import imgTamaTriste from "./assets/sprites/triste.jpeg";
import imgTamaMimir from "./assets/sprites/dormir.jpeg";
import imgTamaNeutral from "./assets/sprites/neutral.jpeg";

import imgVampiroIdle from "./assets/sprites/gatofeliz.gif";
import imgVampiroNom from "./assets/sprites/gatonom.gif";
import imgVampiroPlay from "./assets/sprites/gatoplay.gif";
import imgVampiroMimir from "./assets/sprites/gatomimir.gif";

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
  const actionTimerRef = useRef<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchTick = async () => {
      try {
        const res = await fetch(`${API_URL}/tick`, { method: "POST" });
        if (res.ok && isMounted) {
          const data = await res.json();
          setStats(data);
        }
      } catch (e) {
        console.warn("Tick error");
      } finally {
        if (isMounted) setTimeout(fetchTick, 4000);
      }
    };
    fetchTick();
    return () => {
      isMounted = false;
    };
  }, []);

  const startAction = useCallback(
    (type: "eating" | "playing") => {
      if (actionTimerRef.current !== null)
        window.clearTimeout(actionTimerRef.current);
      setCurrentAction(type);
      let duration = skin === "naranja" && type === "playing" ? 1600 : 800;
      actionTimerRef.current = window.setTimeout(() => {
        setCurrentAction(null);
        actionTimerRef.current = null;
      }, duration);
    },
    [skin],
  );

  const jugar = useCallback(() => {
    startAction("playing");
    fetch(`${API_URL}/jugar`, { method: "POST" });
  }, [startAction]);
  const comer = useCallback(() => {
    startAction("eating");
    fetch(`${API_URL}/comer`, { method: "POST" });
  }, [startAction]);
  const dormir = useCallback(() => {
    if (actionTimerRef.current) window.clearTimeout(actionTimerRef.current);
    setCurrentAction(null);
    fetch(`${API_URL}/dormir`, { method: "POST" });
  }, []);

  const getCurrentImage = () => {
    if (!stats.is_alive) return imgMuerte;

    // PRIORIDAD 1: Acciones (Para que se vea el cambio al pulsar botón)
    if (currentAction === "playing") {
      if (skin === "vampiro") return imgVampiroPlay;
      if (skin === "naranja") return imgNaranjaPlay;
      return imgTamaHappy;
    }
    if (currentAction === "eating") {
      if (skin === "vampiro") return imgVampiroNom;
      if (skin === "naranja") return imgNaranjaPlay; // Naranja no tiene comer, usamos jugar
      return imgTamaHappy;
    }

    // PRIORIDAD 2: Sueño
    if (stats.durmiendo) {
      if (skin === "vampiro") return imgVampiroMimir;
      if (skin === "naranja") return imgNaranjaMimir;
      return imgTamaMimir;
    }

    // PRIORIDAD 3: Estados normales
    switch (skin) {
      case "vampiro":
        return imgVampiroIdle;
      case "naranja":
        return imgNaranjaIdle;
      default:
        if (stats.hunger > 80) return imgTamaTriste;
        return imgTamaNeutral;
    }
  };

  return (
    <div className="main-wrapper">
      {" "}
      {/* Este es el fondo de la pantalla */}
      <div className="app-container">
        <h1>GATITO VIRTUAL</h1>
        <StatusScreen
          health={stats.health}
          hunger={stats.hunger}
          happiness={stats.happiness}
          petImage={getCurrentImage()}
          onTick={() => {}}
        />
        <div style={{ marginTop: "15px" }}>
          <Button
            texto="🔄 Cambiar Gato"
            color="lila-button"
            onClick={() => setShowMenu(true)}
            desactivado={false}
          />
        </div>
        {!stats.is_alive ? (
          <Button
            texto="Revivir❤️"
            color="rojo-button"
            onClick={() => fetch(`${API_URL}/revivir`, { method: "POST" })}
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
      </div>
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
                <img src={imgVampiroIdle} alt="Sombrío" />
                <span>Sombrío</span>
              </div>
              <div
                className="avatar-option"
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
