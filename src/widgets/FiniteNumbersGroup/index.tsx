import { useEffect, useRef, useState } from 'react';
import './index.css';

export interface FiniteNumbersGroupProps {
  valueFilledCallback: (value: string) => void;
}

export default (props: FiniteNumbersGroupProps) => {
  const [internalValue, setInternalValue] = useState('');
  const [focused, setFocused] = useState(false);

  const values = internalValue.split('');
  const inputEl = useRef<HTMLInputElement>(null);

  const CODE_LENGTH = new Array(6).fill(0);
  const selectedIndex =
    values.length < CODE_LENGTH.length
      ? values.length
      : CODE_LENGTH.length - 1;
  const inputLeftClass = `left-${selectedIndex}`;

  useEffect(() => {
    inputEl.current?.focus();
  }, []);

  return (
    <div
      className="verification-code-wrapper"
      onClick={() => {
        inputEl.current?.focus();
      }}
    >
      <div className="input-and-display-wrapper">
        <div className="finite-input-wrapper">
          <input
            value=""
            ref={inputEl}
            className={`input ${inputLeftClass}`}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => {
              const newValue = e.target.value;
              if (internalValue.length >= CODE_LENGTH.length) {
                return null;
              }
              const newTotalValue = (internalValue + newValue).slice(
                0,
                CODE_LENGTH.length,
              );
              setInternalValue(newTotalValue);
              if (newTotalValue.length === CODE_LENGTH.length) {
                props.valueFilledCallback(newTotalValue);
              }
            }}
            onKeyUp={(e) => {
              if (e.key === 'Backspace') {
                setInternalValue(internalValue.slice(0, -1));
              }
            }}
          />
        </div>
        <div className="wrap">
          {CODE_LENGTH.map((v, index) => {
            return <div className="display">{values[index]}</div>;
          })}
        </div>
      </div>
    </div>
  );
};
