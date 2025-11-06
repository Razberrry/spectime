import { useMemo } from 'react';
import type { Atom } from 'jotai';
import { useAtomValue } from 'jotai';

import { SpectimeTimeCursor } from './SpectimeTimeCursor/SpectimeTimeCursor';

export interface SpectimeCurrentTimeCursorProps {
  currentTimeAtom: Atom<number>;
}

export const SpectimeCurrentTimeCursor = ({
  currentTimeAtom,
}: SpectimeCurrentTimeCursorProps): JSX.Element => {
  const currentTime = useAtomValue(currentTimeAtom);
  const at = useMemo(() => new Date(currentTime), [currentTime]);

  return <SpectimeTimeCursor at={at} />;
};
