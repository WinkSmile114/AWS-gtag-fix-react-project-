import {
  BankAccount,
  GetAccountDto,
} from '../../../api-utils/generated-client';

export interface RequestFundingWrapperProps {
  fundingStep:
    | 'congrats'
    | 'funding-amount'
    | 'repayment-date'
    | 'bank-info'
    | 'verify-payroll'
    | 'confirm'
    | 'funded'
    | 'dashboard';
  repaymentRecord: any;
  bankAccounts: BankAccount[];
  setBankAccounts?: Function;
  finchPayrollInfo: any;
  setFinchPayrollInfo: Function;
  accountRecord: GetAccountDto;
  availableAmount: any;
  uploadTheFiles: Function;
  getNewUploadedFiles: Function;
  uploadedFiles: any;
  saveRepayment: Function;
  setFundingStep: Function;
  section: 'onboarding' | 'more-funding';
  isMainInfoNextDisabled: Function;
  filledOutAllBankInfo: any;
  setFilledOutAllBankInfo: Function;
  activateReferral: Function;
  setGotPayrollInfoFromFinch: Function;
}
