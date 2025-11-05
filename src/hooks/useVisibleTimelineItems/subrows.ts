import { filterItemsBySpan, ItemDefinition, Span } from 'chronon-timeline';

const compareItemsByStart = <T extends ItemDefinition>(a: T, b: T) => {
  const startDiff = a.span.start - b.span.start;
  if (startDiff !== 0) {
    return startDiff;
  }

  const endDiff = a.span.end - b.span.end;
  if (endDiff !== 0) {
    return endDiff;
  }

  const aRow = String(a.rowId ?? '');
  const bRow = String(b.rowId ?? '');
  if (aRow !== bRow) {
    return aRow < bRow ? -1 : 1;
  }

  const aId = a.id === undefined ? '' : String(a.id);
  const bId = b.id === undefined ? '' : String(b.id);
  if (aId === bId) {
    return 0;
  }

  return aId < bId ? -1 : 1;
};

export const sortItemsByStart = <T extends ItemDefinition = ItemDefinition>(
  items: readonly T[],
): T[] => {
  if (items.length < 2) return items.slice();
  return [...items].sort(compareItemsByStart);
};

const ensureSortedByStart = <T extends ItemDefinition>(items: readonly T[]): readonly T[] => {
  if (items.length < 2) return items;

  for (let index = 1; index < items.length; index++) {
    const current = items[index];
    const previous = items[index - 1];
    if (compareItemsByStart(previous, current) > 0) {
      return sortItemsByStart(items);
    }
  }

  return items;
};

type HeapNode = {
  end: number;
  index: number;
};

const siftUp = (heap: HeapNode[], index: number) => {
  const node = heap[index];
  while (index > 0) {
    const parent = (index - 1) >> 1;
    if (heap[parent].end <= node.end) break;
    heap[index] = heap[parent];
    index = parent;
  }
  heap[index] = node;
};

const siftDown = (heap: HeapNode[], index: number) => {
  const lastIndex = heap.length - 1;
  const node = heap[index];

  while (true) {
    const left = index * 2 + 1;
    if (left > lastIndex) break;

    const right = left + 1;
    let smallest = left;

    if (right <= lastIndex && heap[right].end < heap[left].end) {
      smallest = right;
    }

    if (heap[smallest].end >= node.end) break;

    heap[index] = heap[smallest];
    index = smallest;
  }

  heap[index] = node;
};

const addToSubrows = <T extends ItemDefinition>(subrows: T[][], heap: HeapNode[], item: T) => {
  const available = heap[0];

  if (available && available.end <= item.span.start) {
    subrows[available.index].push(item);
    available.end = item.span.end;
    siftDown(heap, 0);
    return;
  }

  const index = subrows.length;
  subrows.push([item]);
  heap.push({ end: item.span.end, index });
  siftUp(heap, heap.length - 1);
};

const sortSubrowsDeterministically = <T extends ItemDefinition>(subrows: T[][]): T[][] => {
  if (subrows.length < 2) {
    return subrows;
  }

  const decorated = subrows.map((subrow, index) => ({
    subrow,
    index,
    anchor: subrow[0],
  }));

  decorated.sort((a, b) => {
    const aAnchor = a.anchor;
    const bAnchor = b.anchor;

    const aStart = aAnchor?.span.start ?? Number.POSITIVE_INFINITY;
    const bStart = bAnchor?.span.start ?? Number.POSITIVE_INFINITY;
    if (aStart !== bStart) {
      return aStart - bStart;
    }

    const aEnd = aAnchor?.span.end ?? Number.POSITIVE_INFINITY;
    const bEnd = bAnchor?.span.end ?? Number.POSITIVE_INFINITY;
    if (aEnd !== bEnd) {
      return aEnd - bEnd;
    }

    if (aAnchor?.id !== undefined && bAnchor?.id !== undefined) {
      const idComparison = String(aAnchor.id).localeCompare(String(bAnchor.id));
      if (idComparison !== 0) {
        return idComparison;
      }
    } else if (aAnchor?.id !== undefined) {
      return -1;
    } else if (bAnchor?.id !== undefined) {
      return 1;
    }

    return a.index - b.index;
  });

  for (let i = 0; i < decorated.length; i++) {
    subrows[i] = decorated[i].subrow;
  }

  return subrows;
};

const isOutsideSpan = <T extends ItemDefinition>(item: T, span?: Span) =>
  !!span && (item.span.start >= span.end || item.span.end <= span.start);

const groupSortedItemsToSubrows = <T extends ItemDefinition = ItemDefinition>(
  items: readonly T[],
  span?: Span,
) => {
  const sortedItems = ensureSortedByStart(items);
  const state = new Map<string, { subrows: T[][]; heap: HeapNode[] }>();

  for (const item of sortedItems) {
    if (isOutsideSpan(item, span)) continue;

    let entry = state.get(item.rowId);
    if (!entry) {
      entry = { subrows: [], heap: [] };
      state.set(item.rowId, entry);
    }

    addToSubrows(entry.subrows, entry.heap, item);
  }

  const result: Record<string, T[][]> = {};
  for (const [rowId, { subrows }] of state.entries()) {
    if (subrows.length) {
      result[rowId] = sortSubrowsDeterministically(subrows);
    }
  }

  return result;
};

export const groupItemsToSubrows = <T extends ItemDefinition = ItemDefinition>(
  items: readonly T[],
  span?: Span,
) => {
  const relevantItems = filterItemsBySpan(items, span);
  if (!relevantItems.length) return {};
  return groupSortedItemsToSubrows(relevantItems, span);
};

export const groupItemsToRows = <T extends ItemDefinition = ItemDefinition>(
  items: readonly T[],
  span?: Span,
) => {
  const grouped: Record<string, T[]> = Object.create(null);

  for (const item of filterItemsBySpan(items, span)) {
    (grouped[item.rowId] ??= []).push(item);
  }

  return grouped;
};

export const groupItemsByRowSorted = <T extends ItemDefinition = ItemDefinition>(
  items: readonly T[],
) => {
  const itemsByRow = groupItemsToRows(items);

  for (const rowId of Object.keys(itemsByRow)) {
    const row = itemsByRow[rowId];
    if (row.length > 1) {
      row.sort(compareItemsByStart);
    }
  }

  return itemsByRow;
};
