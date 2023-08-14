import { useEffect, useState } from 'react';
import { getClient } from '../../api-utils/general-utils';
import { Contact } from '../../common-types';
import PlaidConnector from '../../widgets/PlaidConnector';
import './index.scss';
import FundPayroll from './DashboardComponents/FundPayroll';
import NextPayroll from './DashboardComponents/NextPayroll';
import PayroLineOfCredit from './DashboardComponents/PayroLineOfCredit';
import PayroAnnouncements from './DashboardComponents/PayroAnnouncements';
import HelpfulTools from './DashboardComponents/HelpfulTools';
import DataGetter from './DataGetter';
import RecentPayrollFunded from './DashboardComponents/RecentPayrollFunded';
import closeX from '../Ledger/LedgerHome/closex.svg';
import RequestFunding from '../RequestFunding';
import { GetAccountDto } from '../../api-utils/generated-client';
import Loader from '../../widgets/Loader';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  accountRecordState,
  repaymentsState,
  userContactInfoState,
} from '../../recoil-state/general-states';

const Dashboard = () => {
  const accountDetails = useRecoilValue<GetAccountDto>(
    accountRecordState,
  );
  const userContactInfo = useRecoilValue(userContactInfoState);
  const repayments = useRecoilValue(repaymentsState);
  return (
    <>
      <div id="dashboard-main-container">
        <div id="dashboard-home-container">
          <DataGetter />
          <p className="user-first-name">
            Hi,{' '}
            {userContactInfo.first_name
              ? userContactInfo.first_name
              : 'There'}
            !
          </p>

          <div className="header-highlight-container-dashboard">
            <div className="detail-container-dashboard">
              <NextPayroll />
            </div>
            <div className="detail-container-dashboard-bank">
              <PlaidConnector stage="repeat-funding" />
            </div>
            <div className="detail-container-dashboard">
              <PayroLineOfCredit
                outstandingBalance={
                  accountDetails.total_outstanding_amount as number
                }
                remainingLineOfCredit={
                  accountDetails.credit_amount_available as number
                }
              />
            </div>
          </div>

          <div className="dashboard-container-body">
            <div id="fund-payroll-and-recent-payrolls">
              <div className={'fund-payroll-container'}>
                <FundPayroll />
              </div>
              {repayments && repayments?.length < 1 ? (
                ''
              ) : (
                <div className="recent-payroll-funded-container ">
                  <RecentPayrollFunded />
                </div>
              )}
            </div>
            <div className="helpful-tools-container">
              <HelpfulTools />
            </div>
          </div>

          <div className="announcements-container">
            <PayroAnnouncements />
          </div>
        </div>
      </div>
    </>
  );
};
export default Dashboard;
