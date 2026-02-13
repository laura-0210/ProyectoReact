import React, { useEffect } from 'react';
import './StatusScreen.css';

interface StatusScreenProps {
  health: number;
  hunger: number;
  happiness: number;
  petImage: string;    
  onTick: () => void; 
}

export const StatusScreen = ({ health, hunger, happiness, petImage, onTick }: StatusScreenProps) => {

  // Detectamos si es la imagen del drácula
  const isDracula = petImage.includes('dracula');

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

  return (
    <div className="gameboy-screen">
      <div className="sprite-container">
        
        {/* LÓGICA DE VISUALIZACIÓN CORREGIDA */}
        {isDracula ? (
          // OPCIÓN A: Si es Drácula, usamos un DIV con background (Sprite Animation)
          <div 
            className="pixel-sprite dracula-anim"
            style={{ backgroundImage: `url(${petImage})` }}
          />
        ) : (
          // OPCIÓN B: Si es normal, usamos la IMG de siempre
          <img 
            src={petImage} 
            alt="Mascota" 
            className="pixel-sprite" 
          />
        )}

      </div>
  
      <div className="alert-area">
        {hunger > 80 && <div className="alert alert-danger pixel-alert">¡TENGO HAMBRE! 🍖</div>}
        {happiness < 20 && <div className="alert alert-warning pixel-alert">ESTOY TRISTE 😢</div>}
        {health < 20 && <div className="alert alert-danger pixel-alert">¡ME MUERO! 🚑</div>}
      </div>

      <div className="stats-container">
        {/* Barras de estado (igual que antes) */}
        <div className="stat-row">
          <span className="pixel-text">SALUD</span>
          <div className="progress" style={{ height: '20px', border: '2px solid #0f380f' }}>
            <div className={`progress-bar ${getBgClass(health)}`} style={{ width: `${health}%` }}>{health}%</div>
          </div>
        </div>
        
        <div className="stat-row">
          <span className="pixel-text">HAMBRE</span>
          <div className="progress" style={{ height: '20px', border: '2px solid #0f380f' }}>
            <div className={`progress-bar ${hunger > 80 ? 'bg-danger' : 'bg-info'}`} style={{ width: `${hunger}%` }}>{hunger}%</div>
          </div>
        </div>

        <div className="stat-row">
          <span className="pixel-text">FELICIDAD</span>
          <div className="progress" style={{ height: '20px', border: '2px solid #0f380f' }}>
            <div className="progress-bar bg-warning" style={{ width: `${happiness}%`, color: 'black' }}>{happiness}%</div>
          </div>
        </div>
      </div>
    </div>
  ); 
};
