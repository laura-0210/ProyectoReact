import Button from "./Button";
import "./Controls.css";

interface Props {
  comer: () => void;
  jugar: () => void;
  dormir: () => void;
  vivo: boolean;
}

function Controls({ comer, jugar, dormir, vivo }: Props) {
  return (
    <div className="control-panel d-flex justify-content-center gap-3 mt-4">
      <Button
        texto="Alimentar"
        color="rosa-button"
        onClick={comer}
        desactivado={!vivo}
      />

      <Button
        texto="Jugar"
        color="verde-button"
        onClick={jugar}
        desactivado={!vivo}
      />

      <Button
        texto="Dormir"
        color="lila-button"
        onClick={dormir}
        desactivado={!vivo}
      />
    </div>
  );
}

export default Controls;
