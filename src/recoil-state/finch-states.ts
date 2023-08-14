import { PayrollInfo } from '../api-utils/generated-client';

import {
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

export const payrollCompanyState = atom({
  key: 'payrollCompany',
  default: <'' | undefined>undefined,
});
export const payrollAmountState = atom({
  key: 'payrollAmount',
  default: '',
});

export const numOfEmployeesState = atom({
  key: 'numOfEmployees',
  default: <
    '1-5' | '6-20' | '21-50' | '51-100' | '101-200' | 'moreThan200'
  >'1-5',
});
export const payrollFrequencyState = atom({
  key: 'payrollFrequency',
  default: <'weekly' | 'monthly' | 'biweekly' | 'bimonthly'>(
    'biweekly'
  ),
});

export const gotPayrollInfoFromFinchState = atom({
  key: 'gotPayrollInfoFromFinchState', // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});
export const opportunityRecordState = atom({
  key: 'opportunityRecordState', // unique ID (with respect to other atoms/selectors)
  default: '', // default value (aka initial value)
});

export const finchPayrollInfoState = atom({
  key: 'finchPayrollInfoState', // unique ID (with respect to other atoms/selectors)
  default: <PayrollInfo | undefined>undefined,
});
export const isFinchConnectedState = atom({
  key: 'isFinchConnectedState',
  default: false,
});

// export const finchFeatureOnState = atom({
//   key: 'finchFeatureOnState', // unique ID (with respect to other atoms/selectors)
//   default: false, // default value (aka initial value)
// });

export const isThereFutureFinchPayroll = atom({
  key: 'isThereFutureFinchPayroll',
  default: <'yes' | 'no' | undefined>undefined,
});

// export const mostRecentFinchPayroll = atom({
//   key: 'mostRececntFinchPayroll', // unique ID (with respect to other atoms/selectors)
//   default: {}, // default value (aka initial value)
// });
