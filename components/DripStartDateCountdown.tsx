import React, { useState, useEffect } from 'react';

interface Props {
  startDate: string;
}

const DripStartDateCountdown: React.FC<Props> = ({ startDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const startTime = new Date(startDate).getTime();
    const currentTime = new Date().getTime();
    const timeDiff = startTime - currentTime;

    if (timeDiff > 0) {
      const intervalId = setInterval(() => {
        const newTimeDiff = startTime - new Date().getTime();
        if (newTimeDiff > 0) {
          const days = Math.floor(newTimeDiff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((newTimeDiff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((newTimeDiff / (1000 * 60)) % 60);
          const seconds = Math.floor((newTimeDiff / 1000) % 60);
          setTimeLeft({ days, hours, minutes, seconds });
        } else {
          clearInterval(intervalId);
        }
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [startDate]);

  const { days, hours, minutes, seconds } = timeLeft;

  return (
    <div className="flex gap-5">
      <div className="grid grid-flow-col gap-5 text-center auto-cols-max mb-12">
        <div className="flex flex-col">
          <span className="countdown text-5xl">
            <span style={{ '--value': String(days).padStart(2, '0') } as any}>{days}</span>
          </span>
          days
        </div>
        <div className="flex flex-col">
          <span className="countdown text-5xl">
            <span style={{ '--value': String(hours).padStart(2, '0') } as any}>{hours}</span>
          </span>
          hours
        </div>
        <div className="flex flex-col">
          <span className="countdown text-5xl">
            <span style={{ '--value': String(minutes).padStart(2, '0') } as any}>{minutes}</span>
          </span>
          min
        </div>
        <div className="flex flex-col">
          <span className="countdown text-5xl">
            <span style={{ '--value': String(seconds).padStart(2, '0') } as any}>{seconds}</span>
          </span>
          sec
        </div>
      </div>
    </div>
  );
};

export default DripStartDateCountdown;
