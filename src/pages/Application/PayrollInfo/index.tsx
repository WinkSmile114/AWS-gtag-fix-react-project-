import TitleSection from '../../../Header/title-section';
import FinchConnector from '../../../widgets/FinchConnector';
import { useEffect, useState } from 'react';

import { isFeatureOn } from '../../../utils';
import { getClient } from '../../../api-utils/general-utils';

import PayroInput from '../../../widgets/PayroInput';
import PayroSelect from '../../../widgets/PayroSelectv2';
import Loader from '../../../widgets/Loader';

import companyList from './companies';
import { GetAccountDto } from '../../../api-utils/generated-client';
import { useRecoilValue, useRecoilState } from 'recoil';
import { isNextButtonDisabledState } from '../../../recoil-state/application-stage-states';
import {
  finchPayrollInfoState,
  payrollCompanyState,
  payrollAmountState,
  numOfEmployeesState,
  payrollFrequencyState,
  opportunityRecordState,
} from '../../../recoil-state/finch-states';
import {
  accountRecordState,
  opportunityState,
} from '../../../recoil-state/general-states';

//gets from api in for "2021-04-15"
//needs to be stored in same form, but datepicker sets as date object and needs to be initialized as date object

const PayrollInfo = () => {
  const finchFeatureOn: boolean = isFeatureOn('Finch');
  const [showPayrollPickers, setShowPayrollPickers] =
    useState<boolean>(true);
  const [loadedFinch, setLoadedFinch] =
    useState<boolean>(finchFeatureOn);

  const [finchPayrollInfo, setFinchPayrollInfo] = useRecoilState<any>(
    finchPayrollInfoState,
  );

  const [opportunityRecord, setOpportunityRecord] =
    useRecoilState<any>(opportunityRecordState);
  const [accountInfo, setAccountInfo] = useState<GetAccountDto>();
  const [isNextDisabled, setIsNextDisabled] = useRecoilState(
    isNextButtonDisabledState,
  );
  const [payrollCompany, setPayrollCompany] = useRecoilState<any>(
    payrollCompanyState,
  );
  const [payrollAmount, setPayrollAmount] = useRecoilState<any>(
    payrollAmountState,
  );
  const [numOfEmployees, setNumOfEmployees] = useRecoilState<any>(
    numOfEmployeesState,
  );
  const [payrollFrequency, setPayrollFrequency] = useRecoilState<any>(
    payrollFrequencyState,
  );

  const AccountInfo = useRecoilValue(accountRecordState);
  const [gotApi, setGotApi] = useState(false);
  const opportunities = useRecoilValue(opportunityState);
  const payrollCompanyOptions = companyList.map((company) => {
    return {
      value: company.id,
      label: company.name,
    };
  });
  const companies = payrollCompanyOptions.map(
    (allInfo) => allInfo.label,
  );

  useEffect(() => {
    const getApiInfo = async () => {
      const apiClient = await getClient();

      if (!apiClient) {
        return;
      }

      if (!payrollCompany) {
        setPayrollCompany(AccountInfo.payroll_company);
      }
      
      if (!opportunities) return;
      const mostRecentOpportunity = opportunities[0];
      setOpportunityRecord(mostRecentOpportunity);
      setPayrollAmount(
        mostRecentOpportunity.average_payroll_amount?.toString(),
      );
      setNumOfEmployees(
        mostRecentOpportunity.number_of_employees_range,
      );
      if (mostRecentOpportunity.how_often_do_you_run_payroll) {
        setPayrollFrequency(
          mostRecentOpportunity.how_often_do_you_run_payroll
            .toLowerCase()
            .replaceAll(' ', ''),
        );
      }
    };

    getApiInfo().then(() => setGotApi(true));
  }, []);

  useEffect(() => {
    setIsNextDisabled(
      (!finchFeatureOn || (loadedFinch && showPayrollPickers)) &&
        (!payrollFrequency ||
          !numOfEmployees ||
          !payrollAmount ||
          (gotApi && !payrollCompany)),
    );
  });

  if (!gotApi) {
    return <Loader />;
  }

  return (
    <div>
      <TitleSection
        pageTitle="Payroll Info"
        pageNumAndOutOf="2/4"
        title="Tell us about your payroll and employees"
      />

      {finchFeatureOn && (
        <FinchConnector
          associatedPhase="opportunity"
          refresh="no"
          isConnectedCallback={() => {
            setShowPayrollPickers(false);
            setLoadedFinch(true);
          }}
          isDisconnectedCallback={() => setLoadedFinch(true)}
          onDisconnect={() => {
            setShowPayrollPickers(true);
            window.location.reload();
          }}
        />
      )}

      {(!finchFeatureOn || (loadedFinch && showPayrollPickers)) && (
        <>
          {}

          <PayroInput
            label="What payroll company do you use?"
            value={payrollCompany}
            onChange={(selectedCompany: any) => {
              setPayrollCompany(selectedCompany);
            }}
            onBlurFunction={(e: any) => e.stopPropagation()}
            isSearch={true}
            searchOptions={companies}
            placeholder="Search Payroll Companies"
            variant="white"
            error={payrollCompany == ''}
          />

          <PayroSelect
            options={[
              { label: 'Less than 5k', value: 'less than 5k' },
              { label: '5 - 20k', value: '5 - 20k' },
              { label: '21 - 50k', value: '21 - 50k' },
              { label: '51 - 500k', value: '51 - 500k' },
            ]}
            disabled={finchPayrollInfo ? true : false}
            defaultSelectedValue={payrollAmount}
            placeholderText="Select a range"
            onSelect={(e: any) => setPayrollAmount(e)}
            selectName="payrollAmount"
            label="What is your typical payroll amount?"
          />
          <PayroSelect
            options={
              //"1-5" | "6-20" | "21-50" | "51-100" | "101-200" | "moreThan200"
              [
                { label: '1 - 5', value: '1-5' },
                { label: '6 - 20', value: '6-20' },
                { label: '21 - 50', value: '21-50' },
                { label: '51 - 100', value: '51-100' },
                { label: '101 - 200', value: '101-200' },
                { label: 'More than 200', value: 'moreThan200' },
              ]
            }
            disabled={finchPayrollInfo ? true : false}
            defaultSelectedValue={
              numOfEmployees ? numOfEmployees : ''
            }
            placeholderText="Select a range"
            onSelect={(e: any) => setNumOfEmployees(e)}
            selectName="numOfEmployees"
            label="How many employees do you have?"
          />

          <PayroSelect
            disabled={finchPayrollInfo ? true : false}
            options={[
              { label: 'Weekly', value: 'weekly' },
              { label: 'Bi-weekly', value: 'biweekly' },
              { label: 'Monthly', value: 'monthly' },
              { label: 'Bi-monthly', value: 'bimonthly' },
            ]}
            defaultSelectedValue={
              payrollFrequency ? payrollFrequency : ''
            }
            placeholderText="Select how often"
            onSelect={(e: any) => setPayrollFrequency(e)}
            selectName="payrollFrequency"
            label="How often do you run payroll?"
          />
        </>
      )}
      <>{}</>
    </div>
  );
};

export default PayrollInfo;
