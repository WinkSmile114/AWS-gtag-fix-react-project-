import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useScript } from 'use-script';
import {
  BankAccount,
  UpdateAccountDto,
  UpdateBankAccountDto,
} from '../../api-utils/generated-client';
import {
  bankAccountsState,
  bankAccountToUpdateState,
  chaseBankAccountsArrayState,
} from '../../recoil-state/request-funding-states';
import PayroInput from '../PayroInput';
import checkCircle from '../FinchConnector/check-circle.png';
import InfoIcon from '../../common-icons/info-icon.svg';
import { isNextButtonDisabledState } from '../../recoil-state/application-stage-states';
import RequestFundingTitle from '../../pages/RequestFunding/request-funding-title';
import { useHistory } from 'react-router-dom';
import './index.css';

const ManualBankForm = () => {
  let history = useHistory();
  const [bankAccounts, setBankAccounts] =
    useRecoilState(bankAccountsState);
  const [bankAccountToUpdate, setBankAccountToUpdate] =
    useRecoilState<UpdateBankAccountDto>(bankAccountToUpdateState);
  const [chaseBankAccountsArray, setChaseBankAccountsArray] =
    useRecoilState(chaseBankAccountsArrayState);

  const [isNextDisabled, setIsNextDisabled] = useRecoilState(
    isNextButtonDisabledState,
  );

  const isNineNumbers = /^[0-9]{9}$/;
  const isOnlyNumbers = /^[0-9]/;

  const index = chaseBankAccountsArray.findIndex(
    (bankItem) => bankItem.uuid === bankAccountToUpdate.uuid,
  );

  const replaceItemAtIndex = (
    arr: any,
    index: any,
    newValue: any,
  ) => {
    return [
      ...arr.slice(0, index),
      newValue,
      ...arr.slice(index + 1),
    ];
  };
  setIsNextDisabled(
    !chaseBankAccountsArray[index].bankRoutingNumber ||
      !chaseBankAccountsArray[index].bankAccountNumber ||
      chaseBankAccountsArray[index].bankRoutingNumber !=
        chaseBankAccountsArray[index].bankRoutingNumberConfirm ||
      chaseBankAccountsArray[index].bankAccountNumber !=
        chaseBankAccountsArray[index].bankAccountNumberConfirm,
  );
  ////console.log(bankAccountToUpdate);
  const p = chaseBankAccountsArray.filter(
    (b: any) => b.uuid == bankAccountToUpdate.uuid,
  );
  //console.log(p, 'p');

  return (
    <>
      <div key={bankAccountToUpdate.uuid}>
        <RequestFundingTitle
          section={'manual-bank'}
          title="Confirm Chase Bank Info"
          subtitle="For added security with Chase, your bank requires you to re-enter your checking account number and routing number manually. Plaid only shares with us the last 4 digits of your account."
        />
        <div
          id="chase-details-wrapper"
          className="connected-account-container-chase "
        >
          {/* <div className="icon-and-title-wrapper">
            <img
              className="plaid-check-circle"
              src={checkCircle}
              alt="HTML5 Icon"
            ></img>
            <p className="chase-bank-name">
              {' '}
              {bankAccountToUpdate.bank_name}{' '}
              {bankAccountToUpdate.bank_account_type} ***
              {bankAccountToUpdate.account_last_four}
            </p>{' '}
            <div className="tooltip">
              <img className="pending-info-icon" src={InfoIcon}></img>
              <span className="tooltiptext">
                {' '}
                Chase requires your account numbers be entered
                manually.
              </span>
            </div>
          </div> */}

          {chaseBankAccountsArray
            .filter((b: any) => b.uuid == bankAccountToUpdate.uuid)
            .map((account: any) => {
              return (
                <>
                  <div key={account.uuid} id="routing-number-section">
                    <div className="bank-info-input-wrapper left-side">
                      <PayroInput
                        label={` ${bankAccountToUpdate.bank_name}
                        ***${bankAccountToUpdate.account_last_four}
                       
                        Enter Full Routing Number`}
                        value={account.bankRoutingNumber}
                        wrapperAdditionalClasses="full-width-left-side"
                        onBlurFunction={(e: any) =>
                          e.stopPropagation()
                        }
                        onChange={async (e) => {
                          await setBankAccountToUpdate({
                            ...bankAccountToUpdate,
                            bank_routing_number: e.toString(),
                          });
                          const newList: any = replaceItemAtIndex(
                            chaseBankAccountsArray,
                            index,
                            {
                              ...account,
                              bankRoutingNumber: e,
                            },
                          );

                          setChaseBankAccountsArray(newList);
                        }}
                        error={
                          account.bankRoutingNumber.length > 1 &&
                          !isNineNumbers.test(
                            account.bankRoutingNumber,
                          )
                        }
                        helperText={
                          !isNineNumbers.test(
                            account.bankRoutingNumber,
                          )
                            ? 'A 9 digit number is required'
                            : ''
                        }
                        placeholder="Enter Routing Number"
                      />
                    </div>{' '}
                    <div className="bank-info-input-wrapper right-side">
                      <PayroInput
                        wrapperAdditionalClasses="full-width-right-side"
                        label=""
                        placeholder="Retype Routing Number"
                        value={account.bankRoutingNumberConfirm}
                        onChange={(e) => {
                          const newList: any = replaceItemAtIndex(
                            chaseBankAccountsArray,
                            index,
                            {
                              ...account,
                              bankRoutingNumberConfirm: e,
                            },
                          );

                          setChaseBankAccountsArray(newList);
                        }}
                        onBlurFunction={(e: any) =>
                          e.stopPropagation()
                        }
                        error={
                          account.bankRoutingNumber !=
                          account.bankRoutingNumberConfirm
                        }
                        helperText={
                          account.bankRoutingNumber !=
                          account.bankRoutingNumberConfirm
                            ? 'Numbers must match'
                            : ''
                        }
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
                        label={` ${bankAccountToUpdate.bank_name}
                             ***${bankAccountToUpdate.account_last_four}
                            
                             Enter Full Account Number`}
                        placeholder="Enter Account Number"
                        value={account.bankAccountNumber}
                        onChange={async (e) => {
                          await setBankAccountToUpdate({
                            ...bankAccountToUpdate,
                            bank_account_number: e.toString(),
                          });
                          const newList: any = replaceItemAtIndex(
                            chaseBankAccountsArray,
                            index,
                            {
                              ...account,
                              bankAccountNumber: e,
                            },
                          );

                          setChaseBankAccountsArray(newList);
                        }}
                        error={
                          account.bankAccountNumber.length > 1 &&
                          !isOnlyNumbers.test(
                            account.bankAccountNumber,
                          )
                        }
                        helperText={
                          !isOnlyNumbers.test(
                            account.bankAccountNumber,
                          ) ||
                          (account.bankAccountNumber.length > 1 &&
                            account.bankAccountNumber.length < 5)
                            ? 'A valid number is required'
                            : ''
                        }
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
                    <div className="bank-info-input-wrapper right-side">
                      <PayroInput
                        label=""
                        placeholder="Retype Account Number"
                        value={account.bankAccountNumberConfirm}
                        onChange={(e) => {
                          const newList: any = replaceItemAtIndex(
                            chaseBankAccountsArray,
                            index,
                            {
                              ...account,
                              bankAccountNumberConfirm: e,
                            },
                          );

                          setChaseBankAccountsArray(newList);
                        }}
                        onBlurFunction={(e: any) =>
                          e.stopPropagation()
                        }
                        error={
                          account.bankAccountNumber !=
                          account.bankAccountNumberConfirm
                        }
                        helperText={
                          account.bankAccountNumber !=
                          account.bankAccountNumberConfirm
                            ? 'Numbers must match'
                            : ''
                        }
                        onCopy={(e: any) => {
                          e.preventDefault();
                          return false;
                        }}
                        onPaste={(e: any) => {
                          e.preventDefault();
                          return false;
                        }}
                      />
                    </div>{' '}
                  </div>
                </>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default ManualBankForm;
