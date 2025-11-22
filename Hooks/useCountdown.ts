import {useEffect, useState} from 'react';

export const useCountdownTimer = (startTime: number) => {
  const [timeLeft, setTimeLeft] = useState<string>('01:00:00'); // Default to 1 hour

  useEffect(() => {
    const oneHourBeforeStart = startTime - 60 * 60 * 1000;

    const updateCountdown = () => {
      const currentTime = new Date().getTime();
      const remainingTime = startTime - currentTime;

      if (currentTime >= oneHourBeforeStart && currentTime < startTime) {
        const hours = Math.floor(remainingTime / (1000 * 60 * 60));
        const minutes = Math.floor(
          (remainingTime % (1000 * 60 * 60)) / (1000 * 60),
        );
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        // Format time as hh:mm:ss
        const formattedTime = `${String(hours).padStart(2, '0')}:${String(
          minutes,
        ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        setTimeLeft(formattedTime);
      } else {
        setTimeLeft('00:00:00'); // When the countdown finishes
      }
    };

    // Update every second
    const intervalId = setInterval(updateCountdown, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [startTime]);

  return timeLeft;
};
