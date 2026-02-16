import { useEffect } from "react";

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

  // Lógica Maestra: Solo animamos si es dracula Y la imagen es la del gato (no muerte)
  const isSpriteSheet = skin === "dracula" && petImage.includes("draculacat");

  return (
    <div className="gameboy-screen">
      {/* Contenedor centrado */}
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
          /* --- MODO SPRITE (Drácula vivo) --- */
          /* Usamos un DIV como ventana para mostrar solo 1 trozo de la imagen */
          <div
            style={{
              width: "64px", // Ancho exacto de 1 gato
              height: "64px", // Alto exacto de 1 gato
              backgroundImage: `url(${petImage})`,
              backgroundRepeat: "no-repeat",
              // EL TRUCO: 600% porque hay 6 gatos en la tira
              backgroundSize: "600% 100%",
              imageRendering: "pixelated",
              transform: "scale(2.5)",
              marginTop: "20px",
              animation: "draculaWalk 1s steps(6) infinite",
            }}
          />
        ) : (
          /* --- MODO NORMAL (Tama original o Drácula muerto) --- */
          <img
            src={petImage}
            alt="Mascota"
            className="pet-avatar"
            // Aseguramos que la imagen normal no se estire rara
            style={{ height: "120px", objectFit: "contain" }}
          />
        )}
      </div>

      {/* ... (Resto de alertas y barras igual que antes) ... */}
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
