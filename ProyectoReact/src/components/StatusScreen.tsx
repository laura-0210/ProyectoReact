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
  skin,
  onTick,
}: StatusScreenProps) => {
  // Solo animamos si es la skin dracula Y no estamos mostrando una imagen de muerte/dormir
  const esVampiroCaminando =
    skin === "dracula" && petImage.includes("draculacat");

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
        {esVampiroCaminando ? (
          /* MODO SPRITE: Ventana de 120px que solo muestra 1 de los 6 gatos */
          <div
            className="dracula-anim-prod"
            style={{ backgroundImage: `url(${petImage})` }}
          />
        ) : (
          /* MODO NORMAL: GIFs o imágenes estáticas */
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
          <div className="alert alert-danger pixel-alert">¡MUERO! 🚑</div>
        )}
      </div>

      <div className="stats-container">
        {/* Barra de Salud */}
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
        {/* Barra de Hambre */}
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
        {/* Barra de Felicidad */}
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
