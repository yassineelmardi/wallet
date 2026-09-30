import React from 'react';
import StepperSelector from './StepperSelector';
import { formatPeriod, shiftMonth } from '../utils/period';

const MonthSelector = ({ year, month, onChange, maxPeriod }) => {
  const previous = shiftMonth({ year, month }, -1);
  const next = shiftMonth({ year, month }, 1);
  const disabledNext = Boolean(
    maxPeriod &&
      (next.year > maxPeriod.year ||
        (next.year === maxPeriod.year && next.month > maxPeriod.month))
  );

  return (
    <StepperSelector
      label={formatPeriod({ year, month })}
      onPrevious={() => onChange(previous)}
      onNext={() => onChange(next)}
      previousLabel={formatPeriod(previous)}
      nextLabel={formatPeriod(next)}
      disabledNext={disabledNext}
    />
  );
};

export default MonthSelector;
