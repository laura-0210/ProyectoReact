import { useState, useEffect, useRef, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { StatusScreen } from "./components/StatusScreen";
import Controls from "./components/Controls";
import Button from "./components/Button";

// --- IMPORTS (Asegúrate de que los nombres coincidan con tu carpeta assets/sprites) ---
import imgTamaHappy from "./assets/sprites/happy.gif";
import imgTamaNeutral from "./assets/sprites/neutral.jpeg";
import imgTamaTriste from "./assets/sprites/triste.jpeg";
import imgTamaMimir from "./assets/sprites/dormir.jpeg";

import imgVampiroIdle from "./assets/sprites/gatofeliz.gif"; // gatofeliz.gif
import imgVampiroNom from "./assets/sprites/gatonom.gif"; // gatonom.gif
import imgVampiroPlay from "./assets/sprites/gatoplay.gif"; // gatoplay.gif
import imgVampiroMimir from "./assets/sprites/gatomimir.gif"; // gatomimir.gif

import imgNaranjaIdle from "./assets/sprites/gatoidle.gif"; // gatoidle.gif
import imgNaranjaPlay from "./assets/sprites/gatojuego.gif"; // gatojuego.gif
import imgNaranjaMimir from "./assets/sprites/gatomimirnaranja.gif"; // gatomimirnaranja.gif

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
        if (res.ok && isMounted) setStats(await res.json());
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
      let duration = skin === "naranja" && type === "playing" ? 1600 : 1000;
      actionTimerRef.current = window.setTimeout(() => {
        setCurrentAction(null);
        actionTimerRef.current = null;
      }, duration);
    },
    [skin],
  );

  const getCurrentImage = () => {
    if (!stats.is_alive) return imgMuerte;

    // 1. Prioridad: Acción de COMER (Nom)
    if (currentAction === "eating") {
      if (skin === "vampiro") return imgVampiroNom; // gatonom.gif
      if (skin === "naranja") return imgNaranjaPlay; // Naranja usa jugar (no tiene comer)
      return imgTamaHappy;
    }

    // 2. Prioridad: Acción de JUGAR
    if (currentAction === "playing") {
      if (skin === "vampiro") return imgVampiroPlay; // gatoplay.gif
      if (skin === "naranja") return imgNaranjaPlay; // gatojuego.gif
      return imgTamaHappy;
    }

    // 3. Prioridad: DORMIR (Solo si no hay acción activa)
    if (stats.durmiendo) {
      if (skin === "vampiro") return imgVampiroMimir; // gatomimir.gif
      if (skin === "naranja") return imgNaranjaMimir; // gatomimirnaranja.gif
      return imgTamaMimir;
    }

    // 4. Estado IDLE (Reposo)
    switch (skin) {
      case "vampiro":
        return imgVampiroIdle; // gatofeliz.gif
      case "naranja":
        return imgNaranjaIdle; // gatoidle.gif
      default:
        return stats.hunger > 80 ? imgTamaTriste : imgTamaNeutral;
    }
  };

  return (
    <div className="main-wrapper">
      <div className="app-container">
        <h1 className="witchy-title">✧ FAMILIAR MÁGICO ✧</h1>
        <StatusScreen
          health={stats.health}
          hunger={stats.hunger}
          happiness={stats.happiness}
          petImage={getCurrentImage()}
          onTick={() => {}}
        />
        <div style={{ marginTop: "20px" }}>
          <Button
            texto="Cambio de personaje"
            color="lila-button"
            onClick={() => setShowMenu(true)}
            desactivado={false}
          />
        </div>
        {!stats.is_alive ? (
          <Button
            texto="REVIVIR ✨"
            color="rojo-button"
            onClick={() => fetch(`${API_URL}/revivir`, { method: "POST" })}
            desactivado={false}
          />
        ) : (
          <Controls
            comer={() => {
              startAction("eating");
              fetch(`${API_URL}/comer`, { method: "POST" });
            }}
            jugar={() => {
              startAction("playing");
              fetch(`${API_URL}/jugar`, { method: "POST" });
            }}
            dormir={() => {
              setCurrentAction(null);
              fetch(`${API_URL}/dormir`, { method: "POST" });
            }}
            vivo={stats.is_alive}
          />
        )}
      </div>

      {showMenu && (
        <div className="menu-overlay" onClick={() => setShowMenu(false)}>
          <div className="menu-card" onClick={(e) => e.stopPropagation()}>
            <h2 className="menu-title">Vincular Alma</h2>
            <div className="character-grid">
              <div
                className={`char-card ${skin === "original" ? "active" : ""}`}
                onClick={() => {
                  setSkin("original");
                  setShowMenu(false);
                }}
              >
                <div className="char-preview">
                  <img src={imgTamaNeutral} />
                </div>
                <span>TAMA</span>
              </div>
              <div
                className={`char-card ${skin === "vampiro" ? "active" : ""}`}
                onClick={() => {
                  setSkin("vampiro");
                  setShowMenu(false);
                }}
              >
                <div className="char-preview">
                  <img src={imgVampiroIdle} />
                </div>
                <span>BLANCO</span>
              </div>
              <div
                className={`char-card ${skin === "naranja" ? "active" : ""}`}
                onClick={() => {
                  setSkin("naranja");
                  setShowMenu(false);
                }}
              >
                <div className="char-preview">
                  <img src={imgNaranjaIdle} />
                </div>
                <span>NARANJA</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
