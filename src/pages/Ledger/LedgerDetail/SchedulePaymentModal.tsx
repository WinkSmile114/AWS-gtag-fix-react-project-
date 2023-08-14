import { formatDate, formatNumberAsDollars } from '../../../utils';
import './index.scss';
import {
  GetRepaymentDto,
  LoanPayment,
  NewLoanDebitPayment,
} from '../../../api-utils/generated-client';
import PayroButton from '../../../widgets/PayroButton';
import { useEffect, useState } from 'react';
import { getClient } from '../../../api-utils/general-utils';
import PayroSelect, {
  SelectOption,
} from '../../../widgets/PayroSelectv2';
import PayroInput from '../../../widgets/PayroInput';
import Loader from '../../../widgets/Loader';
import {
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import {
  payFullBalanceState,
  paymentFieldsState,
  scheduledPaymentsListRecoil,
  showHideClassNameState,
  showProcessingLoaderState,
} from '../../../recoil-state/request-funding-states';
import PayroRadioButtonGroup from '../../../widgets/PayroRadioButtonGroup';
import { activeRepaymentsState } from '../../../recoil-state/general-states';
import ScheduledIcon from '../../../common-icons/payment-scheduled-icon.svg';
import PaymentFailed from './PaymentFailed/PaymentFailed';
import DealFailed from '../../RequestFunding/DealFailed/DealFailed';
import { useHistory } from 'react-router-dom';
import InfoMessage from '../../../widgets/InfoMessage';

interface ModalProps {
  loanId: string;
  repaymentBalance: number | undefined;
  nextScheduledPaymentBankName: string | undefined;
  nextScheduledPaymentBankNumber: string | undefined;
  repaymentSfId?: string;
  repaymentUuid: string;
  repaymentPaybackDate: string;
  className: string;
}

export default (props: ModalProps) => {
  let history = useHistory();
  const [showHideClassName, setShowHideClassName] = useRecoilState(
    showHideClassNameState,
  );
  const [activeRepayments, setActiveRepaymentsList] = useRecoilState<
    GetRepaymentDto[]
  >(activeRepaymentsState);
  const [paymentFields, setPaymentFields] =
    useRecoilState<NewLoanDebitPayment>(paymentFieldsState);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [ableToSchedulePayment, setAbleToSchedulePayment] =
    useState<boolean>(true);
  const [payFullBalance, setPayFullBalance] = useRecoilState(
    payFullBalanceState,
  );
  const scheduledPaymentsList = useRecoilValue<LoanPayment[]>(
    scheduledPaymentsListRecoil,
  );

  useEffect(() => {
    const getData = async () => {
      const client = await getClient();
      if (!client) {
        return;
      }
      const getDateApi =
        await client.paymentsControllerGetPaymentAvailability(
          props.repaymentUuid,
        );
      // console.log(getDateApi.data.payment_date, 'hindy');
      const effectiveDate = getDateApi.data.payment_date;
      if (getDateApi.data.payment_date == undefined) {
        setAbleToSchedulePayment(false);
      } else {
        setAbleToSchedulePayment(true);
      }
      if (props.repaymentSfId != undefined) {
        setPaymentFields({
          ...paymentFields,
          repaymentId: props.repaymentSfId,
          effectiveDate: getDateApi.data.payment_date,
        });
      }
      {
        effectiveDate != undefined &&
          activeRepayments.length > 0 &&
          setPaymentFields({
            ...paymentFields,
            effectiveDate: getDateApi.data.payment_date,
            repaymentId: props.repaymentSfId
              ? props.repaymentSfId
              : activeRepayments[0].salesforce_id,
            amount: 0,
          });
      }
    };

    getData();
  }, [paymentFields.effectiveDate]);

  useEffect(() => {}, [payFullBalance]);

  const onSubmit = async () => {
    setShowLoader(true);
    const client = await getClient();
    if (!client) {
      return;
    }

    await localStorage.setItem('paymentId', props.loanId);
    await localStorage.setItem('repaymentUuid', props.repaymentUuid);
    await localStorage.setItem(
      'repaymentPaybackDate',
      props.repaymentPaybackDate,
    );
    await localStorage.setItem(
      'paymentAmount',
      paymentFields.amount.toString(),
    );
    try {
      const schedulePayment =
        await client.paymentsControllerCreateLoanDebitPayment(
          paymentFields,
        );

      if (schedulePayment.status == 201) {
        setShowLoader(false);
        history.push('/payment-scheduled');
      } else {
        setShowLoader(false);
        history.push('/payment-failed');
      }
    } catch {
      setShowLoader(false);
      history.push('/payment-failed');
    }
  };
  const saveFundingAmount = async (paymentAmount: number) => {
    await setPaymentFields({
      ...paymentFields,
      amount: paymentAmount,
    });
  };
  if (showLoader) {
    setPaymentFields({
      ...paymentFields,
      amount: 0,
    });
    if (paymentFields.effectiveDate == '') {
      console.log('empty');
    }
    return (
      <Loader
        fullPageLoader={true}
        message="Your payment is being processed"
      />
    );
  }
  return (
    <>
      <div id="myModal" className={showHideClassName}>
        <div className="modal-content">
          <span
            onClick={() => {
              setShowHideClassName('modal display-none');
            }}
            className="close"
          >
            &times;
          </span>
          {!ableToSchedulePayment ? (
            <div className="payment-wrapper-unable-to-schedule">
              <img src={ScheduledIcon}></img>
              <p className="loan-id-title-style">
                Loan #{props.loanId}
              </p>
              <p className="payment-explanation-style">
                Your final payment for is already scheduled for {''}
                {formatDate(props.repaymentPaybackDate)}.
              </p>

              <InfoMessage
                theBackgroundColor="yellow"
                messageText="For further assistance, or to make any changes to your current payments, please call us at
                1-833-271-4499."
              ></InfoMessage>
            </div>
          ) : (
            <>
              <p className="modal-header ">Schedule a payment</p>
              {scheduledPaymentsList &&
              scheduledPaymentsList.length > 0 ? (
                <InfoMessage
                  theBackgroundColor="yellow"
                  messageText="You have scheduled payments for this loan. Proceeding will schedule an additional payment."
                ></InfoMessage>
              ) : (
                //console.log(scheduledPaymentsList)
                ''
              )}
              <div>
                <p className={'modal-outstanding-balance-title'}>
                  Current Outstanding Balance for Loan #{props.loanId}
                </p>

                <p id="outstanding-balance-number-modal">
                  {formatNumberAsDollars(
                    props.repaymentBalance
                      ? props.repaymentBalance
                      : 0,
                  )}
                </p>
              </div>

              <>
                <PayroRadioButtonGroup
                  groupLabel="Payment Amount:"
                  options={[
                    {
                      label: 'Total Balance',
                      subLabel: ` ${formatNumberAsDollars(
                        props.repaymentBalance
                          ? props.repaymentBalance
                          : 0,
                      )}`,
                      value: 'yes',
                    },
                    { label: 'Other Amount', value: 'no' },
                  ]}
                  checkedValue={payFullBalance}
                  onValueChange={async (e) => {
                    setPayFullBalance(e.target.value as 'yes' | 'no');
                    if (e.target.value == 'yes') {
                      const number = props.repaymentBalance;
                      //   ? props.repaymentBalance.replace('$', '')
                      //   : '';
                      // const formattedNumber = number.replace(',', '');
                      setPaymentFields({
                        ...paymentFields,
                        amount: parseFloat(
                          number ? number.toString() : '',
                        ),
                      });
                    } else if (e.target.value == 'no') {
                      setPaymentFields({
                        ...paymentFields,
                        amount: 0,
                      });
                    }
                  }}
                  groupName="pay-full-balance"
                />
              </>

              <div>
                {payFullBalance == 'no' && (
                  <>
                    {/* <p className="modal-titles">Enter Payment Amount:</p> */}
                    <div className="funding-amount-item actual-amount">
                      <PayroInput
                        onBlurFunction={(e: any) => {
                          saveFundingAmount(
                            parseFloat(e.target.value),
                          ).then(() => {});
                        }}
                        required
                        placeholder="0.00"
                        value={paymentFields.amount ?? 0}
                        onChange={(eventValue: any) => {
                          if (eventValue) {
                            setPaymentFields({
                              ...paymentFields,
                              amount: parseFloat(eventValue),
                            });
                          }
                        }}
                        label=""
                        variant="green"
                        type="currency"
                        error={
                          props.repaymentBalance
                            ? paymentFields.amount >
                              props.repaymentBalance
                            : false
                        }
                        helperText={
                          props.repaymentBalance &&
                          paymentFields.amount >
                            props.repaymentBalance
                            ? 'Payment amount cannot exceed the total balance'
                            : ''
                        }
                      />
                    </div>
                  </>
                )}
                <div id="modal-wrapper">
                  <div id="modal-details-container">
                    <p className="modal-subtitles">
                      Debiting from Account:
                    </p>

                    <span className="modal-details">
                      {props.nextScheduledPaymentBankName} ***{' '}
                      {props.nextScheduledPaymentBankNumber
                        ? props.nextScheduledPaymentBankNumber.slice(
                            props.nextScheduledPaymentBankNumber
                              .length - 4,
                          )
                        : ''}
                    </span>
                  </div>{' '}
                  <div id="modal-details-container">
                    <p className="modal-subtitles">Debiting Date:</p>
                    <span className="modal-details-payment-date">
                      {formatDate(paymentFields.effectiveDate)}
                    </span>
                  </div>
                </div>
                <p className="notification-text">
                  The deadline to schedule next-day payment is 4:30 PM
                  EST
                </p>
                <div
                  id="myBtn"
                  className="button-wrapper-remit-payment-modal-cancel"
                >
                  <PayroButton
                    buttonSize="medium"
                    variant="red-white"
                    onClick={() => {
                      setShowHideClassName('modal display-none');
                    }}
                  >
                    Cancel Payment
                  </PayroButton>
                </div>
                <div
                  id="myBtn"
                  className="button-wrapper-remit-payment-modal"
                >
                  <PayroButton
                    buttonSize="medium"
                    disabled={
                      !paymentFields.amount ||
                      (props.repaymentBalance
                        ? paymentFields.amount >
                          props.repaymentBalance
                        : false)
                    }
                    onClick={() => onSubmit()}
                  >
                    Schedule Payment
                  </PayroButton>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
