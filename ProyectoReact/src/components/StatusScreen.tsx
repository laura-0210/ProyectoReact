// src/components/StatusScreen.tsx
import { useEffect } from "react";
import "./StatusScreen.css";

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
}: StatusScreenProps) => {
  // Detección robusta del vampiro
  const isDracula =
    petImage &&
    (petImage.includes("dracula") ||
      petImage.includes("Dracula") ||
      petImage.includes("draculacat"));

  useEffect(() => {
    const timer = setInterval(() => onTick(), 2000);
    return () => clearInterval(timer);
  }, [onTick]);

  const getBgClass = (val: number) => {
    if (val > 50) return "bg-success";
    if (val > 20) return "bg-warning";
    return "bg-danger";
  };

  // --- ESTILO "NUCLEAR" PARA EL DRÁCULA ---
  // Definido aquí para que la minificación de Vercel no lo toque

  return (
    <div className="gameboy-screen">
      <div className="sprite-container">
        {isDracula ? (
          /* APLICAMOS EL ESTILO DIRECTO */
          <div
            className="dracula-sprite"
            style={{ backgroundImage: `url(${petImage})` }}
          />
        ) : (
          <img src={petImage} alt="Mascota" className="pixel-sprite" />
        )}
      </div>

      <div className="alert-area">
        {hunger > 80 && (
          <div className="alert alert-danger pixel-alert">¡HAMBRE! 🍖</div>
        )}
        {happiness < 20 && (
          <div className="alert alert-warning pixel-alert">TRISTE 😢</div>
        )}
        {health < 20 && (
          <div className="alert alert-danger pixel-alert">¡SALUD BAJA! 🚑</div>
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
