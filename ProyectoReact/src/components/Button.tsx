import "./Button.css";

interface Props {
  texto: string;
  color: string;
  onClick: () => void;
  desactivado: boolean;
}

function Button({ texto, color, onClick, desactivado }: Props) {
  return (
    <button
      className={"cute-button " + color}
      onClick={desactivado ? () => undefined : onClick}
      disabled={desactivado}
    >
      {texto}
    </button>
  );
}

export default Button;
