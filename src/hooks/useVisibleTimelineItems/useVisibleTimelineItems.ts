import { useMemo } from 'react';

import { hoursToMilliseconds } from 'date-fns';

import { ItemDefinition, RowDefinition, Span, useTimelineContext } from 'chronon-timeline';
import { filterItemsBySpan, mapItemsToFullDaySpans } from './items';
import { groupItemsToSubrows } from './subrows';

const extractVisibleLanes = (
  lanes: readonly ItemDefinition[][],
  spanRange: Span,
): ItemDefinition[][] => {
  if (!lanes.length) return [];

  const result: ItemDefinition[][] = [];

  for (const lane of lanes) {
    const visibleItems = filterItemsBySpan(lane, spanRange);
    if (visibleItems.length) {
      result.push([...visibleItems]);
    }
  }

  return result;
};

export interface UseVisibleTimelineItemsParams {
  rows: RowDefinition[];
  items: ItemDefinition[];
}

export interface UseVisibleTimelineItemsResult {
  subrowsByRow: Record<string, ItemDefinition[][]>;
  rowIdWithMostVisibleLanes?: string;
  isWeekly: boolean;
}

export const useVisibleTimelineItems = ({
  rows,
  items,
}: UseVisibleTimelineItemsParams): UseVisibleTimelineItemsResult => {
  const { range } = useTimelineContext();

  const isWeekly = useMemo(() => hoursToMilliseconds(3 * 24) <= range.end - range.start, [range]);

  const itemsForGrouping = useMemo(
    () => (isWeekly ? mapItemsToFullDaySpans(items) : items),
    [isWeekly, items],
  );

  const groupedByRow = useMemo(() => groupItemsToSubrows(itemsForGrouping), [itemsForGrouping]);

  const subrowsByRow = useMemo(() => {
    const visibleSubrows: Record<string, ItemDefinition[][]> = {};

    for (const [rowId, lanes] of Object.entries(groupedByRow)) {
      const visibleLanes = extractVisibleLanes(lanes, range);
      if (visibleLanes.length) {
        visibleSubrows[rowId] = visibleLanes;
      }
    }

    return visibleSubrows;
  }, [groupedByRow, range]);

  const rowIdWithMostVisibleLanes = useMemo(() => {
    let selectedRowId: string | undefined;
    let highestLaneCount = -1;

    for (const row of rows) {
      const laneCount = subrowsByRow[row.id]?.length ?? 0;
      if (laneCount > highestLaneCount) {
        highestLaneCount = laneCount;
        selectedRowId = row.id;
      }
    }

    return selectedRowId ?? rows[0]?.id;
  }, [rows, subrowsByRow]);

  return {
    subrowsByRow,
    rowIdWithMostVisibleLanes,
    isWeekly,
  };
};
