import { useEffect } from "react";
import "./StatusScreen.css";

// Definimos el tipo de Skin para que TypeScript no se queje
export type SkinType = "original" | "dracula";

interface StatusScreenProps {
  health: number;
  hunger: number;
  happiness: number;
  petImage: string;
  skin: SkinType; // Añadimos la prop skin
  onTick: () => void;
}

export const StatusScreen = ({
  health,
  hunger,
  happiness,
  petImage,
  skin,
  onTick,
}: StatusScreenProps) => {
  // Detección robusta del vampiro
  const isDracula = petImage && petImage.includes("draculacat");

  useEffect(() => {
    const timer = setInterval(() => onTick(), 2000);
    return () => clearInterval(timer);
  }, [onTick]);

  const getBgClass = (val: number) => {
    if (val > 50) return "bg-success";
    if (val > 20) return "bg-warning";
    return "bg-danger";
  };

  return (
    <div className="gameboy-screen">
      <div className="sprite-container">
        {isDracula ? (
          /* APLICAMOS EL ESTILO DIRECTO */
          <div
            className="preview-dracula-animated"
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

      {/* --- EL RESTO DE TUS ESTADÍSTICAS (Salud, Hambre...) --- */}
      <div className="stats-container">
        {/* Mantén aquí tus filas de Salud, Hambre y Felicidad igual que las tenías */}
        <div className="stat-row">
          <span className="pixel-text">SALUD</span>
          <div className="progress">
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
          <div className="progress">
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
          <div className="progress">
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
