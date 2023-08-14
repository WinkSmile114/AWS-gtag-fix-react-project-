import { GetRepaymentDto } from '../../../../api-utils/generated-client';
import { formatDate, formatNumberAsDollars } from '../../../../utils';
import { getLoanIdToDisplay } from '../../ledger-utils';
import '../index.scss';
import detailsIcon from '../../../../common-icons/details-icon.svg';
import { useHistory } from 'react-router-dom';
import PdfStatements from '../../PdfStatements';

const RepaymentUi = (props: GetRepaymentDto) => {
  let history = useHistory();
  return (
    <div className="repayment-wrapper" onClick={() => {}}>
      <>
        <div className="loan-id repayment-info-item repayment-col">
          <div key={props.uuid} className="loan-id-image-wrapper">
            <img
              className="loan-image"
              src={detailsIcon}
              height={22.01}
              width={22.01}
              onClick={() => {
                history.push(`/ledger-detail/${props.uuid}`);
              }}
            ></img>
            <a
              href={`/ledger-detail/${props.uuid}`}
              className="details"
            >
              {getLoanIdToDisplay(props.uuid)}
            </a>
          </div>
        </div>
      </>

      <div className="payments-made repayment-info-item repayment-col">
        {formatNumberAsDollars(props.total_amount_settled)}
        <div
          id="progress-bar-wrapper"
          className="header-pg-bar-wrapper"
        >
          <div>
            <div id="progress-bar-container-v2">
              {props.status == 'Complete' && (
                <div
                  id="green-completed"
                  className="one-hundred-percent"
                ></div>
              )}

              {props.status != 'Complete' &&
                props.payoff != null &&
                props.total_amount_settled > 0 && (
                  <div
                    id="green-completed"
                    className={
                      parseInt(props.payoff) <= 5
                        ? 'width-5-percent'
                        : parseInt(props.payoff) <= 10
                        ? 'width-10-percent'
                        : parseInt(props.payoff) <= 15
                        ? 'width-15-percent'
                        : parseInt(props.payoff) <= 20
                        ? 'width-20-percent'
                        : parseInt(props.payoff) <= 25
                        ? 'width-25-percent'
                        : parseInt(props.payoff) <= 30
                        ? 'width-30-percent'
                        : parseInt(props.payoff) <= 35
                        ? 'width-35-percent'
                        : parseInt(props.payoff) <= 40
                        ? 'width-40-percent'
                        : parseInt(props.payoff) <= 45
                        ? 'width-45-percent'
                        : parseInt(props.payoff) <= 50
                        ? 'width-50-percent'
                        : parseInt(props.payoff) <= 55
                        ? 'width-55-percent'
                        : parseInt(props.payoff) <= 60
                        ? 'width-60-percent'
                        : parseInt(props.payoff) <= 65
                        ? 'width-65-percent'
                        : parseInt(props.payoff) <= 70
                        ? 'width-70-percent'
                        : parseInt(props.payoff) <= 75
                        ? 'width-75-percent'
                        : parseInt(props.payoff) <= 80
                        ? 'width-80-percent'
                        : parseInt(props.payoff) <= 85
                        ? 'width-85-percent'
                        : parseInt(props.payoff) <= 90
                        ? 'width-90-percent'
                        : parseInt(props.payoff) <= 95
                        ? 'width-95-percent'
                        : parseInt(props.payoff) <= 100
                        ? 'width-100-percent'
                        : 'width-50-percent'
                    }
                  ></div>
                )}
            </div>
          </div>
          <div
            className={
              props.status != 'Complete' &&
              props.total_amount_settled <= 0
                ? 'status-red repayment-info-item'
                : 'status-green repayment-info-item'
            }
          >
            {props.status == 'Complete'
              ? 100
              : props.payoff == null
              ? 0
              : props.payoff}
            %
          </div>
        </div>
      </div>

      {props.status != 'Complete' && (
        <div
          className={
            props.status == 'Active'
              ? 'outstanding-balance-active repayment-info-item repayment-col'
              : 'outstanding-balance repayment-info-item repayment-col'
          }
        >
          {formatNumberAsDollars(props.total_outstanding_amount)}
        </div>
      )}
      {props.status == 'Active' && (
        <div className="status-active repayment-info-item ">
          Active
        </div>
      )}

      {props.status == 'Request In - Review Payroll' && (
        <div className="status-pending repayment-info-item ">
          Pending{' '}
        </div>
      )}

      {props.status == 'Funding Approved, Awaiting Wire' && (
        <div className="status-pending repayment-info-item ">
          Pending{' '}
        </div>
      )}
      {props.status == 'Wire Entered, Awaiting Approval' && (
        <div className="status-pending repayment-info-item ">
          Pending{' '}
        </div>
      )}
      {props.status == 'Written Off' && (
        <div className="status-active repayment-info-item ">
          Active{' '}
        </div>
      )}

      {props.status == 'Complete' && (
        <div className="outstanding-balance-zero repayment-info-item repayment-col">
          $0.00
        </div>
      )}
      {props.status == 'Complete' && (
        <div className="status-paid repayment-info-item ">Paid</div>
      )}
      <div
        className={
          (props.status == 'Active' &&
            'date-funded-active repayment-info-item repayment-col') ||
          (props.status == 'Complete' &&
            'date-funded-complete repayment-info-item repayment-col') ||
          'date-funded repayment-info-item repayment-col'
        }
      >
        {formatDate(props.funded_date)}
      </div>
      <div
        className={
          props.status === 'Active'
            ? 'funding-amount-active repayment-info-item repayment-col'
            : props.status === 'Complete'
            ? 'funding-amount-complete repayment-info-item repayment-col'
            : 'funding-amount repayment-info-item repayment-col'
        }
      >
        {formatNumberAsDollars(props.funding_amount)}
      </div>
      <div className="date-and-download-icon-wrapper">
        <div
          className={
            props.status == 'Active' || props.status == 'Complete'
              ? 'payback-date-active repayment-info-item repayment-col-active'
              : 'payback-date repayment-info-item repayment-col'
          }
        >
          {formatDate(props.next_hit_date)}
          <div>
            {props.status == 'Active' ||
            props.status == 'Complete' ? (
              <PdfStatements repaymentUuid={props.uuid} />
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepaymentUi;
