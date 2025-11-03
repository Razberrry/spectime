import {
  addMilliseconds,
  differenceInMilliseconds,
  hoursToMilliseconds,
  subMilliseconds,
} from "date-fns";
import type { Range } from "../../types";

export type PresetKey = "hour" | "day" | "week";

export const DURATION_ONE_HOUR_MILLISECONDS = hoursToMilliseconds(1);
export const DURATION_EIGHT_HOURS_MILLISECONDS = hoursToMilliseconds(8);
export const DURATION_FIFTY_HOURS_MILLISECONDS = hoursToMilliseconds(100);

export const PRESET_DURATIONS_MILLISECONDS: Record<PresetKey, number> = {
  hour: DURATION_ONE_HOUR_MILLISECONDS,
  day: DURATION_EIGHT_HOURS_MILLISECONDS,
  week: DURATION_FIFTY_HOURS_MILLISECONDS,
};

export const createRangeCenteredOnNow = (
  durationMilliseconds: number
): Range => {
  const now = new Date();
  const halfMilliseconds = Math.floor(durationMilliseconds / 2);
  return {
    start: subMilliseconds(now, halfMilliseconds).getTime(),
    end: addMilliseconds(
      now,
      durationMilliseconds - halfMilliseconds
    ).getTime(),
  };
};

export const buildPresetRange = (presetKey: PresetKey): Range =>
  createRangeCenteredOnNow(PRESET_DURATIONS_MILLISECONDS[presetKey]);

export const getRangeDurationMilliseconds = (range: Range): number =>
  differenceInMilliseconds(new Date(range.end), new Date(range.start));

export const getClosestPresetKey = (
  durationMilliseconds: number
): PresetKey => {
  let bestKey: PresetKey = "hour";
  let bestDistance = Number.POSITIVE_INFINITY;
  (Object.keys(PRESET_DURATIONS_MILLISECONDS) as PresetKey[]).forEach((key) => {
    const target = PRESET_DURATIONS_MILLISECONDS[key];
    const distance = Math.abs(durationMilliseconds - target);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestKey = key;
    }
  });
  return bestKey;
};
