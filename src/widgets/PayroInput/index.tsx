import React, { FocusEventHandler, useRef, useState } from 'react';
import './index.css';
import showPasswordImage from './show-password.png';
import searchImage from './search-icon.svg';
import { useEffect } from 'react';
import { formatNumberAsDollars } from '../../utils';

interface TextFieldProps {
  value?: string | number;
  onChange?: (val: string) => void;
  onKeyDown?: (val: any) => void;
  placeholder?: string;
  autoFocus?: boolean;
  name?: string;
  type?:
    | 'email'
    | 'password'
    | 'text'
    | 'number'
    | 'currency'
    | 'date';
  onFocus?: FocusEventHandler;
  onBlurFunction?: FocusEventHandler;
  error?: boolean;
  required?: boolean;
  id?: string;
  label?: string;
  // f?: string | number
  variant?: string;
  autoComplete?: string;
  helperText?: any;
  wrapperAdditionalClasses?: string;
  isFiniteNumberInput?: boolean;
  isPhone?: boolean;
  isEinNumber?: boolean;
  isSearch?: boolean;
  isSocialSecurity?: boolean;
  searchOptions?: string[];
  forceFocus?: boolean;
  usePropsValueInsteadOfState?: boolean;
  onBackspaceOfEmptyInput?: Function;
  triggerGoToNextFiniteNumberInput?: Function;
  onCopy?: Function;
  onPaste?: Function;
}

export default ({
  value: theValue,
  isSearch,
  variant,
  onChange,
  onKeyDown,
  isPhone,
  isEinNumber,
  required,
  isFiniteNumberInput,
  placeholder,
  searchOptions,
  onFocus,
  error,
  onBlurFunction,
  autoFocus,
  name,
  type: inputType,
  label,
  wrapperAdditionalClasses,
  helperText,
  isSocialSecurity,
  forceFocus,
  usePropsValueInsteadOfState,
  onBackspaceOfEmptyInput,
  triggerGoToNextFiniteNumberInput,
}: TextFieldProps) => {
  const [focused, setFocused] = useState(forceFocus ? true : false);
  const [showPassword, setShowPassword] = useState(false);
  const [stateValue, setStateValue] = useState(theValue);
  const [totalSearchOptions, setTotalSearchOptions] = useState<
    string[] | undefined
  >(searchOptions);
  const [displayedSearchOptions, setDisplayedSearchOptions] =
    useState<string[]>([]);

  const inputRef = useRef<any>(null);
  const inputClassName =
    'payro-actual-input ' +
    (focused ? 'focused' : 'not-focused') +
    (error ? ' error' : '') +
    (isPhone ? ' phone' : '') +
    (isEinNumber ? ' ein-number' : '') +
    (isSocialSecurity ? ' social-security' : '') +
    (variant == 'white' ? ' white' : '') +
    (variant == 'edit-profile-input' ? ' edit-profile-input' : '') +
    (variant == 'green' ? ' green' : '');

  useEffect(() => {
    if (forceFocus) {
      inputRef.current.focus();
      setFocused(true);
    }
  }, [forceFocus]);

  useEffect(() => {
    if (usePropsValueInsteadOfState) {
      setStateValue(theValue);
    }
  }, [theValue]);

  const calculateInputType = () => {
    if (!inputType) {
      return 'text';
    }
    switch (inputType) {
      case 'password':
        if (showPassword) {
          return 'text';
        } else {
          return 'password';
        }
      case 'currency':
        if (focused) {
          return 'number';
        } else {
          return 'text';
        }
    }
    return inputType;
  };

  const getStateValueToShow = () => {
    let stateValueToShow;
    if (inputType == 'currency' && !focused && stateValue) {
      stateValueToShow = formatNumberAsDollars(
        stateValue ? (stateValue as number) : 0,
        'hide-dollar-sign',
      );
    } else if (isPhone) {
      if (stateValue && stateValue.toString().length >= 3) {
        let stateValueToShowArray = stateValue.toString().split('');
        stateValueToShowArray.splice(3, 0, '-');
        if (stateValueToShowArray.length > 6) {
          stateValueToShowArray.splice(7, 0, '-');
        }
        stateValueToShow = stateValueToShowArray.join('');
      } else {
        stateValueToShow = stateValue;
      }
    } else if (isEinNumber) {
      if (stateValue && stateValue.toString().length >= 2) {
        let stateValueToShowArray = stateValue.toString().split('');
        stateValueToShowArray.splice(2, 0, '-');
        stateValueToShow = stateValueToShowArray.join('');
      } else {
        stateValueToShow = stateValue;
      }
    } else if (isSocialSecurity) {
      if (stateValue && stateValue.toString().length >= 3) {
        let stateValueToShowArray = stateValue.toString().split('');
        stateValueToShowArray.splice(3, 0, '-');
        if (stateValueToShowArray.length > 5) {
          stateValueToShowArray.splice(6, 0, '-');
        }

        stateValueToShow = stateValueToShowArray.join('');
      } else {
        stateValueToShow = stateValue;
      }
    } else if (stateValue) {
      stateValueToShow = stateValue;
    } else {
      stateValueToShow = '';
    }
    return stateValueToShow;
  };

  let stateValueToShow = getStateValueToShow();

  const theInput = (
    <input
      ref={inputRef}
      value={stateValueToShow}
      onKeyDown={(e) => {
        if (
          e.key === 'Backspace' &&
          (stateValue ?? '') == '' &&
          onBackspaceOfEmptyInput
        ) {
          onBackspaceOfEmptyInput();
        }
      }}
      onChange={(e) => {
        const determineNewValue = () => {
          let newValue;
          if (isPhone) {
            const alreadyEndedInDash =
              stateValue &&
              (stateValue.toString().length == 3 ||
                stateValue.toString().length == 6);
            const pressedDeleteByDash =
              e.target.value.length == 3 ||
              e.target.value.length == 7;
            if (alreadyEndedInDash && pressedDeleteByDash) {
              newValue = e.target.value
                .substr(0, e.target.value.length - 1)
                .replaceAll('-', '');
            } else {
              newValue = e.target.value.replaceAll('-', '');
            }
            if (newValue && newValue.length > 10) {
              newValue = newValue.substr(0, 10);
            }
          } else if (isEinNumber) {
            const alreadyEndedInDash =
              stateValue && stateValue.toString().length == 2;
            const pressedDeleteByDash = e.target.value.length == 2;
            if (alreadyEndedInDash && pressedDeleteByDash) {
              newValue = e.target.value
                .substr(0, e.target.value.length - 1)
                .replaceAll('-', '');
            } else {
              newValue = e.target.value.replaceAll('-', '');
            }
            if (newValue && newValue.length > 9) {
              newValue = newValue.substr(0, 9);
            }
          } else if (isSocialSecurity) {
            const alreadyEndedInDash =
              stateValue &&
              (stateValue.toString().length == 3 ||
                stateValue.toString().length == 5);
            const pressedDeleteByDash =
              e.target.value.length == 3 ||
              e.target.value.length == 6;
            if (alreadyEndedInDash && pressedDeleteByDash) {
              newValue = e.target.value
                .substr(0, e.target.value.length - 1)
                .replaceAll('-', '');
            } else {
              newValue = e.target.value.replaceAll('-', '');
            }
            if (newValue && newValue.length > 9) {
              newValue = newValue.substr(0, 9);
            }
          } else if (isFiniteNumberInput) {
            if (
              e.target.value &&
              e.target.value.toString().length > 1
            ) {
              newValue = parseInt(e.target.value.charAt(0));
              if (triggerGoToNextFiniteNumberInput) {
                triggerGoToNextFiniteNumberInput();
              }
            } else {
              newValue = e.target.value;
            }
          } else if (inputType == 'currency') {
            newValue = parseFloat(e.target.value);
          } else {
            newValue = e.target.value;
          }
          return newValue;
        };
        const newValue = determineNewValue();
        setStateValue(newValue);
        if (onChange) {
          onChange(newValue as string);
        }
        recalculateDisplayedSearchOptions(newValue as string);
      }}
      placeholder={placeholder}
      autoFocus={autoFocus}
      name={name}
      type={calculateInputType()}
      className={inputClassName}
      onFocus={(e) => {
        setFocused(true);
        if (onFocus) {
          onFocus(e);
        }
      }}
      onBlur={(e) => {
        setFocused(false);
        if (onBlurFunction) {
          onBlurFunction(e);
        }
      }}
    />
  );

  const getPreInputEl = () => {
    if (isPhone) {
      return <p className="input-prefix">+1 | </p>;
    }
    if (inputType == 'currency') {
      return <p className="input-prefix">$</p>;
    }
    if (isSearch) {
      return (
        <img
          className="search-icon"
          src={searchImage}
          width={20}
          height={20}
        />
      );
    }
    return <div></div>;
  };
  const preInputEl = getPreInputEl();

  const postInputEl =
    inputType === 'password' ? (
      <img
        className="show-password"
        onClick={() => setShowPassword(!showPassword)}
        src={showPasswordImage}
        width={20}
        height={20}
      />
    ) : (
      <div></div>
    );

  const recalculateDisplayedSearchOptions = (newInputVal: string) => {
    if (!isSearch || !totalSearchOptions) {
      return;
    }
    const optionsToDisplay = totalSearchOptions.filter((opt) => {
      return opt.toLowerCase().includes(newInputVal.toLowerCase());
    });
    setDisplayedSearchOptions(optionsToDisplay);
  };

  const searchOptionsEls = displayedSearchOptions.map((opt) => {
    return (
      <div
        className="search-option"
        key={`seach-option-${opt}`}
        onBlur={(e) => {
          e.preventDefault();
          setDisplayedSearchOptions([]);
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          setStateValue(opt);
          setDisplayedSearchOptions([]);
          if (onChange) {
            onChange(opt);
          }
        }}
      >
        {opt}
      </div>
    );
  });

  const getInputWrapperClassName = () => {
    let inputWrapperClassName = 'input-wrapper';
    if (wrapperAdditionalClasses) {
      inputWrapperClassName += ` ${wrapperAdditionalClasses}`;
    }
    if (focused) {
      inputWrapperClassName += ' input-wrapper-focused';
    }
    if (error) {
      inputWrapperClassName += ' error';
    }
    if (isFiniteNumberInput) {
      inputWrapperClassName += ' finite-number';
    }
    if (isSocialSecurity) {
      inputWrapperClassName += ' social-security';
    }
    if (variant == 'white') {
      inputWrapperClassName += ' white';
    }
    if (variant == 'green') {
      inputWrapperClassName += ' green';
    }
    if (variant == 'green') {
      inputWrapperClassName += ' green';
    }
    return inputWrapperClassName;
  };

  return (
    <div
      onBlur={(e) => {
        e.preventDefault();
        setDisplayedSearchOptions([]);
      }}
      className={
        'input-container' +
        (wrapperAdditionalClasses
          ? ' ' + wrapperAdditionalClasses
          : '')
      }
    >
      {label && (
        <span
          className={'input-label' + (required ? ' required' : '')}
        >
          {label}
        </span>
      )}

      <div
        className={getInputWrapperClassName()}
        onFocus={(e) => {
          setFocused(true);
          if (onFocus) {
            onFocus(e);
          }
        }}
        onKeyDown={(e) => {
          if (e.key == 'Backspace') {
            if (onKeyDown) {
              onKeyDown(e);
            }
          }
        }}
      >
        {preInputEl} {theInput} {postInputEl}
      </div>

      {isSearch && searchOptions && (
        <div className="search-options-outer-wrapper">
          <div className="search-options-absolute">
            {searchOptionsEls}
          </div>
        </div>
      )}

      {helperText && (
        <p className="input-helper-text">{helperText}</p>
      )}
    </div>
  );
};
