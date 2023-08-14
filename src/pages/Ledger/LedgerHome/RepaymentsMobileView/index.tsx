import { formatDate, formatNumberAsDollars } from '../../../../utils';
import ProgressBar from '../../../../widgets/ShimonsProgressBar/index';
import svgcoins from '../../../../common-icons/coins.svg';

import './index.scss';
import { useHistory } from 'react-router-dom';
import PdfStatements from '../../PdfStatements';

const RepaymentCardForMobile = ({ repayment }: any) => {
  let history = useHistory();
  return (
    <div className="repayments-container-mobile-view-card">
      {' '}
      <div className="nameandstatuscontainer">
        <div className="loan-id-image-wrapper-mobile">
          <img
            className="loan-image"
            src={svgcoins}
            height={22.01}
            width={22.01}
            onClick={() => {
              history.push(`/ledger-detail/${repayment.uuid}`);
            }}
          ></img>
          <a
            href={`/ledger-detail/${repayment.uuid}`}
            className="details"
          >
            {repayment.uuid.substring(repayment.uuid.length - 4)}
          </a>
          <div>
            {repayment.status == 'Active' ||
            repayment.status == 'Complete' ? (
              <PdfStatements repaymentUuid={repayment.uuid} />
            ) : (
              ''
            )}
          </div>
        </div>

        <div className="repayment-status">
          {repayment.status == 'Active' && (
            <div className="status-active repayment-info-item ">
              Active
            </div>
          )}
          {repayment.status == 'Complete' && (
            <div className="status-paid repayment-info-item ">
              Complete
            </div>
          )}

          {repayment.status == 'Request In - Review Payroll' && (
            <div className="status-pending repayment-info-item ">
              Pending{' '}
            </div>
          )}

          {repayment.status == 'Funding Approved, Awaiting Wire' && (
            <div className="status-pending repayment-info-item ">
              Pending{' '}
            </div>
          )}
          {repayment.status == 'Wire Entered, Awaiting Approval' && (
            <div className="status-pending repayment-info-item ">
              Pending{' '}
            </div>
          )}
          {repayment.status == 'Written Off' && (
            <div className="status-active repayment-info-item ">
              Active{' '}
            </div>
          )}
        </div>
      </div>
      <div className="outstandingBalanceandPayoffDateContainer">
        <div className="outstandingBalancecontainer">
          <div className="outstandingBalance-AmountHeader">
            Outstanding Balance
          </div>
          <div className="outstandingBalance-Amount">
            {formatNumberAsDollars(
              repayment.total_outstanding_amount,
            )}
          </div>
        </div>
        <span className="balanceandpayoffdatedivider"></span>
        <div className="PayoffDateContainer">
          <div className="payoffdate-header">Final Payoff Date</div>
          <div className="payoffdate-date">
            {repayment.next_hit_date ? (
              formatDate(repayment.next_hit_date)
            ) : (
              <div>N/A</div>
            )}
          </div>
        </div>
      </div>
      <div className="percentPaidContainer">
        <div className="percentPaidcontainer-amountpaidandpercentagepaid">
          <div className="percentpaid-amountpaid">
            {formatNumberAsDollars(repayment.total_amount_settled)}
          </div>
          <div className="percentagepaid">
            {repayment.payoff ? repayment.payoff : 0}
            {/* {Math.round(
              (repayment.total_amount_settled /
                (repayment.total_outstanding_amount +
                  repayment.total_amount_settled)) *
                100,
            )}{' '} */}
            %
          </div>
        </div>
        <div className="progressBar">
          <ProgressBar
            completedcolor="#17B794"
            barcolor="#DCDFE3"
            completed={
              (repayment.total_amount_settled /
                (repayment.total_outstanding_amount +
                  repayment.total_amount_settled)) *
              100
            }
            sectionName="LedgerHome"
          />
        </div>
      </div>
    </div>
  );
};
export default RepaymentCardForMobile;
