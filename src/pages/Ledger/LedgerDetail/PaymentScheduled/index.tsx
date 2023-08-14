import PayroButton from '../../../../widgets/PayroButton';
import { formatDate, formatNumberAsDollars } from '../../../../utils';
import './index.scss';
import NextIcon from '../../../../common-icons/next-arrow.svg';
import ScheduledIcon from '../../../../common-icons/payment-scheduled-icon.svg';
import {
  getLoanIdLedgerDetail,
  getLoanIdToDisplay,
  getLoanIdToDisplayLedgerDetail,
} from '../../ledger-utils';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { getClient } from '../../../../api-utils/general-utils';
import { useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { showHideClassNameState } from '../../../../recoil-state/request-funding-states';

const Scheduled = () => {
  let history = useHistory();
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentId, setPaymentId] = useState<string | null>();
  const [paymentAmount, setPaymentAmount] = useState<any>();
  const [showHideClassName, setShowHideClassName] = useRecoilState(
    showHideClassNameState,
  );
  useEffect(() => {
    const getData = async () => {
      const client = await getClient();
      if (!client) {
        return;
      }
      setShowHideClassName('modal display-none');
      setPaymentId(localStorage.getItem('paymentId'));
      setPaymentAmount(localStorage.getItem('paymentAmount'));
      const uuid = localStorage.getItem('repaymentUuid');
      const getDateApi =
        await client.paymentsControllerGetPaymentAvailability(
          uuid ? uuid : '',
        );
      setPaymentDate(getDateApi.data.payment_date);
    };
    getData().then((res) => console.log('got data'));
  }, []);
  return (
    <div id="scheduled-wrapper">
      <img id={'scheduled-icon'} src={ScheduledIcon}></img>
      <img
        id="close-request-more"
        className="schedule-payment-close"
        onClick={() => history.push('/dashboard')}
        src="/static/media/closex.a478a742.svg"
      ></img>
      <h2 id="payroll-funded-title">Payment Scheduled</h2>
      <div
        id="payroll-funded-explanation"
        className="scheduled-explanation"
      >
        <p>
          Your payment of{' '}
          {formatNumberAsDollars(parseInt(paymentAmount))} for Loan #
          {getLoanIdToDisplayLedgerDetail(paymentId ? paymentId : '')}{' '}
          is sucessfully scheduled for{' '}
          {DateTime.fromISO(paymentDate).toLocaleString()}.
        </p>
      </div>
      <div className="payment-explanation-wrapper">
        <p className="payment-explanation-text">
          Please allow three business days for your payment to clear.
        </p>
      </div>
      <div id="back-to-dashboard-container">
        <PayroButton
          buttonSize="small"
          centered={true}
          endIcon={NextIcon}
          onClick={() => {
            history.goBack();
          }}
        >
          Done
        </PayroButton>
      </div>
    </div>
  );
};

export default Scheduled;
