import './index.scss';
import { formatNumberAsDollars } from '../../../../utils';

export interface LoanGuideRow {
  interestAndFee: number;
  totalPayback: number;
}

interface LoanGuideProps {
  rowsData: LoanGuideRow[];
}
export default (props: LoanGuideProps) => {
  const rows = props.rowsData.map((rowData, idx) => {
    let weekNumber = idx + 1;
    let weekLabel = idx == 0 ? 'Week' : 'Weeks';

    return (
      <div className="repayment-guide-row" key={Math.random()}>
        <div className="repayment-guide-column-1">
          {weekNumber} {weekLabel}
        </div>
        <div className="repayment-guide-column-2">
          {formatNumberAsDollars(rowData.interestAndFee)}
        </div>
        <div className="repayment-guide-column-3">
          {formatNumberAsDollars(rowData.totalPayback)}
        </div>
      </div>
    );
  });

  return (
    <div id="repayment-guide-wrapper">
      <div
        className="repayment-guide-row first-row"
        key={Math.random()}
      >
        <div className="repayment-guide-column-1"></div>
        <div className="repayment-guide-column-2">
          Interest and Fee
        </div>
        <div className="repayment-guide-column-3">Total Payback</div>
      </div>
      {rows}
    </div>
  );
};
