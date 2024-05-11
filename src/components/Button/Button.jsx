import "./Button.css";
import clsx from "clsx";

const Button = ({ onClick, active }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx({ button: true, active })}
    >
      {active ? "stop" : "start"}
    </button>
  );
};

export default Button;
