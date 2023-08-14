import { useEffect, useState } from 'react';
import { formatNumberAsDollars } from '../../../utils';
import InfoIcon from '../../../common-icons/info-icon.svg';
import '../index.scss';
interface PendingBalanceProp {
  section?: 'available-credit' | 'balance';
}
const PendingBalanceMessage = (props: PendingBalanceProp) => {
  const message =
    props.section === 'available-credit'
      ? 'It can take up to 3 business days for your payments to process and more funding to be available'
      : 'Balance does not reflect pending transactions';

  return (
    <>
      <div className="tooltip">
        <img className="pending-info-icon" src={InfoIcon}></img>
        <span className="tooltiptext">{' ' + message}</span>
      </div>
    </>
  );
};

export default PendingBalanceMessage;
