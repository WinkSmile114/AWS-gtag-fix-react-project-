import { useEffect, useState } from 'react';
import './index.scss';
import { getClient } from '../../../api-utils/general-utils';
import { formatNumberAsDollars } from '../../../utils';

import { calculateTotalPayback } from '../utils';
import { useRecoilState } from 'recoil';
import {
  dealDraftState,
  transactionAvailabilityState,
} from '../../../recoil-state/request-funding-states';
import { TransactionAvailability } from '../../../api-utils/generated-client';
import Loader from '../../../widgets/Loader';

const TotalPayback = () => {
  const [dealRecord, setDealRecord] = useRecoilState(dealDraftState);
  const [transactionAvailability, setTransactionAvailability] =
    useRecoilState<TransactionAvailability>(
      transactionAvailabilityState,
    );

  const onWeekNumberSelect = async (weekNumber: number) => {
    setDealRecord({
      ...dealRecord,
      selected_num_of_weeks_in_portal: weekNumber,
    });
    const client = await getClient();
    if (!client) {
      return;
    }
    await client.dealsControllerUpdate({
      selected_num_of_weeks_in_portal: weekNumber,
    });
  };

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
  }, []);

  useEffect(() => {
    if (!dealRecord.selected_num_of_weeks_in_portal) {
      if (
        transactionAvailability &&
        transactionAvailability.paybackDates &&
        transactionAvailability.paybackDates.length > 0
      ) {
        let firstAvailablePaybackDateStartingFromSecondWeek;
        for (let i = 1; i < 4; i++) {
          if (transactionAvailability.paybackDates[i].available) {
            firstAvailablePaybackDateStartingFromSecondWeek = i + 1;
            break;
          }
        }
        if (firstAvailablePaybackDateStartingFromSecondWeek) {
          onWeekNumberSelect(
            firstAvailablePaybackDateStartingFromSecondWeek,
          );
        } else if (
          transactionAvailability.paybackDates[0].available
        ) {
          onWeekNumberSelect(1);
        }
      }
    }
  }, [transactionAvailability]);

  if (!loadedTransactionAvailability) {
    return <Loader />;
  }

  return (
    <div>
      <div>
        <div className="total-payback-wrapper-more-funding">
          <p className="total-repayment more-funding">
            Total Payback:
          </p>
          <h1 className="total-repayment-val more-funding">
            {dealRecord.funding_amount &&
            dealRecord.funding_amount >= 5000
              ? formatNumberAsDollars(
                  calculateTotalPayback(
                    dealRecord.funding_amount ?? 0,
                    dealRecord.selected_num_of_weeks_in_portal ?? 0,
                  ),
                )
              : formatNumberAsDollars(150)}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default TotalPayback;
