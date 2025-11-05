import { ItemDefinition, Span } from 'chronon-timeline';
import { endOfDay, startOfDay } from 'date-fns';

const spansOverlap = (source: Span, target: Span) =>
  source.start < target.end && source.end > target.start;

const isFiniteSpan = (span?: Span): span is Span =>
  !!span && Number.isFinite(span.start) && Number.isFinite(span.end) && span.end > span.start;

export const filterItemsBySpan = <T extends ItemDefinition = ItemDefinition>(
  items: readonly T[],
  span?: Span,
): readonly T[] => {
  if (!isFiniteSpan(span)) return items;
  return items.filter((item) => spansOverlap(item.span, span));
};

export const expandSpanToFullDays = (span: Span): Span => {
  const { start, end } = span;

  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    return span;
  }

  const normalizedStart = startOfDay(start).getTime();
  const endSource = end >= start ? end : start;
  const normalizedEnd = endOfDay(endSource).getTime();

  return {
    start: normalizedStart,
    end: Math.max(normalizedEnd, normalizedStart),
  };
};

export const mapItemsToFullDaySpans = (
  items: readonly ItemDefinition[],
  span?: Span,
): ItemDefinition[] =>
  filterItemsBySpan(items, span).map(
    (item): ItemDefinition => ({
      ...item,
      span: expandSpanToFullDays(item.span),
    }),
  );
