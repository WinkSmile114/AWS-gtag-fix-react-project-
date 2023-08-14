import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import fundIcon from '../../../common-icons/dashboard-fund-payroll-icon.svg';
// eslint-disable-next-line max-len
import noRepaymentsIcon from '../../../common-icons/dashboard-no-repayments.svg';
import nextArrow from '../../../common-icons/dashboard-next-arrow.svg';
import {
  accountRecordState,
  repaymentsState,
} from '../../../recoil-state/general-states';
import PayroButton from '../../../widgets/PayroButton';

import '../index.scss';
import { useHistory } from 'react-router-dom';
import {
  GetAccountDto,
  GetAccountDtoPayroFinanceStatusEnum,
} from '../../../api-utils/generated-client';

const FundPayroll = () => {
  let history = useHistory();
  const [accountDetails, setAccountDetails] =
    useRecoilState<GetAccountDto>(accountRecordState);

  const repayments = useRecoilValue(repaymentsState);
  return (
    <>
      {repayments && repayments.length < 1 ? (
        <div className="fund-payroll-no-repayments-wrapper">
          <img
            className="no-repayments-dashboard-icon"
            src={noRepaymentsIcon}
          />
          <p className="fund-payroll-no-repayments-text-style-one">
            You're good to go!
          </p>
          <p className="fund-payroll-no-repayments-text-style-two">
            No open Payroll Advancement at the moment
          </p>
          <PayroButton
            endIcon={nextArrow}
            customWidth="width-259"
            onClick={() => history.push('/request-funding')}
          >
            Request Funding
          </PayroButton>
        </div>
      ) : (
        <div className="fund-payroll-main-wrapper">
          <div className="fund-payroll-icon-wrapper">
            <img className="fund-payroll-icon" src={fundIcon} />
          </div>
          <div className="fund-payroll-wrapper">
            <p className="fund-your-payroll-text">
              {' '}
              Fund your payroll
            </p>
            <div className="request-button-wrapper">
              <PayroButton
                endIcon={nextArrow}
                disabled={
                  accountDetails.payro_finance_status ==
                    GetAccountDtoPayroFinanceStatusEnum.OnHold ||
                  accountDetails.payro_finance_status ==
                    GetAccountDtoPayroFinanceStatusEnum.Declined
                }
                customWidth="width-259"
                onClick={() => history.push('/request-funding')}
              >
                Request Funding
              </PayroButton>{' '}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FundPayroll;
