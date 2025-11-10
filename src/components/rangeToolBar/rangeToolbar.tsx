import React, { useMemo } from 'react';
import clsx from 'clsx';

import styles from './rangeToolbar.module.css';

import {
  buildPresetRange,
  getClosestPresetKey,
  getRangeDurationMilliseconds,
  PresetKey,
} from './rangetoolbarFunctions';
import { Range } from 'chronon-timeline';
import { useSpectimeTimelineContext } from '../SpectimeTimelineWithToolbar/SpectimeTimelineProvider';

const PRESETS: Array<{ key: PresetKey; label: string }> = [
  { key: 'hour', label: 'Hour' },
  { key: 'day', label: 'Day' },
  { key: 'week', label: 'Week' },
];

export type TimelineRangeToolbarClasses = {
  toolbar?: string;
  button?: string;
  activeButton?: string;
};

export interface RangeToolbarProps {
  classes?: TimelineRangeToolbarClasses;
}

export const RangeToolbar: React.FC<RangeToolbarProps> = ({ classes }) => {
  const { range: timelineRange, resetAutopan, setRange } = useSpectimeTimelineContext();

  const handleRangeChange = (range: Range) => {
    resetAutopan();
    setRange(range);
  };
  const currentDurationMilliseconds = useMemo(
    () => getRangeDurationMilliseconds(timelineRange),
    [timelineRange],
  );

  const activePresetKey = useMemo<PresetKey>(
    () => getClosestPresetKey(currentDurationMilliseconds),
    [currentDurationMilliseconds],
  );

  return (
    <div className={clsx(styles.rangeToolbar, classes?.toolbar)}>
      {PRESETS.map(({ key, label }) => {
        const isActive = activePresetKey === key;

        return (
          <button
            key={key}
            type="button"
            className={clsx(
              styles.rangeToolbar,
              isActive && styles.rangeToolbarActive,
              classes?.button,
              isActive && classes?.activeButton,
            )}
            onClick={() => handleRangeChange(buildPresetRange(key))}
            aria-pressed={isActive}
            onPointerDown={(e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              handleRangeChange(buildPresetRange(key));
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};
