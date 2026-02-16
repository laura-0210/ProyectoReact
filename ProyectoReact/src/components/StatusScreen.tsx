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
  const getBgClass = (val: number) => {
    if (val > 50) return "bg-success";
    if (val > 20) return "bg-warning";
    return "bg-danger";
  };

  return (
    <div className="gameboy-screen">
      <div className="sprite-container">
        <img src={petImage} alt="Mascota" className="pixel-sprite" />
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
