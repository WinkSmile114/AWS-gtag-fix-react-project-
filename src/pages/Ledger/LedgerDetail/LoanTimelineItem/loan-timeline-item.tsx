import { formatDate, formatNumberAsDollars } from '../../../../utils';
import './loan-timeline-item.scss';

interface LoanDetailProps {
  detailText: string;
  date: string | undefined;
  detailAmount: number | undefined;
  image: any;
}

const LoanDetailItem = (props: LoanDetailProps) => {
  return (
    <div className="loan-timeline-item">
      <img className="loan-timeline-circle" src={props.image} />

      <div className="timeline-header-text">
        {props.detailText}{' '}
        <div className="timeline-item-details">
          <span className="advancement-date">
            {formatDate(props.date)}
          </span>
          <span>{formatNumberAsDollars(props.detailAmount)}</span>
        </div>
      </div>
    </div>
  );
};
export default LoanDetailItem;
