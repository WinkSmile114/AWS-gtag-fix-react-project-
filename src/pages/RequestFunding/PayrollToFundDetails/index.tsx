import FinchConnector from '../../../widgets/FinchConnector';
import { useEffect, useState } from 'react';
import './index.scss';
import { formatNumberAsDollars, isFeatureOn } from '../../../utils';
import { getClient } from '../../../api-utils/general-utils';
import PayroInput from '../../../widgets/PayroInput';

import RequestFundingTitle from '../request-funding-title';
import RadioSelected from '../../../common-icons/radio-selected.png';
import RadioUnSelected from '../../../common-icons/radio-unselected.png';
import MostRecentPayroll from './most-recent-payroll';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  finchPayrollInfoState,
  isFinchConnectedState,
  isThereFutureFinchPayroll,
} from '../../../recoil-state/finch-states';
import {
  dealDraftState,
  sectionState,
} from '../../../recoil-state/request-funding-states';
import { accountRecordState } from '../../../recoil-state/general-states';

//gets from api in form "2021-04-15"
//needs to be stored in same form, but datepicker sets as date object and needs to be initialized as date object

interface myProps {
  // setRepaymentRecord: Function
  // finchPayrollInfo: PayrollInfo | undefined
  // setFinchPayrollInfo: Function
  // availableCredit: number | undefined
  // uploadFiles: Function
  // uploadedFiles: any[]
  // saveRepayment: Function
  // getNewUploadedFiles: Function
}

export default (props: myProps) => {
  const section = useRecoilValue(sectionState);
  const finchFeatureOn: boolean = isFeatureOn('Finch');
  const [finchPayrollInfo, setFinchPayrollInfo] = useRecoilState(
    finchPayrollInfoState,
  );
  const accountRecord = useRecoilValue(accountRecordState);

  const [loadedRepayment, setLoadedRepayment] =
    useState<boolean>(false);
  const [finishedloadingFinch, setFinishedLoadingFinch] =
    useState<boolean>(finchFeatureOn ? false : true);
  //const [isConnected, setIsConnected] = useRecoilState(isFinchConnectedState)
  const [isConnected, setIsConnected] = useState(false);
  const [statements, setStatements] = useState(false);
  const [showAmountInput, setShowAmountInput] = useState(true);
  const [dealRecord, setDealRecord] = useRecoilState(dealDraftState);
  const [isThereFuturePayroll, setIsThereFuturePayroll] =
    useRecoilState<'yes' | 'no' | undefined>(
      isThereFutureFinchPayroll,
    );

  // useEffect(() => {
  //     if (finchPayrollInfo) {
  //         if (finchPayrollInfo.length > 0) {
  //             const lastPayroll = finchPayrollInfo[0]
  //             const calculateFundingAmount = () => {
  //                 if (dealRecord.funding_amount) {
  //                     return dealRecord.funding_amount;
  //                 } else {
  //                     return getFundingLimitForThisPayroll(approvedCreditLimit, lastPayroll.company_debit.amount)
  //                 }
  //             }
  //             setRepaymentRecord({
  //                 ...repaymentRecord,
  //                 funding_amount: calculateFundingAmount(),
  //                 payroll_cash_due: repaymentRecord.payroll_cash_due ? repaymentRecord.payroll_cash_due : lastPayroll.company_debit.amount,
  //                 payroll_due_date: repaymentRecord.payroll_due_date ? repaymentRecord.payroll_due_date : lastPayroll.debit_date
  //             })
  //             setFinishedLoadingFinch(true)
  //         }
  //     }
  // }, [finchPayrollInfo])

  // const mostRecentPayroll = finchPayrollInfo?.payment && finchPayrollInfo.payment.length > 0 ? finchPayrollInfo.payment[0] : undefined
  const mostRecentPayroll: any =
    finchPayrollInfo &&
    (finchPayrollInfo.payment as Array<any>).length > 0
      ? (finchPayrollInfo.payment as Array<any>)[0]
      : undefined;

  const saveFundingAmount = async (fundingAmount: number) => {
    await setDealRecord({
      ...dealRecord,
      funding_amount: fundingAmount,
    });
    const client = await getClient();
    if (!client) {
      return;
    }
    await client.dealsControllerUpdate({
      funding_amount: fundingAmount,
    });
  };

  //I left this function here for the MostRecentPayroll calls it
  const getPayrollInfo = async (fresh: boolean) => {
    const client = await getClient();
    if (!client) {
      return;
    }
    const res = await client.payrollControllerGetPayrollInfo(
      'repayment',
      fresh ? 'yes' : 'no',
    );
    if (res.data) {
      const payrollData: any = res.data;
      setFinchPayrollInfo(payrollData);
      if (
        !dealRecord.funding_amount &&
        payrollData.payment.length > 0
      ) {
        await saveFundingAmount(payrollData.company_debit.amount);
      }

      //setPayrollFunding(res.data[0] as any)
    }
  };

  //setPayrollFunding({ ...payrollFunding, dueDate: e.target.value })

  const userRequestsTooMuchFunding =
    dealRecord.funding_amount &&
    dealRecord.funding_amount >
      (accountRecord.credit_amount_available as number);
  const userRequestsTooLittleFunding =
    dealRecord.funding_amount && dealRecord.funding_amount < 5000;
  return (
    <div>
      <RequestFundingTitle
        section={section}
        title="Amount to Finance"
        subtitle="How much of your payroll do you want to fund?"
        sectionNumber={section == 'onboarding' ? 1 : 2}
      />

      {finchFeatureOn && !isConnected && section == 'onboarding' && (
        <FinchConnector
          refresh="yes"
          associatedPhase="repayment"
          isConnectedCallback={() => {
            setIsConnected(true);
            if (isConnected && isThereFuturePayroll == 'yes') {
              setShowAmountInput(false);
            }
            setFinishedLoadingFinch(true);
          }}
          isDisconnectedCallback={() => {
            setShowAmountInput(true);
            setIsConnected(false);
            setFinishedLoadingFinch(true);
          }}
          //broadcastPayrollInfo={setFinchPayrollInfo}
        />
      )}

      {mostRecentPayroll && finishedloadingFinch && isConnected && (
        <>
          <MostRecentPayroll
            debitDate={mostRecentPayroll.debit_date}
            payDate={mostRecentPayroll.pay_date}
            refreshPayroll={() => getPayrollInfo(true)}
            isConnected={isConnected}
            isThereFuturePayroll={isThereFuturePayroll}
          />
        </>
      )}

      {(section == 'more-funding' || finishedloadingFinch) && (
        <>
          <div id="step-2-wrapper" className="payroll-form-fields">
            {/* <div className="date-and-cash">

                            <PayroInput
                                placeholder="yyyy-mm-dd"
                                id="date"
                                label="Payroll Due Date:"
                                value={repaymentRecord.payroll_due_date ? new Date(repaymentRecord.payroll_due_date).toISOString().substring(0, 10) : ''}
                                type="date"
                                onChange={(e: any) => {
                                    setRepaymentRecord({ ...repaymentRecord, payroll_due_date: e })
                                }
                                }
                            />


                            <PayroInput
                                onChange={(e: any) => setRepaymentRecord({ ...repaymentRecord, payroll_cash_due: parseFloat(e) })}
                                required
                                type="number"
                                value={repaymentRecord.payroll_cash_due}
                                id="companyAddressLine1"
                                label="Total Cash Due:"
                            />
                        </div> */}

            <div
              className={
                section +
                ' funding-amount-section' +
                (section === 'more-funding'
                  ? ' more-funding-input'
                  : '')
              }
            >
              {isConnected && isThereFuturePayroll == 'yes' && (
                <div id="finch-connected-select-amount">
                  <div
                    onClick={() => {
                      setShowAmountInput(false);

                      saveFundingAmount(
                        mostRecentPayroll.company_debit.amount,
                      ).then(() => {});
                    }}
                  >
                    <div className="radio-option">
                      <img
                        src={
                          showAmountInput
                            ? RadioUnSelected
                            : RadioSelected
                        }
                      />{' '}
                      <p>Fund Entire Eligible Payroll</p>
                    </div>
                    <p id="actual-payroll-amount">
                      {formatNumberAsDollars(
                        mostRecentPayroll.company_debit.amount,
                      )}
                    </p>
                  </div>
                  <div onClick={() => setShowAmountInput(true)}>
                    <div className="radio-option">
                      <img
                        src={
                          showAmountInput
                            ? RadioSelected
                            : RadioUnSelected
                        }
                      />{' '}
                      <p>Other Amount</p>
                    </div>
                  </div>
                </div>
              )}
              {showAmountInput && (
                <div className="funding-amount-item actual-amount">
                  <PayroInput
                    onBlurFunction={(e: any) => {
                      saveFundingAmount(
                        parseFloat(e.target.value),
                      ).then(() => {});
                    }}
                    required
                    placeholder="0.00"
                    value={dealRecord.funding_amount ?? 0}
                    wrapperAdditionalClasses="funding-amount-input"
                    onChange={(eventValue: any) => {
                      if (eventValue) {
                        setDealRecord({
                          ...dealRecord,
                          funding_amount: parseFloat(eventValue),
                        });
                      }
                    }}
                    label=""
                    variant="green"
                    type="currency"
                    error={
                      userRequestsTooMuchFunding
                        ? true
                        : false || userRequestsTooLittleFunding
                        ? true
                        : false
                    }
                    helperText={
                      userRequestsTooMuchFunding
                        ? 'Max is your credit limit'
                        : '' || userRequestsTooLittleFunding
                        ? 'A minimum of $5,000 is required'
                        : ''
                    }
                  />
                </div>
              )}
            </div>
            <div
              className={
                'funding-amount-item available-credit' +
                (section === 'more-funding'
                  ? ' more-funding-second-column'
                  : '')
              }
            >
              <span id="available-credit-label">
                Available Credit:
              </span>
              <br />
              <span id="available-credit-amount">
                {accountRecord.credit_amount_available
                  ? formatNumberAsDollars(
                      accountRecord.credit_amount_available,
                    )
                  : formatNumberAsDollars(0)}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const getFundingLimitForThisPayroll = (
  approvedCreditLimit: number | undefined,
  payrollAmount: number | undefined,
) => {
  if (!approvedCreditLimit || !payrollAmount) {
    return 0;
  }
  if (approvedCreditLimit > payrollAmount) {
    return payrollAmount;
  } else {
    return approvedCreditLimit;
  }
};
