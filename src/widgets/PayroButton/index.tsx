import { DateTime } from 'luxon';
import { useState } from 'react';
import './index.css';

interface PayroButtonProps {
  buttonSize?: 'small' | 'medium' | 'large';
  customWidth?:
    | 'width-210'
    | 'width-130'
    | 'width-200'
    | 'width-250'
    | 'width-182'
    | 'width-259'
    | 'width-small';
  customHeight?: string;
  onClick?: Function;
  children: any;
  disabled?: boolean;
  className?: string;
  startIcon?: any;
  endIcon?: any;
  centered?: boolean;
  hidden?: boolean;
  isFormSubmit?: boolean;
  variant?:
    | 'white'
    | 'purple'
    | 'black'
    | 'back-button'
    | 'green'
    | 'green-agree'
    | 'dark-purple'
    | 'green-dashboard'
    | 'red-white'
    | 'purple-white';
}

export default ({
  buttonSize,
  isFormSubmit,
  onClick: onClickProp,
  children,
  disabled,
  variant,
  startIcon,
  endIcon,
  centered,
  hidden,
  customHeight,
  customWidth,
  className,
}: PayroButtonProps) => {
  const [lastClickedTime, setLastClickedTime] = useState<number>();

  let buttonClass = 'accent-button';
  if (disabled) {
    buttonClass += ' disabled';
  }
  if (variant) {
    buttonClass += ` ${variant}-variant`;
  }
  if (buttonSize) {
    buttonClass += ` ${buttonSize}`;
  } else {
    buttonClass += ` medium`;
  }
  if (centered) {
    buttonClass += ` centered`;
  }

  if (hidden) {
    buttonClass += ' hidden';
  }
  if (className) {
    buttonClass += ` ${className}`;
  }

  let customStyle: any = {};
  if (customWidth) {
    buttonClass += ` ${customWidth}`;
  }

  return (
    <button
      type={isFormSubmit ? 'submit' : 'button'}
      onClick={() => {
        if (disabled || !onClickProp) {
          return;
        } else {
          let now = Date.now();
          if (lastClickedTime && now - lastClickedTime < 1000) {
            console.log('stop clicking so fast');
            return;
          }
          setLastClickedTime(Date.now());
          onClickProp();
        }
      }}
      className={buttonClass}
    >
      {startIcon ? (
        <img className="button-start-image" src={startIcon}></img>
      ) : (
        <></>
      )}
      <div>{children}</div>
      {endIcon ? (
        <img className="button-end-image" src={endIcon}></img>
      ) : (
        <></>
      )}
    </button>
  );
};
