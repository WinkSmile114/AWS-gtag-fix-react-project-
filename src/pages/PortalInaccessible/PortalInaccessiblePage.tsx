import Icon from '../../common-icons/maintenance.svg';
import closeX from '../../common-icons/closex.svg';
import { useRecoilState, useRecoilValue } from 'recoil';
import './index.scss';
export default () => {
  return (
    <>
   
      <div id="portal-inaccessible-wrapper">
        <img src={Icon}></img>
        {/* <h2 id="payroll-failed-title"></h2> */}
        <div id="portal-inaccessible-explanation">
          <p> Your portal account is currently inaccessible.</p>
        </div>
        <div id="portal-inaccessible-message">
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
