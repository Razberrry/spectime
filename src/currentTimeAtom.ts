import { atom } from 'jotai';

const CURRENT_TIME_INTERVAL_MS = 1000;

const getCurrentTime = (): number => Date.now();

export const currentTimeAtom = atom<number>(getCurrentTime());

currentTimeAtom.onMount = (setValue) => {
  const tick = (): void => {
    setValue(getCurrentTime());
  };

  if (typeof window === 'undefined') {
    return;
  }

  tick();

  const intervalId = window.setInterval(tick, CURRENT_TIME_INTERVAL_MS);

  return () => {
    window.clearInterval(intervalId);
  };
};
