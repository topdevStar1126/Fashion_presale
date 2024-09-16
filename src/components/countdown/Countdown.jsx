import { useEffect } from "react";
import { useState } from "react";
import CountdownWrapper from "./Countdown.style";
import FlipCountdown from '@rumess/react-flip-countdown';
import { usePresaleData } from "../../utils/PresaleContext";

const Countdown = ({ endDate, ...props }) => {
  const [remainingTime, setRemainingTime] = useState({
    seconds: "00",
    minutes: "00",
    hours: "00",
    days: "00",
  });
  const {endTime} = usePresaleData();
  const date = new Date(Number(endTime));
  const endDateISO = date.toISOString();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');  // Months are 0-indexed, so add 1
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  useEffect(() => {
    console.log('End Time: ', new Date(Number(endTime)).toLocaleString());
    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = endDate * 1000 - now;

      let timeLeft = {};

      if (difference > 0) {
        timeLeft = {
          days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(
            2,
            "0"
          ),
          hours: String(
            Math.floor((difference / (1000 * 60 * 60)) % 24)
          ).padStart(2, "0"),
          minutes: String(Math.floor((difference / 1000 / 60) % 60)).padStart(
            2,
            "0"
          ),
          seconds: String(Math.floor((difference / 1000) % 60)).padStart(
            2,
            "0"
          ),
        };
      } else {
        timeLeft = { days: "00", hours: "00", minutes: "00", seconds: "00" };
      }

      return timeLeft;
    };

    setRemainingTime(calculateTimeLeft());

    const timer = setInterval(() => {
      setRemainingTime(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <CountdownWrapper {...props}>
      <FlipCountdown 
        hideYear
        hideMonth
        theme='dark' // Options (Default: dark): dark, light.
        size='small'
        dayTitle="Days"  // Customizing the titles
        hourTitle="Hrs"
        minuteTitle="Mins"
        secondTitle="Secs"
        endAt={`2024-12-31`} 
      />
      {/*<table>
        <tr>
          <th>DAY</th>
          <th>HR</th>
          <th>MIN</th>
          <th>SEC</th>
        </tr>
        <tr className="align-content-center">
          <td>{remainingTime.days}</td>
          <td>{remainingTime.hours}</td>
          <td>{remainingTime.minutes}</td>
          <td>{remainingTime.seconds}</td>
        </tr>
      </table>*/}
      {/*<div className="count-item">*/}
      {/*  <span className="count">{remainingTime.days}</span>*/}
      {/*  <span className="label">d</span>*/}
      {/*</div>*/}
      {/*<div className="count-item">*/}
      {/*  <span className="count">{remainingTime.hours}</span>*/}
      {/*  <span className="label">h</span>*/}
      {/*</div>*/}
      {/*<div className="count-item">*/}
      {/*  <span className="count">{remainingTime.minutes}</span>*/}
      {/*  <span className="label">m</span>*/}
      {/*</div>*/}
      {/*<div className="count-item">*/}
      {/*  <span className="count">{remainingTime.seconds}</span>*/}
      {/*  <span className="label">s</span>*/}
      {/*</div>*/}
    </CountdownWrapper>
  );
};

export default Countdown;
