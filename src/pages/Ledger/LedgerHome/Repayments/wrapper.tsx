import { GetRepaymentDto } from '../../../../api-utils/generated-client';
import Repayment from './repayment';
import { useRecoilValue } from 'recoil';
import RepaymentCardForMobile from '../RepaymentsMobileView';
import { repaymentsState } from '../../../../recoil-state/general-states';

interface RepaymentsProps {}

const RepaymentsWrapper = (props: RepaymentsProps) => {
  const repayments = useRecoilValue(repaymentsState);
  const getRepaymentDisplay = (repayment: GetRepaymentDto) => {
    return <Repayment {...repayment} key={repayment.uuid} />;
  };
  let processingRepayments: any[] = [];
  let stillInRepaymentRepayments: any[] = [];
  let completeRepayments: any[] = [];
  if (repayments) {
    repayments
      .filter((repayment) => repayment.status != 'New')
      .forEach((repayment) => {
        if (repayment.status == 'Complete') {
          completeRepayments.push(getRepaymentDisplay(repayment));
        } else if (
          repayment.status == 'Request In - Review Payroll' ||
          repayment.status == 'Funding Approved, Awaiting Wire' ||
          repayment.status == 'Wire Entered, Awaiting Approval'
        ) {
          processingRepayments.push(getRepaymentDisplay(repayment));
        } else {
          stillInRepaymentRepayments.push(
            getRepaymentDisplay(repayment),
          );
        }
      });
  }

  return (
    <>
      <div id="repayments-container">
        {processingRepayments.length > 0 && (
          <>
            <p
              id="still-in-repayment-title"
              className="repayment-section-title"
            >
              Pending Loans{' '}
            </p>

            <div id="still-in-repayment-header">
              <div className="repayment-col">Loan Id</div>
              <div className="repayment-col">Payments Made</div>
              <div className="outstanding-header repayment-col">
                Outstanding
              </div>
              <div className="status repayment-col">Status</div>
              <div className="date-funded-header repayment-col">
                Funded Date
              </div>
              <div className="funding-amount-header repayment-col">
                Funding Amount
              </div>

              <div className="payback-date-header repayment-col">
                Payback Date
              </div>
            </div>
            {processingRepayments}
          </>
        )}
        {stillInRepaymentRepayments.length > 0 && (
          <>
            <p
              id="still-in-repayment-title"
              className="repayment-section-title"
            >
              Open Loans
            </p>
            <div id="still-in-repayment-header">
              <div className="repayment-col">Loan Id</div>
              <div className="repayment-col">Payments Made</div>
              <div className="outstanding-header repayment-col">
                Outstanding
              </div>
              <div className="status repayment-col">Status</div>
              <div className="date-funded-header repayment-col">
                Funded Date
              </div>
              <div className="funding-amount-header repayment-col">
                Funding Amount
              </div>

              <div className="payback-date-header repayment-col">
                Payback Date
              </div>
            </div>
            {stillInRepaymentRepayments}
          </>
        )}
        {completeRepayments.length > 0 && (
          <>
            <p id="paid-up-title" className="repayment-section-title">
              Paid Loans
            </p>
            <div id="paid-up-repayment-header">
              <div className="repayment-col">Loan Id</div>
              <div className="repayment-col">Payments Made</div>
              <div className="outstanding-header repayment-col">
                Outstanding
              </div>
              <div className="status repayment-col">Status</div>
              <div className="date-funded-header repayment-col">
                Funded Date
              </div>
              <div className="repayment-col status">
                Funding Amount
              </div>
              <div className="date-funded-header repayment-col">
                Payback Date
              </div>
            </div>
            {completeRepayments}
          </>
        )}
      </div>
      <div id="repayments-container-mobile-view">
        {processingRepayments.map((repayment, index) => (
          <RepaymentCardForMobile
            key={index}
            repayment={repayment.props}
          />
        ))}
        {stillInRepaymentRepayments.map((repayment, index) => (
          <RepaymentCardForMobile
            key={index}
            repayment={repayment.props}
          />
        ))}
        {completeRepayments.map((repayment, index) => (
          <RepaymentCardForMobile
            key={index}
            repayment={repayment.props}
          />
        ))}
      </div>
    </>
  );
};

export default RepaymentsWrapper;
