import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DATA from "./data/flight_data.json";
import Button from "./components/Button/Button";
import DirectionMark from "./components/DirectionMark/DirectionMark";
import Plane from "./components/Plane/Plane";
import "./App.css";


function App() {
  const INITSTYLES = useMemo(
    () => ({
      top: "50%",
      left: "50%",
    }),
    []
  );

  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);

  const stylesRef = useRef(INITSTYLES);
  const planeRef = useRef();

  const getStatistics = useCallback((data) => {
    const getRouteData = (segment1, segment2) => {
      const durationSec =
        Number(segment2.timestamp) - Number(segment1.timestamp);

      const averageSpeedKmH =
        (Number(segment2.speed) + Number(segment1.speed)) / 2;

      const averageSpeedMS = Number(
        ((Number(segment1.speed) * 1000) / 3600).toFixed(2)
      );

      const distanceKm = Number(
        ((averageSpeedMS * durationSec) / 1000).toFixed(2)
      );

      return {
        directionStart: Number(segment1.direction),
        directionEnd: Number(segment2.direction),
        durationSec,
        averageSpeedKmH,
        distanceKm,
      };
    };

    return data.reduce((acc, item, index, array) => {
      if (!array[index + 1]) {
        return acc;
      }
      let data = getRouteData(item, array[index + 1]);
      acc.push(data);
      return acc;
    }, []);
  }, []);

  useEffect(() => {
    const SCALE = 36;
    const DIRECTIONS = {
      90: 90,
      180: 180,
      270: 270,
      360: 360,
    };
    if (step === 0) return;

    const direction = getStatistics(DATA)[step].directionEnd;
    const distance = getStatistics(DATA)[step].distanceKm;

    const y = distance * Math.cos((direction * Math.PI) / 180);
    const x = Math.sqrt(Math.pow(distance, 2) - Math.pow(y, 2));

    const prevTop = planeRef.current.style.top;
    const prevLeft = planeRef.current.style.left;

    const isXYTopRight = direction < DIRECTIONS[90];
    const isXYBottomRight =
      direction >= DIRECTIONS[90] && direction < DIRECTIONS[180];
    const isXYBottomLeft =
      direction >= DIRECTIONS[180] && direction < DIRECTIONS[270];
    const isXYTopLeft =
      direction >= DIRECTIONS[270] && direction < DIRECTIONS[360];

    if (isXYTopRight) {
      stylesRef.current = {
        top: `calc(${prevTop} - calc(${y}cm / ${SCALE}))`,
        left: `calc(${prevLeft} + calc(${x}cm / ${SCALE}))`,
        transform: `translate(0, 0) rotate(${direction - 90}deg)`
      };
    } else if (isXYBottomRight) {
      stylesRef.current = {
        top: `calc(${prevTop} + calc(${y}cm / ${SCALE}))`,
        left: `calc(${prevLeft} + calc(${x}cm / ${SCALE}))`,
        transform: `translate(0, 0) rotate(${direction - 90}deg)`
      };
    } else if (isXYBottomLeft) {
      stylesRef.current = {
        top: `calc(${prevTop} + calc(${y}cm / ${SCALE}))`,
        left: `calc(${prevLeft} - calc(${x}cm / ${SCALE}))`,
        transform: `translate(0, 0) rotate(${direction - 90}deg)`
      };
    } else if (isXYTopLeft) {
      stylesRef.current = {
        top: `calc(${prevTop} - calc(${y}cm / ${SCALE}))`,
        left: `calc(${prevLeft} - calc(${x}cm / ${SCALE}))`,
        transform: `translate(0, 0) rotate(${direction - 90}deg)`
      };
    } else {
      return;
    }
  }, [step, getStatistics]);

  useEffect(() => {
    if (!active) {
      stylesRef.current = INITSTYLES;
      setStep(0);
      return;
    }
    let timeoutId = setInterval(() => {
      setStep((prev) => prev < getStatistics(DATA).length - 1 ? prev += 1 : prev);
    }, 200);

    return () => clearInterval(timeoutId);
  }, [active, getStatistics, INITSTYLES]);

  const startMovement = () => {
    setActive((prev) => !prev);
  };

  return (
    <div className="container">
      <DirectionMark direction="W" degree="270" sx="firstBlock" />
      <DirectionMark direction="N" degree="360" sx="secondBlock" />
      <DirectionMark direction="N" degree="180" sx="thirdBlock" />
      <DirectionMark direction="E" degree="90" sx="lastBlock" />
      <Button onClick={startMovement} active={active} />
      <Plane ref={planeRef} styles={stylesRef.current} />
    </div>
  );
}

export default App;
