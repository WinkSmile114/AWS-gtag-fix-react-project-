import { useState } from 'react';
import './index.css';
import DownArrow from './downarrow.svg';
import CalendarIcon from './calendericon.svg';
import checkCircle from '../FinchConnector/check-circle.png';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface PayroSelectProps {
  label?: string;
  options: Array<SelectOption>;
  onSelect: Function;
  selectName: string;
  wrapperAdditionalClasses?: string;
  placeholderText: string;
  defaultSelectedValue?: string;
  disabled?: boolean;
  rightSideIcon?: 'calender' | 'arrow' | 'check';
  leftSideIcon?: string;
}

export default (props: PayroSelectProps) => {
  const [selectState, setSelectState] = useState<'open' | 'closed'>(
    'closed',
  );

  const theOptions = props.options.map((opt) => {
    return (
      <div
        className={
          props.wrapperAdditionalClasses == 'integrations'
            ? 'select-wrapper-integrations'
            : props.wrapperAdditionalClasses == 'dashboard'
            ? 'select-option-select-content-bank-dashboard'
            : props.wrapperAdditionalClasses
            ? 'select-option-select-content-bank'
            : 'select-option'
        }
        onClick={(e: any) => {
          if (opt.disabled) {
            return;
          }
          props.onSelect(opt.value);
          setSelectState('closed');
        }}
        key={`select-value-${opt.value}`}
      >
        {opt.label}
      </div>
    );
  });

  const labelForSelectedValue = props.options.find(
    (opt) => opt.value == props.defaultSelectedValue,
  )?.label;

  const theClosedOne = (
    <div
      className={
        props.wrapperAdditionalClasses == 'dashboard'
          ? 'select-option-select-content-bank-dashboard'
          : props.wrapperAdditionalClasses == 'integrations'
          ? 'closed-one-select-content-bank-integrations'
          : props.wrapperAdditionalClasses
          ? 'closed-one-select-content-bank'
          : 'closed-one'
      }
      onClick={(e: any) =>
        setSelectState(selectState == 'open' ? 'closed' : 'open')
      }
    >
      {props.leftSideIcon && (
        <img
          className="payro-select-left-side-icon"
          src={props.leftSideIcon ? props.leftSideIcon : ''}
        />
      )}
      {labelForSelectedValue}
      <img
        src={
          props.rightSideIcon == 'calender'
            ? CalendarIcon
            : props.rightSideIcon == 'check'
            ? checkCircle
            : DownArrow
        }
      />
    </div>
  );

  return (
    <div className={`payro-select-wrapper ${selectState}`}>
      {props.label && <p className="select-label">{props.label}</p>}
      {/* <div id="select-content"> */}
      <div
        id={
          props.wrapperAdditionalClasses == 'integrations'
            ? 'integrations'
            : props.wrapperAdditionalClasses == 'dashboard'
            ? 'dashboard'
            : props.wrapperAdditionalClasses
            ? 'select-content-bank'
            : 'select-content'
        }
      >
        {theClosedOne}

        {selectState == 'open' && (
          <div className="select-options-wrapper">{theOptions}</div>
        )}
      </div>
    </div>
  );

  // return (
  //     <div className={"input-container" + (props.wrapperAdditionalClasses ? ' ' + props.wrapperAdditionalClasses : '')}>
  //         {
  //             props.label && (
  //                 <span className="input-label">{props.label}</span>
  //             )
  //         }
  //         <div>
  //             <select
  //                 value={props.defaultSelectedValue? props.defaultSelectedValue : ""}
  //                 className="select-wrapper"
  //                 disabled={props.disabled ? true : false}
  //                 name={props.selectName}
  //                 id={props.selectName}
  //                 onChange={(e: any) => {
  //                     console.log('new select value', e.target.value)
  //                     props.onSelect(e)
  //                     }} >
  //                 <option value="" disabled={true}>{props.placeholderText}</option>
  //                 {theOptions}
  //             </select>
  //         </div>
  //     </div>
  // )
};
