import React, { Component } from 'react';
import { useEffect, useState } from 'react';
import {
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { getClient } from '../../api-utils/general-utils';
import {
  GetAccountDto,
  GetRepaymentDto,
  LoanPayment,
  NextPayroll,
  Opportunity,
} from '../../api-utils/generated-client';
import { Contact } from '../../common-types';
import { GetAccountDtoPayroFinanceStatusEnum } from '../../api-utils/generated-client';
import {
  accountRecordState,
  activeRepaymentsState,
  allAccountUsersContactInfoState,
  nextPayrollObjectState,
  opportunityState,
  pendingTransactionsState,
  recentRepaymentsState,
  repaymentsState,
  userContactInfoState,
  userFirstNameState,
  userInfoState,
} from '../../recoil-state/general-states';

import Loader from '../../widgets/Loader';
import { intercom } from '../../intercom';

const DataGetter = () => {
  const userInfo = useRecoilValue(userInfoState);
  const [userContactInfo, setUserContactInfo] = useRecoilState(
    userContactInfoState,
  );
  const [accountDetails, setAccountDetails] =
    useRecoilState<GetAccountDto>(accountRecordState);
  const repayments = useRecoilValue(repaymentsState);
  const [recentRepayments, setRecentRepaymentsList] = useRecoilState<
    GetRepaymentDto[]
  >(recentRepaymentsState);
  const [activeRepayments, setActiveRepaymentsList] = useRecoilState<
    GetRepaymentDto[]
  >(activeRepaymentsState);

  const [nextPayrollObject, setNextPayrollObject] =
    useRecoilState<NextPayroll>(nextPayrollObjectState);

  const [pendingTransactions, setPendingTransactionsStatus] =
    useRecoilState<boolean>(pendingTransactionsState);
  const [payments, setPaymentsList] = useState<LoanPayment[]>();

  useEffect(() => {
    const getUserContactInfo = async () => {
      const apiClient = await getClient();
      if (!apiClient) {
        return;
      }
      const allContactsRes =
        await apiClient.contactsControllerFindAll();
      let resDataCopy = [...(allContactsRes.data as Contact[])];

      resDataCopy.forEach(async (contact) => {
        if (contact.uuid == userInfo.contact_uuid) {
          setUserContactInfo(contact);
        }
      });
      return;
    };
    const getRecentRepayments = () => {
      repayments &&
        setRecentRepaymentsList(
          repayments
            .filter(
              (p) =>
                p.status == 'Complete' ||
                p.status == 'Active' ||
                p.status == 'Request In - Review Payroll' ||
                p.status == 'Funding Approved, Awaiting Wire' ||
                p.status == 'Wire Entered, Awaiting Approval',
            )
            .sort((a, b) => {
              if (a.funded_date < b.funded_date) {
                return 1;
              } else {
                return -1;
              }
            })
            .slice(0, 2),
        );
    };
    const getActiveRepayments = () => {
      repayments &&
        setActiveRepaymentsList(
          repayments
            .filter((p) => p.status == 'Active')
            .sort((a, b) => {
              if (a.funded_date > b.funded_date) {
                return 1;
              } else {
                return -1;
              }
            }),
        );
    };
    const getNextPayroll = async () => {
      const apiClient = await getClient();
      if (!apiClient) {
        return;
      }
      const nextPayroll =
        await apiClient.payrollControllerGetNextPayroll();
      setNextPayrollObject(nextPayroll.data);
    };
    const getAccountInfo = async () => {
      const client = await getClient();
      if (!client) {
        return;
      }
      if (accountDetails == undefined) {
        const accountInfo =
          await client.accountsControllerGetMyInfo();
        setAccountDetails(accountInfo.data);
      }
    };
    const getPayments = async () => {
      const client = await getClient();
      if (!client) {
        return;
      }
      const paymentsList = await client.paymentsControllerFindAll();
      setPaymentsList(paymentsList.data);
    };
    const getPendingTransactions = () => {
      if (
        repayments &&
        repayments.find(
          (r) =>
            r.status == 'Request In - Review Payroll' ||
            r.status == 'Funding Approved, Awaiting Wire' ||
            r.status == 'Wire Entered, Awaiting Approval',
        )
      ) {
        setPendingTransactionsStatus(true);
      } else if (
        payments &&
        payments.find(
          (p) => p.status === 'Scheduled' || p.status === 'Pending',
        )
      ) {
        setPendingTransactionsStatus(true);
      }
    };

    const getAll = async () => {
      getAccountInfo();
      getNextPayroll();
      getRecentRepayments();
      getActiveRepayments();
      getUserContactInfo();
      getPayments();
      getPendingTransactions();
    };

    getAll();
  }, [repayments]);
  useEffect(() => {
    if (userContactInfo) {
      {
        intercom(
          userContactInfo.first_name,
          userContactInfo.email,
          userContactInfo.uuid,
          userContactInfo.phone,
        );
      }
    }
    //console.log(userContactInfo.uuid, 'uuid');
  }, []);

  if (!accountDetails) {
    return <Loader message="Hang on, we're fetching your data..." />;
  }

  return (
    <>
      {accountDetails.payro_finance_status ==
        GetAccountDtoPayroFinanceStatusEnum.OnHold && (
        <div id="on-hold-wrapper">
          <div id="on-hold-text">
            <p id="on-hold-text-title">
              Your account is currently on hold
            </p>
            <p>
              For further assistance, please call us at
              1-833-271-4499.
            </p>
          </div>
        </div>
      )}
      {accountDetails.payro_finance_status ==
        GetAccountDtoPayroFinanceStatusEnum.Declined && (
        <div id="on-hold-wrapper">
          <div id="on-hold-text">
            <p id="on-hold-text-title">
              Your account is currently declined for funding
            </p>
            <p>
              For further assistance, please call us at
              1-833-271-4499.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
export default DataGetter;
