import { formatDate, formatNumberAsDollars } from '../../../utils';
import {
  getLoanIdLedgerDetail,
  getLoanIdToDisplayLedgerDetail,
} from '../ledger-utils';
import './index.scss';
import {
  GetRepaymentDto,
  LoanPayment,
  NewLoanDebitPayment,
} from '../../../api-utils/generated-client';
import schedulePayment from '../../../common-icons/schedule-payment.png';
import remitPaymentIcon from '../../../common-icons/remit-payment-icon.svg';
import remitPaymentPurpleIcon from '../../../common-icons/remit-payment-purple-icon.svg';
import checkIcon from '../../../common-icons/check-circle.svg';
import TimelineIconOne from '../../../common-icons/timeline-icon-one.svg';
import TimelineIconTwo from '../../../common-icons/timeline-icon-two.svg';
import TimelineIconThree from '../../../common-icons/timeline-icon-three.svg';
import PayroButton from '../../../widgets/PayroButton';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import backIcon from '../../../common-icons/back-arrow-purple.svg';
import balanceIcon from '../../../common-icons/ledger-detail-balance-icon.svg';
import breakdownIcon from '../../../common-icons/ledger-detail-breakdown-icon.svg';
import payrollIcon from '../../../common-icons/ledger-detail-payroll-icon.svg';
import timelineIcon from '../../../common-icons/ledger-detail-loan-timeline-icon.svg';
import noPaymentsImage from '../../../common-icons/no-payroll-loans-icon.svg';
import completedPaymentsIcon from '../../../common-icons/completed-payments-check-icon.svg';
import { useRecoilState, useRecoilValue } from 'recoil';
import { getClient } from '../../../api-utils/general-utils';
import Loader from '../../../widgets/Loader';
import SchedulePaymentModal from './SchedulePaymentModal';
import {
  scheduledPaymentsListRecoil,
  showHideClassNameState,
} from '../../../recoil-state/request-funding-states';
import LoanDetailItem from './LoanTimelineItem/loan-timeline-item';
// eslint-disable-next-line max-len
import NextScheduledPayment from '../../Dashboard/DashboardComponents/NextScheduledPayment';

import {
  pendingTransactionsState,
  repaymentsState,
} from '../../../recoil-state/general-states';
import PendingBalanceMessage from '../../Dashboard/DashboardComponents/PendingBalanceMessage';

const LedgerDetail = () => {
  let history = useHistory();
  const id = useParams();
  const loanId = JSON.stringify(id);
  const [repayment, setRepayment] = useState<GetRepaymentDto>();
  const [gotData, setGotData] = useState(false);
  const [scheduledPaymentsList, setScheduledPaymentsList] =
    useRecoilState<LoanPayment[]>(scheduledPaymentsListRecoil);
  const [allPaymentsList, setAllPaymentsList] =
    useState<LoanPayment[]>();
  const [payrollObject, setPayrollObject] = useState<any>();
  const [completedPaymentsList, setCompletedPaymentsList] =
    useState<LoanPayment[]>();
  const [showHideClassName, setShowHideClassName] = useRecoilState(
    showHideClassNameState,
  );
  const repayments = useRecoilValue(repaymentsState);
  const pendingTransactions = useRecoilValue(
    pendingTransactionsState,
  );

  useEffect(() => {
    const getData = async () => {
      const client = await getClient();
      if (!client) {
        return;
      }

      const loanIdString = getLoanIdLedgerDetail(loanId);

      const repaymentsInfo = repayments;

      if (!repaymentsInfo) return;

      const repayment = await repaymentsInfo.filter(
        (r) => r.uuid == loanIdString,
      );

      setRepayment(repayment[0]);
      setPayrollObject(repayment[0].payroll_record__r);

      const repayment_id = repayment[0].uuid;

      const paymentsForRepayment =
        await client.paymentsControllerGetPaymentsForRepayment(
          repayment_id,
        );

      setScheduledPaymentsList(
        paymentsForRepayment.data
          .filter(
            (p) => p.status === 'Scheduled' || p.status === 'Pending',
          )
          .sort((a, b) => {
            if (a.effective_date > b.effective_date) {
              return 1;
            } else {
              return -1;
            }
          }),
      );
      setCompletedPaymentsList(
        paymentsForRepayment.data
          .filter((p) => p.status == 'Settled')
          .sort((a, b) => {
            if (a.effective_date < b.effective_date) {
              return 1;
            } else {
              return -1;
            }
          }),
      );
      setAllPaymentsList(
        paymentsForRepayment.data
          .filter(
            (p) =>
              p.status == 'Scheduled' ||
              p.status == 'Pending' ||
              p.status == 'Settled',
          )
          .sort((a, b) => {
            if (a.effective_date > b.effective_date) {
              return 1;
            } else {
              return -1;
            }
          }),
      );
    };

    getData().then((res) => {
      setGotData(true);
    });
  }, []);

  if (!gotData) {
    return (
      <Loader message="Getting you the latest details..."></Loader>
    );
  }

  return (
    <>
      <SchedulePaymentModal
        key={repayment?.uuid}
        repaymentUuid={repayment ? repayment.uuid : ''}
        repaymentPaybackDate={
          repayment ? repayment.next_hit_date : ''
        }
        loanId={getLoanIdToDisplayLedgerDetail(loanId)}
        repaymentBalance={repayment?.total_outstanding_amount}
        nextScheduledPaymentBankName={repayment?.withdrawl_bank_name}
        // eslint-disable-next-line max-len
        nextScheduledPaymentBankNumber={
          repayment?.bank_account_number
            ? repayment.bank_account_number.toString()
            : ''
        }
        repaymentSfId={repayment?.salesforce_id}
        className={showHideClassName}
      ></SchedulePaymentModal>
      <div className="main-wrapper">
        <div className="advance-header-wrapper">
          <PayroButton
            customWidth="width-130"
            variant="purple-white"
            startIcon={backIcon}
            onClick={() => {
              history.goBack();
            }}
          >
            {''}
          </PayroButton>
          <p className="advance-design-color">Advance</p>
          <p className="loan-id-design">
            /{' '}
            <span className="loan-id-padding">
              {getLoanIdToDisplayLedgerDetail(loanId)}
            </span>
          </p>
        </div>
      </div>
      <div
        id={
          repayment?.status == 'Active'
            ? 'ledger-detail-highlight-container-active'
            : 'ledger-detail-highlight-container'
        }
      >
        <div className="main-wrapper">
          <div
            className={
              repayment?.status == 'Active'
                ? 'bold-numbers-wrapper-active'
                : 'bold-numbers-wrapper'
            }
          >
            <div className="outstanding-balance-ledger-detail">
              <p id="outstanding-balance-title">Total Loan Amount</p>
              <p
                id={
                  repayment?.status == 'Complete'
                    ? 'outstanding-balance-number-complete'
                    : 'outstanding-balance-number'
                }
              >
                {formatNumberAsDollars(repayment?.funding_amount)}
              </p>
            </div>
            <div
              className={
                repayment?.status == 'Complete'
                  ? 'remaining-wrapper-ledger-detail-complete'
                  : 'remaining-wrapper-ledger-detail'
              }
            >
              <p id="outstanding-balance-title">
                Outstanding Balance
              </p>
              <div className="pending-balance-main-wrapper">
                {' '}
                <p
                  id={
                    repayment?.status == 'Complete'
                      ? 'outstanding-balance-number-complete'
                      : 'outstanding-balance-ledger-detail'
                  }
                >
                  {formatNumberAsDollars(
                    repayment?.total_outstanding_amount,
                  )}
                </p>
                {pendingTransactions && <PendingBalanceMessage />}
              </div>
            </div>
            <div
              className={
                repayment?.status == 'Complete'
                  ? 'date-wrapper-ledger-detail-complete'
                  : 'date-wrapper-ledger-detail'
              }
            >
              <p id="outstanding-balance-title">Final Payoff Date</p>
              <p
                id={
                  repayment?.status == 'Complete'
                    ? 'payoff-date-complete'
                    : 'outstanding-balance-number'
                }
              >
                {formatDate(repayment?.next_hit_date)}
              </p>
            </div>
          </div>
          {repayment?.status == 'Active' && (
            <>
              <div className="payment-and-remit-payment-wrapper">
                <NextScheduledPayment
                  repayment_id={repayment?.uuid}
                />
                <div className="remit-payment-wrapper purple-background-color">
                  <div
                    id="myBtn"
                    className="button-wrapper-remit-payment"
                  >
                    <PayroButton
                      customWidth="width-182"
                      customHeight="48"
                      startIcon={remitPaymentIcon}
                      onClick={() => {
                        setShowHideClassName('modal display-block');
                      }}
                    >
                      Remit Payment
                    </PayroButton>
                  </div>
                  <p className="remit-payment-subtitle">
                    Payro gives you the ability to pay off your
                    <br></br> advancement to save on fees.
                  </p>
                </div>
              </div>{' '}
            </>
          )}
          {repayment?.status == 'Complete' && (
            <div id="paid-off-container">
              <img
                className="check-image"
                src={checkIcon}
                alt="check"
                height={25.01}
                width={25.01}
              ></img>
              <p className="paid-off-text">Paid Off</p>
            </div>
          )}
        </div>
      </div>
      <div id="additional-details-text-container">
        <p className="additional-details-text">Additional Details</p>
      </div>

      <div
        id={
          repayment?.status == 'Active'
            ? 'loan-details-main-container-active'
            : 'loan-details-main-container'
        }
      >
        <div
          id="additional-detail-highlight-container-one"
          className="loan-details-section"
        >
          <div className="ledger-details-subtitle">
            <img
              className="ledger-details-subtitle-image"
              src={balanceIcon}
              height={22.1}
              width={22.1}
              id="images-background-color"
            ></img>
            <p className="ledger-details-subtitle-text">Balance</p>
          </div>
          <div className="balance-wrapper">
            <p className="balance-container-balance-number">
              {formatNumberAsDollars(
                repayment?.total_outstanding_amount,
              )}
            </p>

            <div
              className={
                'status-green-ledger-detail repayment-info-item'
              }
            >
              {repayment?.payoff == null ? 0 : repayment?.payoff}%
            </div>
          </div>
          <div>
            <div id="progress-bar-container-ledger-detail">
              <div
                id="green-completed"
                className={
                  repayment != undefined
                    ? parseInt(repayment.payoff) <= 5
                      ? 'width-5-percent'
                      : parseInt(repayment.payoff) <= 10
                      ? 'width-10-percent'
                      : parseInt(repayment.payoff) <= 15
                      ? 'width-15-percent'
                      : parseInt(repayment.payoff) <= 20
                      ? 'width-20-percent'
                      : parseInt(repayment.payoff) <= 25
                      ? 'width-25-percent'
                      : parseInt(repayment.payoff) <= 30
                      ? 'width-30-percent'
                      : parseInt(repayment.payoff) <= 35
                      ? 'width-35-percent'
                      : parseInt(repayment.payoff) <= 40
                      ? 'width-40-percent'
                      : parseInt(repayment.payoff) <= 45
                      ? 'width-45-percent'
                      : parseInt(repayment.payoff) <= 50
                      ? 'width-50-percent'
                      : parseInt(repayment.payoff) <= 55
                      ? 'width-55-percent'
                      : parseInt(repayment.payoff) <= 60
                      ? 'width-60-percent'
                      : parseInt(repayment.payoff) <= 65
                      ? 'width-65-percent'
                      : parseInt(repayment.payoff) <= 70
                      ? 'width-70-percent'
                      : parseInt(repayment.payoff) <= 75
                      ? 'width-75-percent'
                      : parseInt(repayment.payoff) <= 80
                      ? 'width-80-percent'
                      : parseInt(repayment.payoff) <= 85
                      ? 'width-85-percent'
                      : parseInt(repayment.payoff) <= 90
                      ? 'width-90-percent'
                      : parseInt(repayment.payoff) <= 95
                      ? 'width-95-percent'
                      : parseInt(repayment.payoff) <= 100
                      ? 'width-100-percent'
                      : 'width-1-percent'
                    : 'width-1-percent'
                }
              ></div>
            </div>
          </div>
          <div
            className={
              scheduledPaymentsList?.length
                ? 'scheduled-payments-wrapper'
                : 'scheduled-payments-wrapper-none'
            }
          >
            <div>
              {scheduledPaymentsList?.length ? (
                <p className="scheduled-payments-header-text">
                  Scheduled Payments:{' '}
                </p>
              ) : (
                ''
              )}
              {scheduledPaymentsList?.length
                ? scheduledPaymentsList.map((p) => (
                    <>
                      <div
                        key={p.uuid}
                        className="scheduled-payment-wrapper"
                      >
                        <div>
                          <p className="scheduled-payments-subheader-text">
                            Date:
                          </p>
                          <p className="scheduled-payments-data">
                            {formatDate(p.effective_date)}
                          </p>{' '}
                        </div>
                        <div className="scheduled-payments-info-message-two">
                          <p className="scheduled-payments-subheader-text">
                            Bank:
                          </p>
                          <p className="scheduled-payments-data">
                            {/* {p.bank_name_from_repayment}{' '} */}
                            Account ***
                            {p.bank_account_from_repayment
                              ? p.bank_account_from_repayment.slice(
                                  p.bank_account_from_repayment
                                    .length - 4,
                                )
                              : ''}
                          </p>
                        </div>
                        <div className="scheduled-payments-info-message-three">
                          <p className="scheduled-payments-subheader-text">
                            Amount:
                          </p>
                          <p className="scheduled-payments-data">
                            {formatNumberAsDollars(
                              p.transaction_amount,
                            )}
                          </p>
                        </div>{' '}
                      </div>
                    </>
                  ))
                : ''}
            </div>
          </div>

          <div id="full-remaining-balance-wrapper">
            {repayment?.status != 'Complete' && (
              <p className="full-remaining-text">
                The full remaining balance {''}
                {repayment?.full_remaining_balance_incl_interest &&
                parseInt(
                  repayment?.full_remaining_balance_incl_interest.toString(),
                ) > 1 ? (
                  <>
                    of {''}
                    <span className="bold">
                      {formatNumberAsDollars(
                        parseInt(
                          repayment?.full_remaining_balance_incl_interest.toString(),
                        ),
                      )}
                      {''}
                    </span>
                  </>
                ) : (
                  ''
                )}
                {''} will be debited out of your account on{' '}
                <span className="bold">
                  {formatDate(repayment?.next_hit_date)}.
                </span>{' '}
              </p>
            )}
            {repayment?.status == 'Active' && (
              <div id="remit-payment-white-button">
                <PayroButton
                  customWidth="width-250"
                  variant="white"
                  startIcon={remitPaymentPurpleIcon}
                  onClick={() => {
                    setShowHideClassName('modal display-block');
                  }}
                >
                  Remit Payment
                </PayroButton>
              </div>
            )}
          </div>
          {
            <div
              id={
                repayment?.status == 'Active'
                  ? 'completed-payments-wrapper-active'
                  : completedPaymentsList?.length
                  ? 'completed-payments-wrapper'
                  : 'completed-payments-wrapper-none'
              }
            >
              <p className="scheduled-payments-header-text">
                Completed Payments:{' '}
              </p>
              <div>
                {completedPaymentsList?.length ? (
                  completedPaymentsList.map((p) => (
                    <>
                      <div key={p.uuid}>
                        <p className="scheduled-payments-subheader-text">
                          Date:
                        </p>
                        <p className="scheduled-payments-data">
                          {formatDate(p.effective_date)}
                        </p>
                      </div>
                      <div className="scheduled-payments-info-message-two">
                        <p className="scheduled-payments-subheader-text">
                          Bank:
                        </p>
                        <p className="scheduled-payments-data">
                          {/* {p.bank_name_from_repayment} {''} */}{' '}
                          Account ***
                          {p.bank_account_from_repayment
                            ? p.bank_account_from_repayment.slice(
                                p.bank_account_from_repayment.length -
                                  4,
                              )
                            : ''}
                        </p>
                      </div>
                      <div className="completed-payments-info-message-three">
                        <p className="scheduled-payments-subheader-text">
                          Amount:
                        </p>
                        <p className="scheduled-payments-data">
                          {formatNumberAsDollars(
                            p.transaction_amount,
                          )}
                        </p>
                        <div className="completed-payments-icon-column">
                          <img
                            src={completedPaymentsIcon}
                            alt="completed payments icon"
                            height={20.1}
                            width={20.1}
                          ></img>{' '}
                        </div>
                      </div>
                    </>
                  ))
                ) : (
                  <>
                    <img
                      id="no-repayments-image"
                      src={noPaymentsImage}
                    />
                    <br />
                    <p className="no-payments-text">
                      No Payments Yet
                    </p>
                  </>
                )}
              </div>
            </div>
          }
        </div>
        <div
          id="additional-detail-highlight-container-two"
          className="loan-details-section"
        >
          <div className="ledger-details-subtitle">
            <img
              className="ledger-details-subtitle-image"
              src={breakdownIcon}
              alt="breakdown icon"
              height={22.1}
              width={22.1}
              id="images-background-color"
            ></img>
            <p className="ledger-details-subtitle-text">Breakdown</p>
          </div>
          <div className="breakdown-values-wrapper">
            <p className="breakdown-header-text">Funding Amount:</p>
            <p className="breakdown-values-text">
              {formatNumberAsDollars(repayment?.funding_amount)}
            </p>
          </div>
          <div className="breakdown-values-wrapper">
            <p className="breakdown-header-text">Factor Rate:</p>
            <p className="breakdown-values-text">1.5%</p>
          </div>
          <div className="breakdown-values-wrapper">
            <p className="breakdown-header-text">Weeks:</p>

            <p className="breakdown-values-text">
              {repayment?.number_of_pay_periods}
            </p>
          </div>
          <div className="breakdown-values-wrapper">
            <p className="breakdown-header-text">Total Cost:</p>
            <p className="breakdown-values-text">
              {formatNumberAsDollars(
                repayment?.expected_total_payback,
              )}
            </p>
          </div>

          <div className="breakdown-values-wrapper">
            <p className="breakdown-header-text">Total Paid Off:</p>
            <p className="breakdown-values-text">
              {formatNumberAsDollars(repayment?.total_amount_settled)}
            </p>
          </div>
          <div className="ledger-details-subtitle">
            <img
              className="ledger-details-subtitle-text-image"
              src={payrollIcon}
              alt="payroll icon"
              height={22.1}
              width={22.1}
              id="images-background-color"
            ></img>
            <p className="ledger-details-subtitle-text">
              Payroll Information
            </p>
          </div>
          <div className="breakdown-values-wrapper">
            <p className="breakdown-header-text">
              {payrollObject != undefined ? 'Payroll Date:' : ''}
            </p>

            <p className="breakdown-values-text">
              {payrollObject
                ? formatDate(payrollObject['PayDate__c'])
                : ''}
            </p>
          </div>
          <div className="breakdown-values-wrapper">
            <p className="breakdown-header-text">
              {payrollObject != undefined ? 'Total Cash Due:' : ''}
            </p>

            <p className="breakdown-values-text">
              {payrollObject
                ? formatNumberAsDollars(
                    payrollObject['Total_Payroll_Liability__c'],
                  )
                : ''}
            </p>
          </div>
          <div className="breakdown-values-wrapper">
            <p className="breakdown-header-text">Payroll Provider:</p>
            <p className="breakdown-values-text">
              {repayment?.merchant_payroll_company}
            </p>
          </div>
        </div>

        <div
          id="additional-detail-highlight-container-three"
          className="loan-details-section"
        >
          <div className="ledger-details-subtitle">
            <img
              className="ledger-details-subtitle-image"
              src={timelineIcon}
              alt="timeline icon"
              height={22.1}
              width={22.1}
              id="images-background-color"
            ></img>
            <p className="ledger-details-subtitle-text">
              {' '}
              Loan Timeline
            </p>
          </div>
          <div className="timeline-details-container">
            <div>
              <LoanDetailItem
                detailText="Initial Advancement Funded"
                detailAmount={repayment?.funding_amount}
                date={repayment?.funded_date}
                image={TimelineIconOne}
              ></LoanDetailItem>

              {allPaymentsList?.length
                ? allPaymentsList.map((p) => (
                    <LoanDetailItem
                      key={p.uuid}
                      detailText={
                        p.status == 'Settled'
                          ? 'Payment Debited'
                          : 'Payment Scheduled'
                      }
                      detailAmount={p.transaction_amount}
                      date={p.effective_date}
                      image={
                        p.status == 'Settled'
                          ? `${TimelineIconTwo}`
                          : `${TimelineIconThree}`
                      }
                    ></LoanDetailItem>
                  ))
                : ''}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default LedgerDetail;
