import { formatDate, formatNumberAsDollars } from '../../../../utils';
import PlaidConnector from '../../../../widgets/PlaidConnector';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  isPlaidConnectedState,
  pendingTransactionsState,
} from '../../../../recoil-state/general-states';
import schedulePaymenticon from '../../../../common-icons/schedule-payment.png';
import schedulePaymentNone from '../../../../common-icons/schedule-payment-none.png';
import './index.scss';
import { GetAccountDtoPayroFinanceStatusEnum } from '../../../../api-utils/generated-client';
import ProgressBar from '../../../../widgets/ProgressBar';
import NextScheduledPayment from '../../../Dashboard/DashboardComponents/NextScheduledPayment';
import PendingBalanceMessage from '../../../Dashboard/DashboardComponents/PendingBalanceMessage';

interface DashboardHighlightProps {
  outstandingBalance: number;
  remainingLineOfCredit: number;
  originalCreditLimit: number;

  status?: GetAccountDtoPayroFinanceStatusEnum;
  hasLoanNotInNewStatus?: boolean;
}

const LedgerHighlight = (props: DashboardHighlightProps) => {
  const pendingTransactions = useRecoilValue(
    pendingTransactionsState,
  );
  return (
    <div id="dashboard-highlight-container">
      <div className="balance-progress-bar-container">
        <div className="dashboard-balance-available-credit">
          <div className="balance-container">
            <p id="outstanding-balance-title">Balance</p>
            <div className="pending-balance-main-wrapper-ledger">
              <p id="outstanding-balance-number">
                {formatNumberAsDollars(props.outstandingBalance)}
              </p>
              {pendingTransactions && <PendingBalanceMessage />}
            </div>
          </div>
          <div className="available-credit-wrapper">
            <p
              id={
                props.status ==
                GetAccountDtoPayroFinanceStatusEnum.Approved
                  ? 'remaining-credit-title'
                  : 'remaining-credit-title-not-active'
              }
            >
              Available Credit
            </p>
            <p
              id={
                props.status ==
                GetAccountDtoPayroFinanceStatusEnum.Approved
                  ? 'remaining-credit-number'
                  : 'remaining-credit-number-not-active'
              }
            >
              {formatNumberAsDollars(props.remainingLineOfCredit)}
              {pendingTransactions && <PendingBalanceMessage section='available-credit' />}
            </p>

            <p
              id={
                props.status ==
                GetAccountDtoPayroFinanceStatusEnum.Approved
                  ? 'original-limit'
                  : 'original-limit-not-active'
              }
            >
              Credit Limit:{' '}
              {formatNumberAsDollars(props.originalCreditLimit)}
            </p>
          </div>
        </div>
        <ProgressBar
          percentComplete={50}
          sectionName="LedgerHome"
        ></ProgressBar>
        <div />
      </div>
      {props.status == GetAccountDtoPayroFinanceStatusEnum.Approved &&
        props.hasLoanNotInNewStatus && (
          <>
            <div className="next-scheduled-payment-wrapper">
              <NextScheduledPayment />
            </div>
          </>
        )}
    </div>
  );
};

export default LedgerHighlight;
