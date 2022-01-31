import React, { useEffect } from "react";
import { useState } from "react/cjs/react.development";
import { interval, Subject, takeUntil } from "rxjs";
import s from "./StopWatch.module.css";

const StopWatch = () => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const stream$ = new Subject();
    if (isActive && isPaused === false) {
      interval(1000)
        .pipe(takeUntil(stream$))
        .subscribe(() => {
          setTime((prev) => prev + 1);
        });
    }
    return () => {
      stream$.next();
      stream$.complete();
    };
  }, [isActive, isPaused]);
  console.log(time);

  const onClickStart = () => {
    setIsActive((prev) => !prev);
    setIsPaused((prev) => !prev);
  };

  const onClickStop = () => {
    setIsPaused(!isPaused);
    setIsActive(!isActive);
    setTime(0);
  };

  const onClickWait = () => {
    setTimeout(() => {
      setIsPaused(!isPaused);
      setIsActive(!isActive);
    }, 300);
  };

  const onClickReset = () => {
    setTime(0);
    setIsActive(false);
    setIsPaused(true);
    onClickStart();
  };

  return (
    <div className={s.container}>
      <h1 className={s.title}>Stopwatch</h1>
      <div className={s.timeWrapper}>
        <span className={s.timer}>
          {("0" + (Math.floor(time / 3600) % 24)).slice(-2)}
        </span>
        <span className={s.doubleComa}>:</span>
        <span className={s.timer}>
          {("0" + Math.floor((time / 60) % 60)).slice(-2)}
        </span>
        <span className={s.doubleComa}>:</span>
        <span className={s.timer}>
          {("0" + Math.floor(time % 60)).slice(-2)}
        </span>
      </div>
      <div className={s.buttonWrapper}>
        {isActive ? (
          <button className={s.button} onClick={onClickStop} type="button">
            Stop
          </button>
        ) : (
          <button className={s.button} onClick={onClickStart} type="button">
            Start
          </button>
        )}
        <button className={s.button} onClick={onClickWait} type="button">
          Wait
        </button>
        <button className={s.button} onClick={onClickReset} type="button">
          Reset
        </button>
      </div>
    </div>
  );
};

export default StopWatch;
