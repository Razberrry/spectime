import { useCallback, useLayoutEffect, useRef } from 'react';
import type { Atom } from 'jotai';
import { useAtomValue } from 'jotai';
import { isZoomGesture, useTimelineContext } from 'chronon-timeline';

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

  const currentTime = useAtomValue(currentTimeAtom);

  const hasUserInteractedRef = useRef(false);
  const previousTimeRef = useRef<number | null>(null);
  const latestCurrentTimeRef = useRef<number | null>(null);

  const stopAutopan = useCallback(() => {
    if (!hasUserInteractedRef.current) {
      hasUserInteractedRef.current = true;
      previousTimeRef.current = null;
    }
  }, []);

  const resetAutopan = useCallback(() => {
    hasUserInteractedRef.current = false;
    previousTimeRef.current = latestCurrentTimeRef.current;
  }, []);

  useLayoutEffect(() => {
    const timelineElement = timelineRef.current;
    if (!timelineElement) return;

    const handlePointerDown = (): void => {
      stopAutopan();
    };

    const handleWheelToStopOnZoomOut = (event: WheelEvent): void => {
      if (!isZoomGesture(event)) return;
      stopAutopan();
    };

    timelineElement.addEventListener('pointerdown', handlePointerDown, {
      passive: true,
    });
    timelineElement.addEventListener('wheel', handleWheelToStopOnZoomOut, {
      passive: true,
    });

    return () => {
      timelineElement.removeEventListener('pointerdown', handlePointerDown);
      timelineElement.removeEventListener('wheel', handleWheelToStopOnZoomOut);
    };
  }, [stopAutopan, timelineRef]);

  useLayoutEffect(() => {
    if (typeof document === 'undefined') return;

    const handleVisibilityChange = (): void => {
      if (!isDocumentVisible()) {
        stopAutopan();
      } else if (!hasUserInteractedRef.current) {
        // When the page becomes visible again, avoid jumping by re-seeding the baseline.
        previousTimeRef.current = latestCurrentTimeRef.current;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [stopAutopan]);

  useLayoutEffect(() => {
    const currentTimeMs = toMilliseconds(currentTime as CurrentTimeValue);
    latestCurrentTimeRef.current = currentTimeMs;

    if (!isDocumentVisible()) {
      previousTimeRef.current = currentTimeMs;
      return;
    }

    if (hasUserInteractedRef.current) {
      previousTimeRef.current = currentTimeMs;
      return;
    }

    const previousTime = previousTimeRef.current;
    if (previousTime === null) {
      previousTimeRef.current = currentTimeMs;
      return;
    }

    const delta = currentTimeMs - previousTime;
    if (delta === 0) {
      return;
    }

    onRangeChanged((previousRange) => ({
      start: previousRange.start + delta,
      end: previousRange.end + delta,
    }));

    previousTimeRef.current = currentTimeMs;
  }, [currentTime, onRangeChanged]);

  return {
    resetAutopan,
  };
};
