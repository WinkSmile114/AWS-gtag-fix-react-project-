import PayroButton from '../../../widgets/PayroButton';
import './index.scss';
import NextIcon from '../../../common-icons/next-arrow.svg';
import FundedIcon from './funded-icon.svg';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  mainSectionState,
  repaymentsState,
} from '../../../recoil-state/general-states';
import {
  fundingStepState,
  screenToDisplayState,
  transactionAvailabilityState,
} from '../../../recoil-state/request-funding-states';
import { DateTime } from 'luxon';
import Loader from '../../../widgets/Loader';
import { useEffect } from 'react';
import { getClient } from '../../../api-utils/general-utils';

import { useHistory } from 'react-router-dom';
import { getLoanIdToDisplay } from '../../Ledger/ledger-utils';
import { GetRepaymentDto } from '../../../api-utils/generated-client';
import InfoMessage from '../../../widgets/InfoMessage';

const Funded = () => {
  let history = useHistory();
  const [repayments, setRepayments] = useRecoilState<
    GetRepaymentDto[] | undefined
  >(repaymentsState);
  const mainSection = useRecoilValue(mainSectionState);
  const [fundingStep, setFundingStep] =
    useRecoilState(fundingStepState);
  const [transactionAvailability, setTransactionAvailability] =
    useRecoilState(transactionAvailabilityState);
  const loadedTransactionAvailability =
    transactionAvailability &&
    transactionAvailability.paybackDates &&
    transactionAvailability.paybackDates.length > 0;

  useEffect(() => {
    const getTransactionAvailability = async () => {
      if (!loadedTransactionAvailability) {
        const client = await getClient();
        if (client) {
          const availability =
            await client.dealsControllerGetTransactionAvailability();
          setTransactionAvailability(availability.data);
        }
      }
    };

    getTransactionAvailability().then(() => {});
    getRepayments();
  }, []);

  const getRepayments = async () => {
    const client = await getClient();
    if (!client) {
      return;
    }
    const dealsRes = await client.dealsControllerFindAll();
    console.log(dealsRes.data.loans, 'deals res');
    setRepayments(dealsRes.data.loans);
  };

  if (!transactionAvailability.fundingDate) {
    return <Loader />;
  }

  return (
    <div id="funded-wrapper">
      <img
        id={
          mainSection === 'RepeatFunding'
            ? 'funded-icon-repeat'
            : 'funded-icon'
        }
        src={FundedIcon}
      ></img>
      <h2 id="payroll-funded-title">Payroll funded!</h2>
      <div id="payroll-funded-explanation">
        <p>Payro is wiring the funds to your account.</p>
      </div>
      <div id="payroll-funded-date">
        <p>
          The funds will arrive before the end of day on{' '}
          {DateTime.fromISO(
            transactionAvailability.fundingDate,
          ).toLocaleString()}
          .
        </p>
      </div>
      <InfoMessage
        theBackgroundColor="yellow"
        messageText="Please note: Once your payback date arrives,
         please allow three business days for your payment to clear. 
         Only afterwards will your available amount to borrow go back up."
      ></InfoMessage>
      <div id="back-to-dashboard-container">
        <PayroButton
          buttonSize="medium"
          centered={true}
          endIcon={NextIcon}
          onClick={async () => {
            {
              setFundingStep('funding-amount');
              {
                window.location.replace('/ledger');
                // (repayments && repayments.length < 2) || !repayments
                //   ? window.location.replace('/ledger')
                //   : history.push('/ledger');
              }
            }
          }}
        >
          My Loans
        </PayroButton>
      </div>
    </div>
  );
};

export default Funded;
