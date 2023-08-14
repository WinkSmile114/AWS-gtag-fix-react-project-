import { useContext } from 'react';
import { AppMessage, MessageContext } from '../../context';
import CloseIt from '../../common-icons/CloseXNoCircle.png';

import './index.css';

interface AlertProps {
  appMessage: AppMessage;
  indexOfMe: number;
}

const AlertComponent = (props: AlertProps) => {
  const messageContext = useContext(MessageContext);
  return (
    <div
      className={
        props.appMessage.level +
        '-message-container message-container'
      }
    >
      <div id="alert-image-conainer">
        <img
          src={CloseIt}
          className="remove-alert"
          onClick={() => messageContext.popMessage(props.indexOfMe)}
        />
      </div>
      <div className="message-title-and-content">
        {props.appMessage.title && (
          <div className="message-title">
            {props.appMessage.title}
          </div>
        )}
        <div className="alert-message-text">
          {props.appMessage.message}
        </div>
      </div>
    </div>
  );
};

export default AlertComponent;
