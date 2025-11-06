import { useLayoutEffect, useRef } from 'react';
import type { Atom } from 'jotai';
import { useStore } from 'jotai';
import { useTimelineContext } from 'chronon-timeline';

type CurrentTimeValue = number | Date;

const toMilliseconds = (value: CurrentTimeValue): number =>
  typeof value === 'number' ? value : value.getTime();

const isDocumentVisible = (): boolean =>
  typeof document === 'undefined' || document.visibilityState === 'visible';

export interface UseTimelineAutoPanUntilInteractionOptions<
  T extends CurrentTimeValue = CurrentTimeValue,
> {
  currentTimeAtom: Atom<T>;
}

export interface UseTimelineAutoPanUntilInteractionResult {
  resetAutopan: () => void;
}

export const useTimelineAutoPanUntilInteraction = <T extends CurrentTimeValue>({
  currentTimeAtom,
}: UseTimelineAutoPanUntilInteractionOptions<T>): UseTimelineAutoPanUntilInteractionResult => {
  const { timelineRef, onRangeChanged } = useTimelineContext();
  const store = useStore();

  const hasUserInteractedRef = useRef(false);
  const previousTimeInMillisecondsRef = useRef<number | null>(null);
  const latestTimeInMillisecondsRef = useRef<number | null>(null);
  const unsubscribeRef = useRef<null | (() => void)>(null);

  const applyTick = (nextValue: T): void => {
    const nextTimeInMilliseconds = toMilliseconds(nextValue as CurrentTimeValue);
    latestTimeInMillisecondsRef.current = nextTimeInMilliseconds;

    if (!isDocumentVisible()) {
      previousTimeInMillisecondsRef.current = nextTimeInMilliseconds;
      return;
    }

    if (hasUserInteractedRef.current) {
      previousTimeInMillisecondsRef.current = nextTimeInMilliseconds;
      return;
    }

    const previousTimeInMilliseconds = previousTimeInMillisecondsRef.current;
    if (previousTimeInMilliseconds === null) {
      previousTimeInMillisecondsRef.current = nextTimeInMilliseconds;
      return;
    }

    const delta = nextTimeInMilliseconds - previousTimeInMilliseconds;
    if (delta === 0) return;

    onRangeChanged(({ start, end }) => ({
      start: start + delta,
      end: end + delta,
    }));

    previousTimeInMillisecondsRef.current = nextTimeInMilliseconds;
  };

  const startSubscription = (): void => {
    if (hasUserInteractedRef.current || unsubscribeRef.current) return;

    const initialValue = store.get(currentTimeAtom);
    applyTick(initialValue);

    unsubscribeRef.current = store.sub(currentTimeAtom, () => {
      applyTick(store.get(currentTimeAtom));
    });
  };

  const stopSubscription = (): void => {
    unsubscribeRef.current?.();
    unsubscribeRef.current = null;
  };

  const stopAutopan = (): void => {
    if (hasUserInteractedRef.current) return;
    hasUserInteractedRef.current = true;
    previousTimeInMillisecondsRef.current = null;
    stopSubscription();
  };

  const resetAutopan = (): void => {
    hasUserInteractedRef.current = false;
    previousTimeInMillisecondsRef.current = latestTimeInMillisecondsRef.current;
    startSubscription();
  };

  useLayoutEffect(() => {
    startSubscription();

    const element = timelineRef.current;
    const handlePointerDown = (): void => stopAutopan();

    element?.addEventListener('pointerdown', handlePointerDown, { passive: true });

    const handleVisibilityChange = (): void => {
      if (!isDocumentVisible()) {
        previousTimeInMillisecondsRef.current = latestTimeInMillisecondsRef.current;
      }
    };
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      stopSubscription();
      element?.removeEventListener('pointerdown', handlePointerDown);
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
    };
  }, [timelineRef, onRangeChanged, store, currentTimeAtom]);

  return { resetAutopan };
};
