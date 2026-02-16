import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { StatusScreen } from "./components/StatusScreen";
import Controls from "./components/Controls";
import Button from "./components/Button"; // Importamos tu botón cuqui

// Imágenes Originales
import imgFeliz from "./assets/sprites/happy.gif";
import imgEnfadado from "./assets/sprites/enfadado.jpeg";
import imgTriste from "./assets/sprites/triste.jpeg";
import imgNeutral from "./assets/sprites/neutral.jpeg";
import imgDormir from "./assets/sprites/dormir.jpeg";
import imgMuerteCaida from "./assets/sprites/muerte2.jpeg";
import imgMuerteFinal from "./assets/sprites/muerte3.jpeg";

// Nueva Imagen Drácula
import imgDracula from "./assets/sprites/draculacat.png";

const API_URL = "http://localhost:8000";

function App() {
  const [stats, setStats] = useState({
    health: 100,
    hunger: 20,
    happiness: 100,
    durmiendo: false,
    is_alive: true,
  });

  const [muerteFinalizada, setMuerteFinalizada] = useState(false);

  // --- NUEVO: ESTADOS PARA EL AVATAR ---
  const [skin, setSkin] = useState<"original" | "dracula">("original");
  const [showMenu, setShowMenu] = useState(false);

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

  // --- LÓGICA DE IMAGEN MEJORADA ---
  const getCurrentImage = () => {
    // Si elegimos DRACULA, mostramos su sprite sheet
    // (Nota: Como es una tira, podrías necesitar CSS extra en StatusScreen
    // si quieres animarlo, pero por ahora lo mostramos tal cual o la primera frame)
    if (skin === "dracula") {
      // Si está muerto, podrías mostrar otra cosa, pero por ahora devolvemos el drácula
      if (stats.health <= 0) return imgMuerteFinal;
      return imgDracula;
    }

    // Lógica Original
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
        // Pasamos una clase extra si es dracula para recortarlo en la pantalla principal también
        // (Esto es un truco rápido, idealmente editarías StatusScreen también)
        onTick={() => {}}
      />

      {/* --- BOTÓN PARA ABRIR EL MENÚ DE AVATAR --- */}
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

      {/* --- EL MENÚ MODAL CUQUI --- */}
      {showMenu && (
        <div className="avatar-menu-overlay" onClick={() => setShowMenu(false)}>
          <div className="avatar-menu" onClick={(e) => e.stopPropagation()}>
            <h3>✨ Elige tu Mascota ✨</h3>

            <div className="avatar-grid">
              {/* OPCIÓN 1: ORIGINAL */}
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

              {/* OPCIÓN 2: DRACULA CAT */}
              <div
                className={`avatar-option ${skin === "dracula" ? "selected" : ""}`}
                onClick={() => {
                  setSkin("dracula");
                  setShowMenu(false);
                }}
              >
                {/* Aquí usamos la clase especial para recortar la tira de sprites */}
                <img
                  src={imgDracula}
                  alt="Dracula"
                  className="preview-dracula"
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
