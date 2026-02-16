import "./StatusScreen.css";

export const StatusScreen = ({ health, hunger, happiness, petImage }: any) => {
  const getBgClass = (val: number, isHunger: boolean = false) => {
    if (isHunger) {
      if (val < 30) return "bg-witch-green";
      if (val < 75) return "bg-witch-yellow";
      return "bg-witch-red";
    }
    if (val > 65) return "bg-witch-green";
    if (val > 25) return "bg-witch-yellow";
    return "bg-witch-red";
  };

  return (
    <div className="gameboy-screen">
      <div className="sprite-container">
        <img src={petImage} alt="Mascota" className="pixel-sprite" />
      </div>
      <div className="stats-container">
        <div className="stat-row">
          <span className="pixel-text">SALUD</span>
          <div className="progress">
            <div
              className={`progress-bar ${getBgClass(health)}`}
              style={{ width: `${health}%`, transition: "width 0.5s" }}
            />
          </div>
        </div>
        <div className="stat-row">
          <span className="pixel-text">HAMBRE</span>
          <div className="progress">
            <div
              className={`progress-bar ${getBgClass(hunger, true)}`}
              style={{ width: `${hunger}%`, transition: "width 0.5s" }}
            />
          </div>
        </div>
        <div className="stat-row">
          <span className="pixel-text">FELICIDAD</span>
          <div className="progress">
            <div
              className={`progress-bar ${getBgClass(happiness)}`}
              style={{ width: `${happiness}%`, transition: "width 0.5s" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
