import React, { useMemo } from 'react';
import clsx from 'clsx';

import styles from './RangePresetsToolbar.module.css';

import {
  buildPresetRange,
  getClosestPresetKey,
  getRangeDurationMilliseconds,
  PresetKey,
} from './rangePresetsToolbarFunctions';
import { Range } from 'chronon-timeline';
import { useSpectimeTimelineContext } from '../../components/SpectimeTimelineProvider/SpectimeTimelineProvider';

const PRESETS: Array<{ key: PresetKey; label: string }> = [
  { key: 'hour', label: 'Hour' },
  { key: 'day', label: 'Day' },
  { key: 'week', label: 'Week' },
];

export type RangePresetsToolbarClasses = {
  toolbar?: string;
  button?: string;
  activeButton?: string;
};

export interface RangePresetsToolbarProps {
  classes?: RangePresetsToolbarClasses;
}

export const RangePresetsToolbar: React.FC<RangePresetsToolbarProps> = ({ classes }) => {
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
              styles.rangeToolbarButton,
              classes?.button,
              isActive && styles.rangeToolbarActive,
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
