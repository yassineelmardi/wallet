import React from 'react';
import StepperSelector from './StepperSelector';

const YearSelector = ({ year, onChange, maxYear }) => (
  <StepperSelector
    label={String(year)}
    onPrevious={() => onChange(year - 1)}
    onNext={() => onChange(year + 1)}
    previousLabel={`Année ${year - 1}`}
    nextLabel={`Année ${year + 1}`}
    disabledNext={typeof maxYear === 'number' && year >= maxYear}
  />
);

export default YearSelector;
