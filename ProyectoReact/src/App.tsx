import { useState, useEffect, useRef, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { StatusScreen } from "./components/StatusScreen";
import Controls from "./components/Controls";
import Button from "./components/Button";

import imgTamaHappy from "./assets/sprites/happy.gif";
import imgTamaTriste from "./assets/sprites/triste.jpeg";
import imgTamaMimir from "./assets/sprites/dormir.jpeg";
import imgSombrioIdle from "./assets/sprites/gatofeliz.gif";
import imgSombrioNom from "./assets/sprites/gatonom.gif";
import imgSombrioPlay from "./assets/sprites/gatoplay.gif";
import imgSombrioMimir from "./assets/sprites/gatomimir.gif";
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
        if (isMounted) setTimeout(fetchTick, 5000);
      }
    };
    fetchTick();
    return () => {
      isMounted = false;
    };
  }, []);

  // --- FUNCIÓN MODIFICADA PARA TIEMPO VARIABLE ---
  const startAction = useCallback(
    (type: "eating" | "playing") => {
      // 1. Limpiar timer anterior
      if (actionTimerRef.current !== null) {
        window.clearTimeout(actionTimerRef.current);
      }

      // 2. Calcular duración: 800ms normal, 1600ms si es naranja jugando
      let duration = 800;
      if (skin === "naranja" && type === "playing") {
        duration = 1600;
      }

      // 3. Iniciar acción y timer con la duración calculada
      setCurrentAction(type);
      actionTimerRef.current = window.setTimeout(() => {
        setCurrentAction(null);
        actionTimerRef.current = null;
      }, duration);
    },
    [skin],
  ); // 👈 ¡IMPORTANTE! Añadimos [skin] aquí para que detecte el cambio de personaje

  const jugar = useCallback(() => {
    startAction("playing");
    fetch(`${API_URL}/jugar`, { method: "POST" });
  }, [startAction]);

  const comer = useCallback(() => {
    startAction("eating");
    fetch(`${API_URL}/comer`, { method: "POST" });
  }, [startAction]);

  const dormir = useCallback(() => {
    if (actionTimerRef.current !== null) {
      window.clearTimeout(actionTimerRef.current);
      actionTimerRef.current = null;
    }
    setCurrentAction(null);
    fetch(`${API_URL}/dormir`, { method: "POST" });
  }, []);

  const revivir = useCallback(() => {
    fetch(`${API_URL}/revivir`, { method: "POST" });
  }, []);

  const getCurrentImage = () => {
    if (!stats.is_alive) return imgMuerte;

    switch (skin) {
      case "vampiro":
        if (stats.durmiendo) return imgSombrioMimir;
        if (currentAction === "eating") return imgSombrioNom;
        if (currentAction === "playing") return imgSombrioPlay;
        return imgSombrioIdle;
      case "naranja":
        if (stats.durmiendo) return imgNaranjaMimir;
        if (currentAction === "playing") return imgNaranjaPlay;
        return imgNaranjaIdle;
      default:
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
          texto="🔄 Personaje"
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
