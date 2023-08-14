import { type } from 'os';
import {
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

import { v4 as uuidv4 } from 'uuid';
import {
  BankAccount,
  DraftDeal,
  GetAccountDto,
  LoanPayment,
  NewLoanDebitPayment,
  TransactionAvailability,
  UpdateBankAccountDto,
} from '../api-utils/generated-client';
export type FundingStepStateType =
  | 'congrats'
  | 'sign-contract'
  | 'funding-amount'
  | 'dashboard'
  | 'repayment-date'
  | 'bank-info'
  | 'verify-payroll'
  | 'manual-bank-form'
  | 'confirm'
  | 'funded'
  | 'failed';

export type ScreenToDisplayState =
  | 'dashboard'
  | 'request-funding-more'
  | 'ledger-home'
  | 'ledger-detail';

//I added this in didn't do anything with it
export const sectionState = atom({
  key: 'section',
  default: <'onboarding' | 'more-funding'>'more-funding',
});

export const fundingStepState = atom({
  key: 'fundingStepState', // unique ID (with respect to other atoms/selectors)
  default: <FundingStepStateType>'congrats', // default value (aka initial value)
});
export const screenToDisplayState = atom({
  key: 'screenToDisplayState', // unique ID (with respect to other atoms/selectors)
  default: <ScreenToDisplayState>'dashboard', // default value (aka initial value)
});
export const nextScheduledPaymentDateState = atom({
  key: 'nextScheduledPaymentDateState',
  default: '',
});
export const nextScheduledPaymentAmountState = atom({
  key: 'nextScheduledPaymentAmountState',
  default: 0,
});
export const nextScheduledPaymentBankNumberState = atom({
  key: 'nextScheduledPaymentBankNumberState',
  default: '',
});
export const nextScheduledPaymentBankNameState = atom({
  key: 'nextScheduledPaymentBankNameState',
  default: '',
});

export const numOfWeeksState = atom({
  key: 'numOfWeeksState',
  default: 2, // unique ID (with respect to other atoms/selectors)
});
export const ledgerDetailRepaymentIdState = atom({
  key: 'ledgerDetailRepaymentIdState',
  default: '',
});

export const repaymentRecordState = atom({
  key: 'repaymentRecordState', // unique ID (with respect to other atoms/selectors)
  default: {}, // default value (aka initial value)
});
export const loadedRepaymentState = atom({
  key: 'loadedRepaymentState', // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});

export const uploadedFilesState = atom({
  key: 'uploadedFilesState', // unique ID (with respect to other atoms/selectors)
  default: <any[]>[], // default value (aka initial value)
});

export const newCreditRequestState = atom({
  key: 'newCreditRequestState', // unique ID (with respect to other atoms/selectors)
  default: <number>0, // default value (aka initial value)
});
export const bankAccountsState = atom({
  key: 'bankAccountsState', // unique ID (with respect to other atoms/selectors)
  default: <BankAccount[]>[], // default value (aka initial value)
});

export const depositBankRoutingNumberConfirmState = atom({
  key: 'depositBankRoutingNumberConfirmState', // unique ID (with respect to other atoms/selectors)
  default: '', // default value (aka initial value)
});
export const depositBankAccountNumberConfirmState = atom({
  key: 'depositBankAccountNumberConfirmState', // unique ID (with respect to other atoms/selectors)
  default: '', // default value (aka initial value)
});

export const withdrawalBankRoutingNumberConfirmState = atom({
  key: 'withdrawalBankRoutingNumberConfirmState', // unique ID (with respect to other atoms/selectors)
  default: '', // default value (aka initial value)
});
export const withdrawalBankAccountNumberConfirmState = atom({
  key: 'withdrawalBankAccountNumberConfirmState', // unique ID (with respect to other atoms/selectors)
  default: '', // default value (aka initial value)
});

export const dealDraftState = atom({
  key: 'dealDraftState', // unique ID (with respect to other atoms/selectors)
  default: <Partial<DraftDeal>>{}, // default value (aka initial value)
});
export const depositBankState = atom({
  key: 'depositBankState',
  default: '',
});
export const withdrawalBankState = atom({
  key: 'withdrawalBankState',
  default: '',
});

export const isAllBankInfoValidState = atom({
  key: 'isAllBankInfoValidState', // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});
export const needsManualFormState = atom({
  key: 'needsManualFormState', // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});

export const bankAccountToUpdateState = atom({
  key: 'bankAccountToUpdateState',
  default: <UpdateBankAccountDto>{},
});
export const chaseBankAccountsArrayState = atom({
  key: 'chaseBankAccountsArrayState',
  default: <
    [
      {
        uuid?: '';
        bankAccountNumber?: string;
        bankRoutingNumber?: string;
        bankRoutingNumberConfirm?: string;
        bankAccountNumberConfirm?: string;
      },
    ]
  >[{}],
});

export const transactionAvailabilityState = atom({
  key: 'transactionAvailabilityState',
  default: {} as TransactionAvailability, // unique ID (with respect to other atoms/selectors)
});

export const paymentFieldsState = atom({
  key: 'paymentFieldsState', // unique ID (with respect to other atoms/selectors)
  default: (<
    { amount: number; effectiveDate: string; repaymentId: string }
  >{}) as NewLoanDebitPayment, // default value (aka initial value)
});

export const showHideClassNameState = atom({
  key: 'showHideClassNameState', // unique ID (with respect to other atoms/selectors)
  default: <'modal display-none' | 'modal display-block'>(
    'modal display-none'
  ), // default value (aka initial value)
});
export const scheduledPaymentsListRecoil = atom({
  key: 'scheduledPaymentsListRecoil',
  default: <LoanPayment[]>[],
});

export const showHideClassNameModalDisplayState = atom({
  key: 'showHideClassNameModalDisplayState ', // unique ID (with respect to other atoms/selectors)
  default: <'modal display-none' | 'modal display-block'>(
    'modal display-none'
  ), // default value (aka initial value)
});
export const showHideClassNameModalManualFormState = atom({
  key: 'showHideClassNameModalManualFormState', // unique ID (with respect to other atoms/selectors)
  default: <'modal display-none' | 'modal display-block'>(
    'modal display-none'
  ), // default value (aka initial value)
});
export const showProcessingLoaderState = atom({
  key: 'showProcessingLoaderState', // unique ID (with respect to other atoms/selectors)
  default: <false | true>false, // default value (aka initial value)
});

export const payFullBalanceState = atom({
  key: 'payFullBalanceState', // unique ID (with respect to other atoms/selectors)
  default: <'yes' | 'no' | undefined>undefined, // default value (aka initial value)
});
