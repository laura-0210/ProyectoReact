import { useEffect } from "react";
// import "./StatusScreen.css"; // Asegúrate de que este CSS no tenga conflictos con App.css

export type SkinType = "original" | "dracula";

interface StatusScreenProps {
  health: number;
  hunger: number;
  happiness: number;
  petImage: string;
  skin: SkinType;
  onTick: () => void;
}

export const StatusScreen = ({
  health,
  hunger,
  happiness,
  petImage,
  onTick,
  skin,
}: StatusScreenProps) => {
  useEffect(() => {
    // IMPORTANTE: Este intervalo puede duplicar el de App.tsx.
    // Si App.tsx ya hace el tick cada 2s, aquí solo necesitas pintar.
    // Si quieres forzar un refresco visual, está bien, pero cuidado con el rendimiento.
    const timer = setInterval(() => {
      onTick();
    }, 2000);
    return () => clearInterval(timer);
  }, [onTick]);

  const getBgClass = (val: number) => {
    if (val > 50) return "bg-success";
    if (val > 20) return "bg-warning";
    return "bg-danger";
  };

  return (
    <div className="gameboy-screen">
      {/* MANTÉN SIEMPRE LA ESTRUCTURA DE IMAGEN.
         El CSS se encarga de recortar si tiene la clase "dracula-animation" 
      */}
      <div
        className="sprite-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "150px",
        }}
      >
        <img
          src={petImage}
          alt="Mascota"
          // AQUÍ ESTÁ LA MAGIA: Si skin es dracula, añade la clase que activa el CSS de App.css
          className={`pet-avatar ${skin === "dracula" ? "dracula-animation" : ""}`}
        />
      </div>

      <div className="alert-area">
        {hunger > 80 && (
          <div className="alert alert-danger pixel-alert">
            ¡TENGO HAMBRE! 🍖
          </div>
        )}
        {happiness < 20 && (
          <div className="alert alert-warning pixel-alert">ESTOY TRISTE 😢</div>
        )}
        {health < 20 && (
          <div className="alert alert-danger pixel-alert">¡ME MUERO! 🚑</div>
        )}
      </div>

      <div className="stats-container">
        {/* Barras de estado... */}
        <div className="stat-row">
          <span className="pixel-text">SALUD</span>
          <div
            className="progress"
            style={{ height: "20px", border: "2px solid #0f380f" }}
          >
            <div
              className={`progress-bar ${getBgClass(health)}`}
              style={{ width: `${health}%` }}
            >
              {health}%
            </div>
          </div>
        </div>

        <div className="stat-row">
          <span className="pixel-text">HAMBRE</span>
          <div
            className="progress"
            style={{ height: "20px", border: "2px solid #0f380f" }}
          >
            <div
              className={`progress-bar ${hunger > 80 ? "bg-danger" : "bg-info"}`}
              style={{ width: `${hunger}%` }}
            >
              {hunger}%
            </div>
          </div>
        </div>

        <div className="stat-row">
          <span className="pixel-text">FELICIDAD</span>
          <div
            className="progress"
            style={{ height: "20px", border: "2px solid #0f380f" }}
          >
            <div
              className="progress-bar bg-warning"
              style={{ width: `${happiness}%`, color: "black" }}
            >
              {happiness}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
