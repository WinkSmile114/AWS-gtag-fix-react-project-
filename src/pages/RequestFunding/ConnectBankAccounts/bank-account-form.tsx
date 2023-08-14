import PayroInput from '../../../widgets/PayroInput';
import {
  FundingStepStateType,
  withdrawalBankRoutingNumberConfirmState,
  withdrawalBankAccountNumberConfirmState,
  depositBankRoutingNumberConfirmState,
  depositBankAccountNumberConfirmState,
  fundingStepState,
  bankAccountsState,
  dealDraftState,
  isAllBankInfoValidState,
} from '../../../recoil-state/request-funding-states';
import { useRecoilState } from 'recoil';
import { BankAccount } from '../../../api-utils/generated-client';
import BankMeta from '../../../common-components/bank-account/bank-info';
import { useState } from 'react';
import Loader from '../../../widgets/Loader';

export interface BankFormProps {
  bankAccountIndexToUpdate: number;
}

export default (props: BankFormProps) => {
  const bankNames = BankMeta.map((allInfo) => allInfo.name);

  const [bankAccounts, setBankAccounts] =
    useRecoilState(bankAccountsState);
  const [
    depositAccountNumberConfirm,
    setDepositAccountNumberConfirm,
  ] = useRecoilState(depositBankAccountNumberConfirmState);
  const [
    depositRoutingNumberConfirm,
    setDepositRoutingNumberConfirm,
  ] = useRecoilState(depositBankRoutingNumberConfirmState);
  const [
    withdrawalAccountNumberConfirm,
    setWithdrawalAccountNumberConfirm,
  ] = useRecoilState(withdrawalBankAccountNumberConfirmState);
  const [
    withdrawalRoutingNumberConfirm,
    setWithdrawalRoutingNumberConfirm,
  ] = useRecoilState(withdrawalBankRoutingNumberConfirmState);

  const updateBankAccount = (
    bankAccountUpdateInfo: Partial<BankAccount>,
  ) => {
    setBankAccounts(
      bankAccounts.map((bankAccount, index) => {
        if (index === props.bankAccountIndexToUpdate) {
          return { ...bankAccount, ...bankAccountUpdateInfo };
        }
        return bankAccount;
      }),
    );
  };
  const existingAccount =
    bankAccounts[props.bankAccountIndexToUpdate];
  const isNineNumbers = /^[0-9]{9}$/;
  if (props.bankAccountIndexToUpdate > bankAccounts.length - 1) {
    return <Loader />;
  }

  const forDepositBank: boolean =
    props.bankAccountIndexToUpdate === 0;

  const routingNumberConfirm = forDepositBank
    ? depositRoutingNumberConfirm
    : withdrawalRoutingNumberConfirm;
  const accountNumberConfirm = forDepositBank
    ? depositAccountNumberConfirm
    : withdrawalAccountNumberConfirm;

  return (
    <div
      id={
        props.bankAccountIndexToUpdate === 0
          ? 'bank-form'
          : 'withdrawal-bank-form'
      }
    >
      <div className="bank-info-input-wrapper full-width">
        <PayroInput
          label="Bank Name"
          value={existingAccount.bank_name ?? ''}
          onChange={(e) => updateBankAccount({ bank_name: e })}
          onBlurFunction={(e: any) => e.stopPropagation()}
          isSearch={true}
          searchOptions={bankNames}
          placeholder="Search Bank"
          error={existingAccount.bank_name == ''}
        />
      </div>
      <div id="routing-number-section">
        <div className="bank-info-input-wrapper left-side">
          <PayroInput
            label="Routing Number"
            value={existingAccount.bank_routing_number ?? ''}
            wrapperAdditionalClasses="full-width-left-side"
            error={
              !isNineNumbers.test(
                existingAccount.bank_routing_number ?? '',
              )
            }
            // error={bankAccountState.routingNumber.toString().length != 9}
            helperText={
              !isNineNumbers.test(
                existingAccount.bank_routing_number ?? '',
              )
                ? 'We require a valid 9 digit number'
                : ''
            }
            placeholder="Enter Routing Number"
            onChange={(e) =>
              updateBankAccount({ bank_routing_number: e })
            }
            onBlurFunction={(e: any) => e.stopPropagation()}
            onCopy={(e: any) => {
              e.preventDefault();
              return false;
            }}
            onPaste={(e: any) => {
              e.preventDefault();
              return false;
            }}

            // onBlurFunction={(e: any) => saveTheBank()}
          />
        </div>
        <div className="bank-info-input-wrapper right-side">
          <PayroInput
            wrapperAdditionalClasses="full-width-right-side"
            label=""
            placeholder="Retype Routing Number"
            value={routingNumberConfirm ?? ''}
            onChange={(e) => {
              if (forDepositBank) {
                setDepositRoutingNumberConfirm(e);
              } else {
                setWithdrawalRoutingNumberConfirm(e);
              }
            }}
            onBlurFunction={(e: any) => e.stopPropagation()}
            error={
              existingAccount.bank_routing_number !=
              routingNumberConfirm
            }
            //helperText={existingAccount.bank_routing_number!=existingAccountRoutingNumberConfirm?'Numbers must match':''}
            // onBlurFunction={(e: any) => {
            //     if (isWithdrawal){
            //         updateWithdrawalBankRoutingNumberConfirm(e.target.value)
            //     } else {
            //         updateBankAccountRoutingNumberConfirm(e.target.value)
            //     }
            // }}
            // error={bankAccountState.routingNumber != bankAccountState.confirmRoutingNumber}
            onCopy={(e: any) => {
              e.preventDefault();
              return false;
            }}
            onPaste={(e: any) => {
              e.preventDefault();
              return false;
            }}
          />
        </div>
      </div>
      <div id="account-number-section">
        <div className="bank-info-input-wrapper left-side">
          <PayroInput
            label="Account Number"
            placeholder="Enter Account Number"
            value={existingAccount.bank_account_number ?? ''}
            onChange={(e) =>
              updateBankAccount({ bank_account_number: e })
            }
            onBlurFunction={(e: any) => e.stopPropagation()}
            error={existingAccount.bank_account_number == ''}
            onCopy={(e: any) => {
              e.preventDefault();
              return false;
            }}
            onPaste={(e: any) => {
              e.preventDefault();
              return false;
            }}
            // onBlurFunction={(e: any) => saveTheBank()}
            // error={bankAccountState.accountNumber.toString().length < 5}
          />
        </div>
        <div className="bank-info-input-wrapper right-side">
          <PayroInput
            label=""
            placeholder="Retype Account Number"
            value={accountNumberConfirm}
            onChange={(e) => {
              if (forDepositBank) {
                setDepositAccountNumberConfirm(e);
              } else {
                setWithdrawalAccountNumberConfirm(e);
              }
            }}
            error={
              existingAccount.bank_account_number !=
              accountNumberConfirm
            }
            // onBlurFunction={(e: any) => {
            //     if (isWithdrawal){
            //         updateWithdrawalBankAccountNumberConfirm(e.target.value)
            //     } else {
            //         updateBankAccountAccountNumberConfirm(e.target.value)
            //     }
            // }}
            onBlurFunction={(e: any) => e.stopPropagation()}
            onCopy={(e: any) => {
              e.preventDefault();
              return false;
            }}
            onPaste={(e: any) => {
              e.preventDefault();
              return false;
            }}

            // error={bankAccountState.accountNumber != bankAccountState.confirmAccountNumber}
          />
        </div>
      </div>
    </div>
  );
};
