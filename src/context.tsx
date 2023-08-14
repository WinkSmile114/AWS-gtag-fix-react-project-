import React from 'react';

export interface AppMessage {
  title?: string;
  message: string;
  level: 'info' | 'error' | 'resent' | 'modal-error';
}

export const MessageContext = React.createContext({
  messages: new Array<AppMessage>(),
  addMessage: (appMessage: AppMessage) =>
    console.log('i am just the defualt'),
  popMessage: (index: number) => console.log('i am just the defualt'),
  clearMessages: () => console.log('i am just the defualt'),
});
let initialSections: any = {
  CompanyInfo: 0,
  OwnerInfo: 0,
  PayrollInfo: 0,
  BankInfo: 0,
  SignAgreements: 0,
};
export const ApplicationProgressContext = React.createContext({
  sections: initialSections,
  setSections: (sectionsProgress: { [key: string]: number }) =>
    console.log('i am just the defualt'),
});
