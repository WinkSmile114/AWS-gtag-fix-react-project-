import './index.css';

interface RadioOption {
  label: string;
  subLabel?: string;
  value: string;
}

interface RadioGroupProps {
  options: Array<RadioOption>;
  onValueChange: (e: any) => any;
  groupName: string;
  checkedValue: any;
  groupLabel: string;
}

export default (props: RadioGroupProps) => {
  const radioOptions = props.options.map((opt) => {
    return (
      <label
        className="l-radio"
        htmlFor={opt.value}
        key={`opt-value-${opt.value}`}
      >
        <input
          checked={opt.value == props.checkedValue}
          onChange={(e) => {
            props.onValueChange(e);
          }}
          type="radio"
          id={opt.value}
          value={opt.value}
          name={props.groupName}
        />
        <span> {opt.label}</span>
        {opt.subLabel && (
          <span className="radio-sub-label"> {opt.subLabel}</span>
        )}
        <div className="check"></div>
      </label>
    );
  });
  return (
    <div className="radio-group-wrapper">
      <p className="radio-group-label">{props.groupLabel}</p>
      {radioOptions}
    </div>
  );
};
