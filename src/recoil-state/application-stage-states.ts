import {
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import {
  DefaultApi,
  GetAccountDto,
  UpdateContactDto,
} from '../api-utils/generated-client';
import { Contact } from '../common-types';
import { DocumentSection } from '../pages/Application/SignAgreements/document-utils';

export const updateCurrentScreenState = atom({
  key: 'updateCurrentScreenState', // unique ID (with respect to other atoms/selectors)
  default: '', // default value (aka initial value)
});

export const isNextButtonDisabledState = atom({
  key: 'isNextButtonDisabledState',
  default: false,
});

export const currentScreenState = atom({
  key: 'currentScreenState',
  default: <
    'CompanyInfo' | 'PayrollInfo' | 'BankInfo' | 'SignAgreements'
  >'CompanyInfo',
});
export const furthestScreenState = atom({
  key: 'furthestScreenState',
  default: <
    'CompanyInfo' | 'PayrollInfo' | 'BankInfo' | 'SignAgreements'
  >'CompanyInfo',
});

export const contactsState = atom({
  key: 'contactsState',
  default: <Partial<Contact>[]>[],
});

export const signedDocsState = atom({
  key: 'signedDocsState',
  default: false,
});

export const signatureDataUrlState = atom({
  key: 'signatureDataUrlState',
  default: '',
});
export const documentSectionsState = atom({
  key: 'documentSectionsState',
  default: <DocumentSection[]>[],
});

export const showDocsState = atom({
  key: 'showDocsState',
  default: false,
});
export const docVersionState = atom({
  key: 'docVersionState',
  default: '',
});

export const clientState = atom({
  key: 'clientState',
  default: <DefaultApi | undefined>undefined,
});

export const userIsOwnerState = atom({
  key: 'userIsOwnerState',
  default: <'yes' | 'no' | undefined>undefined,
});

export const isFinicityConnectedState = atom({
  key: 'isFinicityConnectedState',
  default: false,
});

export const userContactUuidState = atom({
  key: 'userContactUuidState',
  default: <string | null>null,
});
