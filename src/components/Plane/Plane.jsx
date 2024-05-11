import clsx from "clsx";
import { forwardRef } from 'react';
import { IoAirplane } from "react-icons/io5";
import "./Plane.css";

const Plane = forwardRef(function Plane({sx, styles={}}, ref) {
  return (
		 <div ref={ref} className={clsx(["plane", sx])} style={styles}>
      <IoAirplane></IoAirplane>
     </div>
  );
});
export default Plane;