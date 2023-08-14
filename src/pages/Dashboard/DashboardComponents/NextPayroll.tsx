import { useEffect, useState } from 'react';
import { formatDate, formatNumberAsDollars } from '../../../utils';
import '../../Dashboard/index.scss';
import payrollIcon from '../../../common-icons/dashboard-next-payroll-icon.svg';
import { useRecoilState, useRecoilValue } from 'recoil';
import { nextPayrollObjectState } from '../../../recoil-state/general-states';
import { getClient } from '../../../api-utils/general-utils';
import DataGetter from '../DataGetter';

const NextPayroll = () => {
  const nextPayrollObject = useRecoilValue(nextPayrollObjectState);

  return (
    <div className="individual-wrapper">
      <p className="dashboard-header-title"> Your Next Payroll:</p>
      <div className="payroll-date-and-text-wrapper">
        <p className="dashboard-header-value">
          {nextPayrollObject.payroll_date ? (
            formatDate(nextPayrollObject.payroll_date)
          ) : (
            <span className="no-next-payroll-text">
              Your payroll system isn't connected
            </span>
          )}
        </p>
        {nextPayrollObject.number_of_days_untill_payroll && (
          <>
            <p className="dashboard-in-two-days-text-style">
              In {nextPayrollObject.number_of_days_untill_payroll}{' '}
              {nextPayrollObject.number_of_days_untill_payroll <= 1
                ? 'Day'
                : 'Days'}
            </p>
          </>
        )}
      </div>
      {nextPayrollObject.payroll_amount && (
        <div className="payroll-numbers-wrapper">
          <img src={payrollIcon} />
          <p className="payroll-amount">
            <span className="numbers">
              {formatNumberAsDollars(
                nextPayrollObject.payroll_amount
                  ? nextPayrollObject.payroll_amount
                  : '',
              )}{' '}
            </span>{' '}
          </p>
          <p className="payroll-amount"> (Est. amount) </p>
        </div>
      )}
    </div>
  );
};

export default NextPayroll;
