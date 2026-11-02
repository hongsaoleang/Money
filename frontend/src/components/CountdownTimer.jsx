import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(targetDate) - +new Date();
    if (difference <= 0) {
      return null;
    }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return <span className="badge badge-success">Released Now</span>;
  }

  return (
    <div className="countdown-box">
      <div className="countdown-unit">
        <span className="countdown-num">{timeLeft.days}</span>
        <span className="countdown-lbl">Days</span>
      </div>
      <span className="countdown-sep">:</span>
      <div className="countdown-unit">
        <span className="countdown-num">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="countdown-lbl">Hrs</span>
      </div>
      <span className="countdown-sep">:</span>
      <div className="countdown-unit">
        <span className="countdown-num">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="countdown-lbl">Min</span>
      </div>
      <span className="countdown-sep">:</span>
      <div className="countdown-unit">
        <span className="countdown-num">{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className="countdown-lbl">Sec</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
