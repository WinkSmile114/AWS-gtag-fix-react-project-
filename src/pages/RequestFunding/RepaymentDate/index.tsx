import { useEffect, useState } from 'react';
import FooterButtons from '../../../Footer/footer-buttons';
import TitleSection from '../../../Header/title-section';
import { DateTime } from 'luxon';
import './index.scss';
import { getClient } from '../../../api-utils/general-utils';
import { formatNumberAsDollars } from '../../../utils';
import RepaymentGuide, { LoanGuideRow } from './RapaymentGuide';
import OpenArrow from '../../../common-icons/open-arrow.png';
import RequestFundingTitle from '../request-funding-title';
import PayroSelect, {
  SelectOption,
} from '../../../widgets/PayroSelectv2';
import { calculateTotalPayback } from '../utils';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  dealDraftState,
  sectionState,
  transactionAvailabilityState,
} from '../../../recoil-state/request-funding-states';
import { TransactionAvailability } from '../../../api-utils/generated-client';
import Loader from '../../../widgets/Loader';

import infoIconSvg from '../../../common-icons/info-icon-fixed-rate.svg';

const RepaymentDate = () => {
  const section = useRecoilValue(sectionState);
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
    }else{
      // onWeekNumberSelect(2);
      // transactionAvailability && transactionAvailability.paybackDates && transactionAvailability.paybackDates.length > 0 && transactionAvailability.paybackDates.map((date:any,key:any) => {
      //   let currentweek = parseInt(key+1);
      //   if(currentweek == dealRecord.selected_num_of_weeks_in_portal){
      //     if(date.availability == false){
      //       if(currentweek == 1){
      //         onWeekNumberSelect(2);
      //       }else{
      //         onWeekNumberSelect(1);
      //       }
      //     }
      //   } 
      // })
      // fullWeekOptions && fullWeekOptions.map((weekOption) => {
      //   if(weekOption.weekNumber == dealRecord.selected_num_of_weeks_in_portal){
      //     if(weekOption.availability == false){
      //       if(weekOption.weekNumber == 1){
      //         onWeekNumberSelect(2);
      //       }else{
      //         // let num = parseInt(weekOption.weekNumber+1);
      //         onWeekNumberSelect(1);
      //       }
      //     }
      //   } 
      // })
    }
  }, [transactionAvailability]);

  if (!loadedTransactionAvailability) {
    return <Loader />;
  }

  const fullWeekOptions = transactionAvailability.paybackDates.map(
    (weekOption:any, idx:any) => {

      const weekNumber: any = idx + 1;
      const theFee = 150;
      const loanAmount = dealRecord.funding_amount as number;
      
      let currentweek = parseInt(idx+1);
      if(currentweek == dealRecord.selected_num_of_weeks_in_portal){
        if(weekOption.available == false){
          if(currentweek == 1){
            onWeekNumberSelect(2);
          }else{
            onWeekNumberSelect(1);
          }
        }
      } 

      return {
        weekNumber: weekNumber,
        weekText: weekNumber == 1 ? '1 Week' : `${weekNumber} Weeks`,
        payDate: DateTime.fromISO(
          weekOption.payback_date,
        ).toLocaleString(),
        availability: weekOption.available,
        unavailableReason: weekOption.unavailable_reason,
        theInterest: weekNumber * 0.015 * loanAmount,
        theInterestAndFee: weekNumber * 0.015 * loanAmount + theFee,
      };
    },
  );

  //---  just for onboarding  ---
  const weekChoiceClass = 'week-choice rounded-corner-section';
  const selectedNumber =
    dealRecord.selected_num_of_weeks_in_portal ?? 2;

  const weekChoices = fullWeekOptions.map((weekOption) => {
    return (
      <div
        className={
          weekOption.availability == false
            ? 'unavailable ' + weekChoiceClass
            : weekOption.weekNumber == selectedNumber
            ? 'purple-background-color ' + weekChoiceClass
            : weekChoiceClass
        }
        key={`week-${weekOption.weekNumber}`}
        onClick={async () => {
          if (!weekOption.availability) {
            return;
          }
          await onWeekNumberSelect(weekOption.weekNumber);
        }}
      >
        <span className="week-option-label">
          {weekOption.weekText}
        </span>
        <span className="week-option-date">
          {' '}
          {weekOption.unavailableReason
            ? weekOption.unavailableReason
            : weekOption.payDate}
        </span>
        <span className="total-cost-label">Total Cost</span>

        <span className="interest-and-fee">
          {formatNumberAsDollars(weekOption.theInterestAndFee)}
        </span>
      </div>
    );
  });

  const interestAmount = calculateInterest(
    dealRecord.funding_amount as number,
    dealRecord.selected_num_of_weeks_in_portal ?? 0,
  );

  const onboardingVersionOfOptions = (
    <>
      <div className="week-choices">{weekChoices}</div>

      <div className="interest-rate">
        <span id="interest-rate-number">1.5% </span>
        <span id="interest-rate-frequency"> Weekly Rate</span>
      </div>

      <div className="your-numbers-divider"></div>
      <div className="your-numbers">
        <div className="payroll-funding-values-wrapper">
          <span className="payroll-funding your-numbers-label">
            Funding Amount:
          </span>
          <span className="payroll-funding-val your-numbers-val">
            {formatNumberAsDollars(dealRecord.funding_amount)}
          </span>
        </div>
        <div className="total-repayment">Total Payback:</div>
        <div className="total-repayment-val">
          {formatNumberAsDollars(
            (dealRecord.funding_amount as number) +
              interestAmount +
              150,
          )}
        </div>
        <div id="processing-fee-section">
          <span className="one-time-processing your-numbers-label">
            Includes processing fee of
          </span>{' '}
          <span className="one-time-processing your-numbers-label bold">
            {formatNumberAsDollars(150)}
          </span>
        </div>
      </div>
    </>
  );

  //repeat funding

  const repeatFundingOptions: SelectOption[] = fullWeekOptions.map(
    (fullOption) => {
      const optionLabel = !fullOption.availability
        ? `${fullOption.weekText} - ${fullOption.unavailableReason}`
        : `${fullOption.weekText} - ${fullOption.payDate}`;
      return {
        label: optionLabel,
        value: fullOption.weekNumber.toString(),
        disabled: !fullOption.availability,
      };
    },
  );

  return (
    <div>
      <RequestFundingTitle
        section={section}
        title="Repayment Date"
        subtitle="Select your desired payback date"
        sectionNumber={section == 'onboarding' ? 2 : 3}
      />

      {section == 'onboarding' && onboardingVersionOfOptions}

      {section == 'more-funding' && (
        <div className="repeat-funding-input-and-another-column">
          <div
            id="more-funding-repayment-date"
            className="more-funding-input"
          >
            <PayroSelect
              label=""
              rightSideIcon="calender"
              selectName="paybackdate"
              placeholderText=""
              options={repeatFundingOptions}
              defaultSelectedValue={dealRecord.selected_num_of_weeks_in_portal?.toString()}
              onSelect={async (el: any) => {
                await onWeekNumberSelect(parseInt(el));
              }}
            />
          </div>
          <div
            id="more-funding-fixed-rate"
            className="more-funding-second-column"
          >
            {/* <p id="rate-line-1">Fixed Rate</p> */}
            <p id="rate-line-2">1.5% Weekly</p>
          </div>
        </div>
      )}
    </div>
  );
};

const calculateInterest = (
  loanAmount: number,
  numOfWeeks: number,
) => {
  return loanAmount * 0.015 * numOfWeeks;
};

const createGuideData = (loanAmount: number): LoanGuideRow[] => {
  const theFee = 150;
  let theInterest;
  let theInterestAndFee;

  let rows: LoanGuideRow[] = [];
  for (let i = 1; i < 5; i++) {
    theInterest = i * 0.015 * loanAmount;
    theInterestAndFee = theInterest + theFee;
    rows.push({
      interestAndFee: theInterestAndFee,
      totalPayback: loanAmount + theInterestAndFee,
    });
  }
  return rows;
};

export default RepaymentDate;
// const theIndividualFees = createGuideData(dealRecord.funding_amount as number).map((value, idx) => {
//     return {
//      theInterestAndFee: value.interestAndFee,
//      theTotalPayback: value.totalPayback
//  }
// })
