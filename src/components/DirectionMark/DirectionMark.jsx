import clsx from "clsx";
import "./DirectionMark.css";

const DirectionMark = ({ direction, degree, sx="" }) => {
  return (
    <div className={clsx(["directMark", sx])}>
      <span>{`${direction} ${degree}`}</span>
      <span className="degree">o</span>
    </div>
  );
};

export default DirectionMark;
