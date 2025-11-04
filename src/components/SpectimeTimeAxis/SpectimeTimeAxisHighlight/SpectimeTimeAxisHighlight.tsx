import React, { useMemo } from 'react';
import clsx from 'clsx';
import { BasicLabelDefinition, SimpleItem, Row, Span, useTimelineContext } from 'chronon-timeline';

import styles from './SpectimeTimeAxisRow.module.css';
import { getScaledTimeAxisMarkers } from '../scaleBoundaries';

export interface SpectimeTimeAxisRowClasses {
  wrapper?: string;
  item?: string;
  content?: string;
  innerContainer?: string;
}

export interface SpectimeTimeHighlight extends BasicLabelDefinition {
  span: Span;
  render: React.ReactNode;
}

export interface SpectimeTimeAxisRowProps {
  classes?: SpectimeTimeAxisRowClasses;
  highlightMarkers: SpectimeTimeHighlight[];
}

export const SpectimeTimeAxisHighlight: React.FC<SpectimeTimeAxisRowProps> = ({
  highlightMarkers,
  classes,
}) => {
  const { viewportWidth, range } = useTimelineContext();
  const highlightAxisMarkers = useMemo(
    () =>
      getScaledTimeAxisMarkers(viewportWidth, highlightMarkers).filter(
        (definition: SpectimeTimeHighlight) => {
          const visibleRangeMilliseconds = range.end - range.start;
          const isWithinMax =
            !definition.maxRangeSize || visibleRangeMilliseconds < definition.maxRangeSize;
          const isWithinMin =
            !definition.minRangeSize || visibleRangeMilliseconds >= definition.minRangeSize;

          const shouldDisplay =
            definition.span.end > range.start && definition.span.start < range.end;

          return isWithinMax && isWithinMin && shouldDisplay;
        },
      ),
    [viewportWidth, highlightMarkers, range.end, range.start],
  );

  if (!viewportWidth || viewportWidth <= 0) {
    return null;
  }

  return (
    <Row
      id={'spectime-highlight-row'}
      classes={{
        wrapper: styles.rowWrapper,
        content: styles.axisRowContent,
      }}
    >
      {highlightAxisMarkers.map(({ span, render }: SpectimeTimeHighlight) => (
        <SimpleItem
          key={`highlight-${span.start}-${span.end}`}
          id={`highlight-${span.start}-${span.end}`}
          classes={{
            item: clsx(styles.hightlightedItem, classes?.item),
            content: clsx(styles.highlightItemContent, classes?.content),
            innerContainer: clsx(styles.highlightItemContent, classes?.innerContainer),
          }}
          span={span}
        >
          {render}
        </SimpleItem>
      ))}
    </Row>
  );
};

export default SpectimeTimeAxisHighlight;
