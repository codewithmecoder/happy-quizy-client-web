import { Dispatch, MutableRefObject, SetStateAction, useState } from 'react';

const useTimer = (
  setTimer: Dispatch<SetStateAction<string>>,
  intervalRef: MutableRefObject<NodeJS.Timer | null>
) => {
  const [isTimeOut, setIsTimeOut] = useState<boolean>(false);
  const getTimeRemaining = (endTime: number) => {
    const now = Date.now();
    const total = endTime - now;
    const seconds = Math.floor((total / 1000) % 60);
    const mins = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total * 60 * 60) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return { total, days, hours, mins, seconds };
  };

  const startTimer = (deadLine: number) => {
    let { total, days, hours, mins, seconds } = getTimeRemaining(deadLine);
    if (total >= 0) {
      const _hours = hours > 9 ? hours : `0${hours}`;
      const _mins = mins > 9 ? mins : `0${mins}`;
      const _seconds = seconds > 9 ? seconds : `0${seconds}`;
      const fullTimeDisplay = `${_hours}:${_mins}:${_seconds}`;
      setTimer(fullTimeDisplay);
      if (total < 1000) setIsTimeOut(true);
      else setIsTimeOut(false);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsTimeOut(false);
    }
  };

  const clearTimer = (endTime: number, defaultDisplay: string): void => {
    setTimer(defaultDisplay);
    if (intervalRef.current) clearInterval(intervalRef.current);
    const id = setInterval(() => {
      startTimer(endTime);
    }, 1000);
    intervalRef.current = id;
  };

  return { isTimeOut, clearTimer };

  // const resetTimer = () => {
  //   if (intervalRef.current) clearInterval(intervalRef.current);
  //   clearTimer(
  //     getDeadLineTimer({ seconds: 10 }),
  //     defualtTimeDisplayEachQuestion
  //   );
  // };
};

export default useTimer;
