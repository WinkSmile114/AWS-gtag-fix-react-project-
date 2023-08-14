import PayroButton from '../../widgets/PayroButton';
import Congrats from './congrats-icon.svg';
import './congrats.scss';
import checkIcon from './white-check.svg';
import NextIcon from '../../common-icons/next-arrow.svg';
import BackIcon from '../../common-icons/back-arrow.svg';
import { formatNumberAsDollars } from '../../utils';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { fundingStepState } from '../../recoil-state/request-funding-states';
import { accountRecordState } from '../../recoil-state/general-states';

export default () => {
  const accountRecord = useRecoilValue(accountRecordState);
  const setFundingStep = useSetRecoilState(fundingStepState);
  const showFunding = () =>
    setFundingStep(
      accountRecord.contract_signed
        ? 'funding-amount'
        : 'sign-contract',
    );

  return (
    <div id="congrats-wrapper">
      <img id="congrats-image" src={Congrats} />
      <h1 id="congrats-title">Congrats!</h1>
      <h1 id="congrats-message">Approved Credit Amount:</h1>
      <h1 id="congrats-approved-number">
        {formatNumberAsDollars(accountRecord.approved_credit_amount)}
      </h1>

      <div className="next-message-container">
        <p className="whats-next-text">What's Next?</p>

        <div className="next-message-container-text">
          <img id="circle-congrats" src={checkIcon} />
          <p className="explanation-text">
            {' '}
            Your Payroll financing application is approved. Now let's
            get your first payroll funded.
          </p>
        </div>

        <PayroButton
          variant="purple"
          onClick={showFunding}
          // buttonSize="medium"
          customWidth="width-182"
          centered={true}
          endIcon={NextIcon}
          end-image={true}
        >
          My First Loan
        </PayroButton>
      </div>

      {/* <PayroButton
            variant="green-dashboard"
            onClick={showDashboard}
            centered={true}
            buttonSize="medium"


        >My Dashboard</PayroButton>
 */}
    </div>
  );
};
