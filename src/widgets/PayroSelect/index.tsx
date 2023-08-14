import './index.css';
import SelectArrow from './select-arrow.svg';

export interface SelectOption {
  label: string;
  value: string;
}

interface PayroSelectProps {
  label: string;
  options: Array<SelectOption>;
  onSelect: Function;
  selectName: string;
  wrapperAdditionalClasses?: string;
  placeholderText: string;
  defaultSelectedValue?: string;
  disabled?: boolean;
}

export default (props: PayroSelectProps) => {
  const theOptions = props.options.map((opt) => {
    return (
      <option
        className="options-style"
        key={`select-${opt.value}`}
        value={opt.value}
      >
        {opt.label}
      </option>
    );
  });

  return (
    <div
      className={
        'input-container' +
        (props.wrapperAdditionalClasses
          ? ' ' + props.wrapperAdditionalClasses
          : '')
      }
    >
      {props.label && (
        <span className="input-label">{props.label}</span>
      )}
      <div>
        <select
          value={
            props.defaultSelectedValue
              ? props.defaultSelectedValue
              : ''
          }
          // className="select-wrapper"
          className={
            'select-wrapper' +
            (props.wrapperAdditionalClasses
              ? ' ' + props.wrapperAdditionalClasses
              : '')
          }
          disabled={props.disabled ? true : false}
          name={props.selectName}
          id={props.selectName}
          onChange={(e: any) => {
            props.onSelect(e);
          }}
        >
          <option className="options-style" value="" disabled={true}>
            {props.placeholderText}
          </option>
          {theOptions}
        </select>
      </div>
    </div>
  );
};
