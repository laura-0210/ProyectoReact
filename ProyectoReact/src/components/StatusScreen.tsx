import { useEffect } from "react";
// import "./StatusScreen.css";

export type SkinType = "original" | "dracula";

interface StatusScreenProps {
  health: number;
  hunger: number;
  happiness: number;
  petImage: string; // La URL de la imagen
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

  // --- DETECCIÓN INTELIGENTE ---
  // Solo activamos el modo sprite si estamos en modo Drácula
  // Y la imagen actual es la tira de sprites (draculacat).
  // Si petImage es "muerte3.jpeg", esto será falso y mostrará la img normal.
  const isSpriteSheet = skin === "dracula" && petImage.includes("draculacat");

  return (
    <div className="gameboy-screen">
      <div
        className="sprite-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "150px",
        }}
      >
        {isSpriteSheet ? (
          /* MODO SPRITE: Un DIV con la imagen de fondo que se mueve */
          <div
            className="dracula-sprite"
            style={{ backgroundImage: `url(${petImage})` }}
          />
        ) : (
          /* MODO NORMAL: Una imagen estática (muerto, original, etc) */
          <img src={petImage} alt="Mascota" className="pet-avatar" />
        )}
      </div>

      {/* ... (El resto de tus alertas y barras sigue igual) ... */}
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
        {/* Aquí van tus barras de progreso (Salud, Hambre, Felicidad) */}
        {/* (Copia tus barras de progreso del código anterior aquí si las borraste) */}
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
