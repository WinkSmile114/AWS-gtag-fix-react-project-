import Icon from '../../../common-icons/maintenance.svg';
import closeX from '../../../common-icons/closex.svg';
import { useRecoilState, useRecoilValue } from 'recoil';
import { mainSectionState } from '../../../recoil-state/general-states';
import './index.scss';
const DealFailed = () => {
  const mainSection = useRecoilValue(mainSectionState);

  return (
    <>
      {
        <div id="deal-failed-outer-wrapper-onboarding">
          <img
            id="close-request-more"
            src={closeX}
            onClick={() => {
              window.location.reload();
              
            }}
          />{' '}
        </div>
      }
      <div id="deal-failed-wrapper">
        <img
          id={
            mainSection === 'RepeatFunding'
              ? 'failed-icon-repeat'
              : 'faied-icon'
          }
          src={Icon}
        ></img>
        <h2 id="payroll-failed-title">Ooops!</h2>
        <div id="payroll-failed-explanation">
          <p>
            {' '}
            We've hit some technical difficulties while processing
            your request
          </p>
        </div>
        <div id="payroll-failed-date">
          {' '}
          <p>
            Please reach out to support for assistance 1 (833)
            271-4499
          </p>
        </div>
      </div>
    </>
  );
};

export default DealFailed;
