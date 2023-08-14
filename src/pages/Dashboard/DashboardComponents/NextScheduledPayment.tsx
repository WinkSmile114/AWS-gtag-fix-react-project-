import { useEffect, useState } from 'react';
import loanIcon from '../../../common-icons/loan-dashboard-icon.svg';
import greyArrowIcon from '../../../common-icons/dashboard-grey-arrow.svg';
import schedulePayment from '../../../common-icons/schedule-payment.png';
import schedulePaymentNone from '../../../common-icons/schedule-payment-none.png';
import remitPaymentIcon from '../../../common-icons/remit-payment-icon.svg';
import { formatDate, formatNumberAsDollars } from '../../../utils';
import '../index.scss';
import PayroButton from '../../../widgets/PayroButton';
import { useRecoilState, useRecoilValue } from 'recoil';
import { getClient } from '../../../api-utils/general-utils';
import { repaymentsState } from '../../../recoil-state/general-states';
import {
  nextScheduledPaymentAmountState,
  nextScheduledPaymentBankNameState,
  nextScheduledPaymentBankNumberState,
  nextScheduledPaymentDateState,
} from '../../../recoil-state/request-funding-states';

interface NextScheduledPaymentProps {
  repayment_id?: string | undefined;
}

const NextScheduledPayment = (props: NextScheduledPaymentProps) => {
  const [nextScheduledPaymentDate, setNextScheduledPaymentDate] =
    useRecoilState<string>(nextScheduledPaymentDateState);
  const [nextScheduledPaymentAmount, setNextScheduledPaymentAmount] =
    useRecoilState<number>(nextScheduledPaymentAmountState);
  const [
    nextScheduledPaymentBankNumber,
    setNextScheduledPaymentBankNumber,
  ] = useRecoilState<any>(nextScheduledPaymentBankNumberState);
  const [
    nextScheduledPaymentBankName,
    setNextScheduledPaymentBankName,
  ] = useRecoilState<string>(nextScheduledPaymentBankNameState);
  useEffect(() => {
    const getData = async () => {
      const client = await getClient();
      if (!client) {
        return;
      }
      if (props.repayment_id == undefined) {
        {
          // if (nextScheduledPaymentAmount == 0) {
          const nextPayment =
            await client.paymentsControllerGetNextScheduledPayment();
          if (nextPayment.data.length > 0) {
            setNextScheduledPaymentDate(
              nextPayment.data[0].payback_date,
            );
            setNextScheduledPaymentAmount(
              nextPayment.data[0].transaction_amount,
            );
            setNextScheduledPaymentBankNumber(
              nextPayment.data[0].bank_account_number,
            );
            setNextScheduledPaymentBankName(
              nextPayment.data[0].bank_account_name,
            );
            // }
          }
        }
      }
      if (props.repayment_id) {
        //if (nextScheduledPaymentAmount == 0) {
        const nextPaymentForRepayment =
          await client.paymentsControllerGetNextScheduledPaymentForRepayment(
            props.repayment_id,
          );
        if (nextPaymentForRepayment) {
          setNextScheduledPaymentDate(
            nextPaymentForRepayment.data[0].payback_date,
          );
          setNextScheduledPaymentAmount(
            nextPaymentForRepayment.data[0].transaction_amount,
          );
          setNextScheduledPaymentBankNumber(
            nextPaymentForRepayment.data[0].bank_account_number,
          );
          setNextScheduledPaymentBankName(
            nextPaymentForRepayment.data[0].bank_account_name,
          );
        }
        // }
      }
    };

    getData();
  }, []);
  return (
    <div
      className={
        !nextScheduledPaymentDate
          ? 'payment-icon-and-text-wrapper-no-payment'
          : 'payment-icon-and-text-wrapper'
      }
    >
      <div>
        <img
          src={
            !nextScheduledPaymentDate
              ? schedulePaymentNone
              : schedulePayment
          }
          className={
            !nextScheduledPaymentDate ? '' : 'next-payment-icon'
          }
          width={25}
          height={25}
        ></img>
      </div>
      <div className="payment-text-wrapper-no-payment">
        <p className="next-scheduled-payment-text-style">
          Next Scheduled Payment:
        </p>
        {!nextScheduledPaymentDate ? (
          <p className="next-payment-details-none">
            No Scheduled Payment
          </p>
        ) : (
          <>
            <p className="next-scheduled-date-style">
              {formatDate(nextScheduledPaymentDate)}{' '}
              <span className="dash">-</span>{' '}
              <span className="bold">
                {formatNumberAsDollars(nextScheduledPaymentAmount)}
              </span>
            </p>
            <p className="next-scheduled-bank-text-style">
              Auto Debiting from Account ***
              {nextScheduledPaymentBankNumber &&
                nextScheduledPaymentBankNumber.slice(
                  nextScheduledPaymentBankNumber.length - 4,
                )}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default NextScheduledPayment;
