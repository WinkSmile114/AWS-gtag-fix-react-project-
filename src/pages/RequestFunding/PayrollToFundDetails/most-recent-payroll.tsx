import refreshLogo from '../../../common-icons/refresh.png';
import finchLogo from '../../../widgets/FinchConnector/finch-logo.png';
import './most-recent-payroll.css';

export interface MostRecentPayrollProps {
  debitDate: string;
  payDate: string;
  refreshPayroll: Function;
  isThereFuturePayroll: 'yes' | 'no' | undefined;
  isConnected: boolean;
}
export default (props: MostRecentPayrollProps) => {
  return (
    <div id="most-recent-payroll-wrapper">
      <div id="most-recent-payroll-title">
        {props.isConnected && props.isThereFuturePayroll == 'yes' ? (
          <div>Fund Payroll</div>
        ) : (
          <div>
            Finch Connected{' '}
            <span className="most-recent-payroll-info-message">
              A future payroll is required to complete funding
            </span>{' '}
          </div>
        )}
      </div>
      <div className="most-recent-payroll-info"></div>
      <div className="most-recent-payroll-info">
        Debit: {props.debitDate}
        <div className="most-recent-payroll-divider"></div>
        Pay: {props.payDate}
        <div className="most-recent-payroll-divider"></div>
        <img src={finchLogo}></img>
        Finch API
        <img
          id="refresh-icon"
          src={refreshLogo}
          onClick={() => props.refreshPayroll()}
        ></img>
      </div>
    </div>
  );
};
