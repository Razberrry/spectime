import { PropsWithChildren, createContext, useContext } from 'react';
import {
  TimelineContext,
  TimelineContextProvider,
  useTimelineContext,
  useTimelineMousePanAndZoom,
} from 'chronon-timeline';
import type { PrimitiveAtom } from 'jotai';

import { useTimelineAutoPanUntilInteraction } from '../../hooks/useTimelineAutoPanUntilInteraction';

interface SpectimeTimelineProviderProps extends TimelineContext, PropsWithChildren {
  currentTimeAtom: PrimitiveAtom<number>;
}

type SpectimeTimelineExtras = {
  resetAutopan: () => void;
};

const SpectimeTimelineExtrasContext = createContext<SpectimeTimelineExtras | null>(null);

const SpectimeTimelineProviderEffects = ({
  currentTimeAtom,
  children,
}: Pick<SpectimeTimelineProviderProps, 'currentTimeAtom' | 'children'>) => {
  useTimelineMousePanAndZoom();
  const { resetAutopan } = useTimelineAutoPanUntilInteraction({ currentTimeAtom });

  return (
    <SpectimeTimelineExtrasContext.Provider value={{ resetAutopan }}>
      {children}
    </SpectimeTimelineExtrasContext.Provider>
  );
};

export const useSpectimeTimelineContext = (): TimelineContext & SpectimeTimelineExtras => {
  const timelineContext = useTimelineContext();
  const extras = useContext(SpectimeTimelineExtrasContext);

  if (!extras) {
    throw new Error('useSpectimeTimelineContext must be used within SpectimeTimelineProvider');
  }

  return {
    ...timelineContext,
    ...extras,
  };
};

export const SpectimeTimelineProvider = ({
  currentTimeAtom,
  children,
  ...timelineContext
}: SpectimeTimelineProviderProps) => {
  return (
    <TimelineContextProvider {...timelineContext} direction="rtl">
      <SpectimeTimelineProviderEffects currentTimeAtom={currentTimeAtom}>
        {children}
      </SpectimeTimelineProviderEffects>
    </TimelineContextProvider>
  );
};
