import PayroButton from '../../../widgets/PayroButton';
import './index.scss';
import NextIcon from '../../../common-icons/next-arrow.svg';
import ScheduledIcon from '../../../common-icons/payment-scheduled-icon.svg';
import { useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userContactInfoState } from '../../../recoil-state/general-states';

const MeetingPending = () => {
  let history = useHistory();
  const userContactInfo = useRecoilValue(userContactInfoState);
  return (
    <div id="scheduled-wrapper">
      <img id={'scheduled-icon'} src={ScheduledIcon}></img>
      <img
        id="close-request-more"
        className="schedule-payment-close"
        onClick={() => history.push('/dashboard')}
        src="/static/media/closex.a478a742.svg"
      ></img>
      <div id="payroll-funded-explanation">
        <br />
        <p>
          <h2>Still interested in scheduling a call?</h2>
          In order to increase your credit limit, we'll need to speak
          to you.
        </p>
      </div>
      <div id="back-to-dashboard-container">
        <form>
          <PayroButton
            buttonSize="medium"
            centered={true}
            endIcon={NextIcon}
            onClick={() => {
              const theWindow = window as any;
              theWindow.ChiliPiper.submit(
                'payrofinance',
                'inbound-router',
                {
                  lead: {
                    FirstName: `${userContactInfo.first_name}`,
                    LastName: `${userContactInfo.last_name}`,
                    Email: `${userContactInfo.email}`,
                  },
                },
                { domElement: '#myModal' },
              );
            }}
          >
            Schedule Now
          </PayroButton>
        </form>
      </div>
    </div>
  );
};

export default MeetingPending;
