import { useState } from 'react';
import './index.css';
import { formatNumberAsDollars } from '../../utils';

interface SliderProps {
  min: number;
  max: number;
  onChange: Function;
  label: string;
  labelSubtext: string;
  error: boolean;
  errorMessage?: string;
  required?: boolean;
}

export default ({
  min,
  max,
  onChange,
  label,
  error,
  errorMessage,
  required,
  labelSubtext,
}: SliderProps) => {
  const [newVal, setNewVal] = useState(0);

  return (
    <div className={'slider-component-wrapper'}>
      <p
        className={
          'slider-input-label' + (required ? ' required' : '')
        }
      >
        {label}
      </p>
      {labelSubtext && (
        <p className={'slider-input-label-subtext'}>{labelSubtext}</p>
      )}
      <div className={'slider-container' + (error ? ' error' : '')}>
        <input
          onChange={({ target: { value } }) => {
            setNewVal(Math.round(parseFloat(value) / 5000) * 5000);
            onChange(value);
          }}
          value={newVal}
          type="range"
          min={min}
          max={max}
          className="slider"
          id="myRange"
        />

        <p className="slider-value-display bold">
          {formatNumberAsDollars(newVal)}
        </p>
        {error && (
          <p className="slider-error-message">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};
