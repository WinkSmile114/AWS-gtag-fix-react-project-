import { atom } from 'recoil';

import { PayrollPartner } from '../auth/SignUpForm/payrollCompanies';

import {
  GetAccountDto,
  GetRepaymentDto,
  Opportunity,
  UserObject,
} from '../api-utils/generated-client';
import { Contact } from '../common-types';
export type FundingStepStateType =
  | 'congrats'
  | 'funding-amount'
  | 'dashboard'
  | 'repayment-date'
  | 'bank-info'
  | 'verify-payroll'
  | 'confirm'
  | 'funded';
//I added this in didn't do anything with it
export const accountRecordState = atom({
  key: 'accountRecordState', // unique ID (with respect to other atoms/selectors
  default: <Partial<GetAccountDto>>{}, // default value (aka initial value)
});

export const mainSectionState = atom({
  key: 'mainSectionState', // unique ID (with respect to other atoms/selectors)
  default: <
    'Application' | 'Onboarding' | 'RepeatFunding' | undefined
  >undefined, // default value (aka initial value)
});

export const userInfoState = atom({
  key: 'userInfoState', // unique ID (with respect to other atoms/selectors)
  default: <Partial<UserObject>>{}, // default value (aka initial value)
});
export const userContactInfoState = atom({
  key: 'userContactInfoState', // unique ID (with respect to other atoms/selecto
  default: <Contact>{}, // default value (aka initial value)
});
export const userFirstNameState = atom({
  key: 'userFirstNameState', // unique ID (with respect to other atoms/selectors)
  default: <string>'', // default value (aka initial value)
});
export const userProfileLetterRecoil = atom({
  key: 'userProfileLetterRecoil', // unique ID (with respect to other atoms/selectors)
  default: <string>'', // default value (aka initial value)
});
export const selectedProfileRecoil = atom({
  key: ' selectedProfileRecoil', // unique ID (with respect to other atoms/selectors)
  default: <boolean>false, // default value (aka initial value)
});
export const selectedIntegrationsRecoil = atom({
  key: ' selectedIntegrationsRecoil', // unique ID (with respect to other atoms/selectors)
  default: <boolean>false, // default value (aka initial value)
});
export const emailforgotPasswordState = atom({
  key: 'emailforgotPasswordState', // unique ID (with respect to other atoms/selectors)
  default: <string>'', // default value (aka initial value)
});
export const allAccountUsersContactInfoState = atom({
  key: 'allAccountUsersContactInfoState', // unique ID (with respect to other atoms/selectors)
  default: <Contact[]>[], // default value (aka initial value)
});
export const opportunityState = atom({
  key: 'opportunityState', // unique ID (with respect to other atoms/selectors)
  default: <Opportunity[] | undefined>undefined, // default value (aka initial value)
});
export const repaymentsState = atom({
  key: 'repaymentsState', // unique ID (with respect to other atoms/selectors)
  default: <GetRepaymentDto[] | undefined>undefined, // default value (aka initial value)
});
export const recentRepaymentsState = atom({
  key: 'recentRepaymentsState ', // unique ID (with respect to other atoms/selectors)
  default: <GetRepaymentDto[]>{}, // default value (aka initial value)
});
export const nextPayrollObjectState = atom({
  key: 'nextPayrollObjectState', // unique ID (with respect to other atoms/selectors)
  default: <any>[], // default value (aka initial value)
});

export const activeRepaymentsState = atom({
  key: 'activeRepaymentsState', // unique ID (with respect to other atoms/selectors)
  default: <GetRepaymentDto[]>{}, // default value (aka initial value)
});
export const isPlaidConnectedState = atom({
  key: 'isPlaidConnectedState',
  default: <'unknown' | 'yes' | 'no'>'unknown',
});

export const plaidAccountsWithoutNumbersState = atom({
  key: 'plaidAccountsWithoutNumbersState',
  default: [],
});

export const payrollPartnerState = atom({
  key: 'payrollPartnerState',
  default: <Partial<PayrollPartner>>{},
});
export const pendingTransactionsState = atom({
  key: 'pendingTransactionsState ',
  default: <true | false>false,
});
