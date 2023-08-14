import { useEffect, useState } from 'react';
import loanIcon from '../../../common-icons/loan-dashboard-icon.svg';
import greyArrowIcon from '../../../common-icons/dashboard-grey-arrow.svg';
import schedulePayment from '../../../common-icons/schedule-payment.png';
import remitPaymentIcon from '../../../common-icons/remit-payment-icon.svg';
import { formatNumberAsDollars } from '../../../utils';
import '../index.scss';
import PayroButton from '../../../widgets/PayroButton';
import { useRecoilState, useRecoilValue } from 'recoil';
// eslint-disable-next-line max-len
import { showHideClassNameState } from '../../../recoil-state/request-funding-states';
// eslint-disable-next-line max-len
import SchedulePaymentModal from '../../Ledger/LedgerDetail/SchedulePaymentModal';
import NextScheduledPayment from './NextScheduledPayment';
import {
  accountRecordState,
  activeRepaymentsState,
  recentRepaymentsState,
  repaymentsState,
} from '../../../recoil-state/general-states';
import {
  getLoanIdToDisplay,
  getLoanIdToDisplayLedgerDetail,
} from '../../Ledger/ledger-utils';
import {
  GetAccountDto,
  GetRepaymentDto,
} from '../../../api-utils/generated-client';

import { useHistory } from 'react-router-dom';

const RecentPayrollFunded = () => {
  let history = useHistory();
  const [showHideClassName, setShowHideClassName] = useRecoilState(
    showHideClassNameState,
  );
  const recentRepayments = useRecoilValue(recentRepaymentsState);
  const accountDetails = useRecoilValue<GetAccountDto>(
    accountRecordState,
  );
  const [activeRepayments, setActiveRepaymentsList] = useRecoilState<
    GetRepaymentDto[]
  >(activeRepaymentsState);
  useEffect(() => {}, [recentRepayments]);
  return (
    <>
      <div className="recent-payroll-funded-main-wrapper">
        <div className="recent-payroll-wrapper">
          <p className="recent-payroll-funded-text">
            Most Recent Payroll Fundings
          </p>
          {recentRepayments?.length ? (
            recentRepayments.map((r) => (
              <div key={r.uuid}>
                <div className="recent-payroll-item">
                  <div className="loan-id-and-icon-wrapper">
                    <img src={loanIcon} />
                    <p className="loan-id-style">
                      {getLoanIdToDisplay(r.uuid)}
                    </p>
                  </div>

                  <div className="balance-wrapper-recent-payroll-item">
                    <p className="balance-text-style">Bal</p>
                    <p className="balance-number-style">
                      {' '}
                      {formatNumberAsDollars(
                        r.total_outstanding_amount,
                      )}
                    </p>
                  </div>
                  <div>
                    <PayroButton
                      key={r.uuid}
                      customWidth="width-small"
                      variant="purple-white"
                      endIcon={greyArrowIcon}
                      onClick={() => {
                        history.push(`/ledger-detail/${r.uuid}`);
                      }}
                    >
                      {''}
                    </PayroButton>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-next-payroll-text">
              You have no recent fundings at this time
            </p>
          )}

          <div className="outstanding-balance-wrapper-dashboard">
            <a
              className="view-all-link-style"
              onClick={() => {
                history.push('/ledger');
              }}
            >
              View All Fundings
            </a>
            <p className="outstanding-balance-text-style">
              Total Outstanding Balance
            </p>
            <p className="outstanding-balance-number-style">
              {' '}
              {formatNumberAsDollars(
                accountDetails.total_outstanding_amount,
              )}
            </p>
          </div>
        </div>
        <div className="recent-payroll-next-scheduled-main-wrapper">
          <div className="recent-payroll-next-scheduled-wrapper">
            <NextScheduledPayment />
          </div>
          <div className="button-and-explanation-wrapper">
            <div>
              {activeRepayments.length > 0 && (
                <SchedulePaymentModal
                  key={activeRepayments[0].uuid}
                  repaymentUuid={activeRepayments[0].uuid}
                  repaymentPaybackDate={
                    activeRepayments[0].next_hit_date
                  }
                  loanId={getLoanIdToDisplayLedgerDetail(
                    activeRepayments[0].uuid,
                  )}
                  // eslint-disable-next-line max-len
                  repaymentBalance={
                    activeRepayments[0].total_outstanding_amount
                  }
                  nextScheduledPaymentBankName={
                    activeRepayments[0].withdrawl_bank_name
                  }
                  // eslint-disable-next-line max-len
                  nextScheduledPaymentBankNumber={activeRepayments[0].bank_account_number.toString()}
                  className={showHideClassName}
                ></SchedulePaymentModal>
              )}
              <PayroButton
                startIcon={remitPaymentIcon}
                customWidth="width-182"
                onClick={() => {
                  setShowHideClassName('modal display-block');
                }}
                disabled={activeRepayments.length == 0}
              >
                Remit Payment
              </PayroButton>{' '}
            </div>

            <p className="exclamation-text">
              Payro gives you the ability to pay off your payroll
              advancement to save on fees.
            </p>
          </div>
        </div>{' '}
      </div>
    </>
  );
};

export default RecentPayrollFunded;
