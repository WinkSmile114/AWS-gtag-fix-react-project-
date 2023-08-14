import { atom } from 'recoil';
import { LoanPayment } from '../api-utils/generated-client';

export const loanPaymentsState = atom({
  key: 'loanPayments',
  default: <LoanPayment[]>[],
});
