import InfoIcon from '../../common-icons/info-icon.png';
import './index.css';

interface InfoMessageProps {
  messageText: string;
  theBackgroundColor?: 'yellow' | 'red';
}

export default (props: InfoMessageProps) => {
  let theClass = 'info-blurb';
  if (props.theBackgroundColor) {
    theClass += ' ' + props.theBackgroundColor;
  }
  return (
    <>
      <div className={theClass}>
        <img
          className="info-icon"
          src={InfoIcon}
          width={20}
          height={20}
        ></img>
        <p className="message-text-style">{props.messageText}</p>
      </div>
    </>
  );
};
