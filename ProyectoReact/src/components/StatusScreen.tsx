// src/components/StatusScreen.tsx
import "./StatusScreen.css";

interface StatusScreenProps {
  health: number;
  hunger: number;
  happiness: number;
  petImage: string;
  onTick: () => void;
}

export const StatusScreen = ({
  health,
  hunger,
  happiness,
  petImage,
}: StatusScreenProps) => {
  // Función para cambiar color de barras según porcentaje
  const getBgClass = (val: number, reverse: boolean = false) => {
    if (reverse) {
      // Para el hambre: más alto es peor
      if (val < 40) return "bg-success";
      if (val < 80) return "bg-warning";
      return "bg-danger";
    }
    // Para salud y felicidad: más alto es mejor
    if (val > 60) return "bg-success";
    if (val > 30) return "bg-warning";
    return "bg-danger";
  };

  return (
    <div className="gameboy-screen">
      {/* Contenedor del gato centrado */}
      <div className="sprite-container">
        <img src={petImage} alt="Mascota" className="pixel-sprite" />
      </div>

      {/* Área de alertas parpadeantes */}
      <div className="alert-area">
        {hunger > 80 && <div className="pixel-alert">¡HAMBRE! 🍖</div>}
        {happiness < 20 && <div className="pixel-alert">TRISTE 😢</div>}
        {health < 20 && <div className="pixel-alert">¡SALUD BAJA! 🚑</div>}
      </div>

      <div className="stats-container">
        {/* Barra de Salud */}
        <div className="stat-row">
          <span className="pixel-text">SALUD</span>
          <div className="progress">
            <div
              className={`progress-bar ${getBgClass(health)}`}
              style={{ width: `${health}%`, transition: "width 0.5s" }}
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
              className={`progress-bar ${getBgClass(hunger, true)}`}
              style={{ width: `${hunger}%`, transition: "width 0.5s" }}
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
              className={`progress-bar ${getBgClass(happiness)}`}
              style={{
                width: `${happiness}%`,
                color: "black",
                transition: "width 0.5s",
              }}
            >
              {happiness}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
