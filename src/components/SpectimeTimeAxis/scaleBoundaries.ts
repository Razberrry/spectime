import { BasicLabelDefinition } from 'chronon-timeline';

const scaleBoundaries = (boundary: number | undefined, scale: number) =>
  boundary === undefined ? undefined : boundary * scale;

export const getScaledTimeAxisMarkers = <T extends BasicLabelDefinition>(
  viewportWidth: number,
  markers: T[],
): T[] => {
  if (!viewportWidth || viewportWidth <= 0) {
    return markers;
  }

  const baseViewportWidth = window.screen.availWidth;
  const scale = viewportWidth / baseViewportWidth;
  if (scale === 1) {
    return markers;
  }

  return markers.map((marker) => ({
    ...marker,
    minRangeSize: scaleBoundaries(marker.minRangeSize, scale),
    maxRangeSize: scaleBoundaries(marker.maxRangeSize, scale),
  }));
};

export const scaleRangeSize = (boundary: number, viewportWidth: number) => {
  const baseViewportWidth = window.screen.availWidth;
  const scale = viewportWidth / baseViewportWidth;
  return scaleBoundaries(boundary, scale) as number;
};
