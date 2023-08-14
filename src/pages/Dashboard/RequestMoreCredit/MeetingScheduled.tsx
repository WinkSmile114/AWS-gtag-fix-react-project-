import PayroButton from '../../../widgets/PayroButton';
import './index.scss';
import NextIcon from '../../../common-icons/next-arrow.svg';
import ScheduledIcon from '../../../common-icons/payment-scheduled-icon.svg';
import { useHistory } from 'react-router-dom';

const MeetingScheduled = () => {
  let history = useHistory();

  return (
    <div id="scheduled-wrapper">
      <img id={'scheduled-icon'} src={ScheduledIcon}></img>
      <img
        id="close-request-more"
        className="schedule-payment-close"
        onClick={() => history.push('/dashboard')}
        src="/static/media/closex.a478a742.svg"
      ></img>
      <h2 id="payroll-funded-title">Meeting Scheduled</h2>
      <div
        id="payroll-funded-explanation"
        className="scheduled-explanation"
      >
        <p>We're looking forward to meeting with you!</p>
      </div>
      <div id="back-to-dashboard-container">
        <PayroButton
          buttonSize="small"
          centered={true}
          endIcon={NextIcon}
          onClick={() => {
            history.push('/dashboard');
          }}
        >
          Done
        </PayroButton>
      </div>
    </div>
  );
};

export default MeetingScheduled;
