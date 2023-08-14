import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { pendingTransactionsState } from '../../../recoil-state/general-states';
import { formatNumberAsDollars } from '../../../utils';
import '../index.scss';
import PendingBalanceMessage from './PendingBalanceMessage';
interface PayroLineOfCreditProps {
  outstandingBalance: number;
  remainingLineOfCredit: number;
}
const PayroLineOfCredit = (props: PayroLineOfCreditProps) => {
  const pendingTransactions = useRecoilValue(
    pendingTransactionsState,
  );
  return (
    <div className="individual-wrapper">
      <p className="dashboard-header-title"> Payro Line of Credit</p>
      <div className="pending-balance-main-wrapper">
        <p className="dashboard-header-value">
          {formatNumberAsDollars(props.remainingLineOfCredit)}
        </p>
        {pendingTransactions && (
          <PendingBalanceMessage section="balance" />
        )}
      </div>

      <div className="outstanding-wrapper">
        <p className="outstanding-amount-orange-wrapper">
          {formatNumberAsDollars(props.outstandingBalance)}
        </p>
        <p className="outstanding-text">Outstanding</p>
      </div>
    </div>
  );
};

export default PayroLineOfCredit;
