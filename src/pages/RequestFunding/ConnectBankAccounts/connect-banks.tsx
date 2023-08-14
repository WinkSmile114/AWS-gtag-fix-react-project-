/**
 *
 * Account we can probably forget about, since that's not relevant for the first one
 *
 * Get a list of the existing bank accounts
 */

import BankFetcher from '../DataFetchers/bank-fetcher';
import { useContext } from 'react';
import { useEffect, useState } from 'react';
import { getClient } from '../../../api-utils/general-utils';
import {
  BankAccount,
  CreateBankAccountDto,
  UpdateAccountDto,
  UpdateBankAccountDto,
} from '../../../api-utils/generated-client';
import { MessageContext } from '../../../context';
import FooterButtons from '../../../Footer/footer-buttons';
import TitleSection from '../../../Header/title-section';
import PayroInput from '../../../widgets/PayroInput';
import './index.scss';
import { v4 as uuidv4 } from 'uuid';
import Loader from '../../../widgets/Loader';
import PayroRadioButtonGroup from '../../../widgets/PayroRadioButtonGroup';
import bankInfo from '../../../common-components/bank-account/bank-info';
import repayment from '../../Ledger/LedgerHome/Repayments/repayment';
import RequestFundingTitle from '../request-funding-title';
import { isFeatureOn } from '../../../utils';
import {
  useRecoilValue,
  useSetRecoilState,
  useRecoilState,
  useResetRecoilState,
} from 'recoil';
import {
  FundingStepStateType,
  depositBankRoutingNumberConfirmState,
  depositBankAccountNumberConfirmState,
  withdrawalBankRoutingNumberConfirmState,
  withdrawalBankAccountNumberConfirmState,
  fundingStepState,
  bankAccountsState,
  dealDraftState,
  isAllBankInfoValidState,
  needsManualFormState,
  bankAccountToUpdateState,
  chaseBankAccountsArrayState,
} from '../../../recoil-state/request-funding-states';
import { persistAllBankInfo } from './utils';
import BankMeta from '../../../common-components/bank-account/bank-info';
import '../../../common-components/bank-account/index.scss';
import bankFetcher from '../DataFetchers/bank-fetcher';
import { stringHasValue } from '../../../utils';
import PlaidConnector from '../../../widgets/PlaidConnector';
import BankAccountForm from './bank-account-form';
import { isPlaidConnectedState } from '../../../recoil-state/general-states';
import CompanyInfo from '../../Application/CompanyInfo';

import ManageBankAccounts from '../../Dashboard/RequestMoreCredit/ManageBankAccountsModal';
import ManualBankForm from '../../../widgets/PlaidConnector/ManualBankForm';
import { isNextButtonDisabledState } from '../../../recoil-state/application-stage-states';

/*
This component updates it's state on every change,
 but the actual bank info is not saved to the server until the user navigates
 either next or back.

*/

type SameOrDifferentAccount =
  | 'same-account'
  | 'different-account'
  | '';

export default () => {
  const setisValid = useSetRecoilState(isAllBankInfoValidState);
  const [needsManualForm, setNeedsManualForm] = useRecoilState(
    needsManualFormState,
  );
  const finicityFeatureOn: boolean = isFeatureOn('Finicity');

  const [loadingFinicity, setLoadingFinicity] = useState(false);
  const [isFinicityConnected, setIsFinicityConnected] =
    useState(false);
  const [isPlaidConnected, setIsPlaidConnected] = useRecoilState(
    isPlaidConnectedState,
  );
  const [isNextDisabled, setIsNextDisabled] = useRecoilState(
    isNextButtonDisabledState,
  );

  const [bankAccountToUpdate, setBankAccountToUpdate] =
    useRecoilState<UpdateBankAccountDto>(bankAccountToUpdateState);
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
  const [dealRecord, setDealRecord] = useRecoilState(dealDraftState);
  const [chaseBankAccountsArray, setChaseBankAccountsArray] =
    useRecoilState(chaseBankAccountsArrayState);

  const messageContext = useContext(MessageContext);

  const [
    useSameAccountForWithdrawal,
    setUseSameAccountForWithdrawal,
  ] = useState<SameOrDifferentAccount>('');

  useEffect(() => {
    const initializeBankAccounts = async () => {
      if (bankAccounts && bankAccounts.length > 0) {
        return;
      }
      const client = await getClient();
      if (client) {
        const bankAccountsRes =
          await client.bankAccountsControllerFindAll();
        if (bankAccountsRes.data.length < 1) {
          const newUuid = uuidv4();
          setBankAccounts([{ uuid: newUuid }]);
          setDealRecord({
            ...dealRecord,
            deposit_bank_account: newUuid,
          });
        } else {
          setBankAccounts(bankAccountsRes.data as BankAccount[]);
          if (dealRecord.deposit_bank_account) {
            const depositAccount = bankAccountsRes.data.find(
              (ba) => ba.uuid === dealRecord.deposit_bank_account,
            );
            setDepositRoutingNumberConfirm(
              depositAccount?.bank_routing_number ?? '',
            );
            setDepositAccountNumberConfirm(
              depositAccount?.bank_account_number ?? '',
            );
          }
          if (
            dealRecord.withdrawal_bank_account &&
            dealRecord.withdrawal_bank_account !==
              dealRecord.deposit_bank_account
          ) {
            const withdrawalAccount = bankAccountsRes.data.find(
              (ba) => ba.uuid === dealRecord.withdrawal_bank_account,
            );
            setWithdrawalRoutingNumberConfirm(
              withdrawalAccount?.bank_routing_number ?? '',
            );
            setWithdrawalAccountNumberConfirm(
              withdrawalAccount?.bank_account_number ?? '',
            );
          }
        }
      }
    };
    const checkForSameOrDifferentWithdrawal = () => {
      if (
        dealRecord.deposit_bank_account &&
        dealRecord.withdrawal_bank_account
      ) {
        if (
          dealRecord.deposit_bank_account !==
          dealRecord.withdrawal_bank_account
        ) {
          setUseSameAccountForWithdrawal('different-account');
        } else {
          setUseSameAccountForWithdrawal('same-account');
        }
      } else {
        setUseSameAccountForWithdrawal('');
      }
    };

    initializeBankAccounts().then(() => {
      checkForSameOrDifferentWithdrawal();
    });
  }, []);

  const setArray = async () => {
    console.log(chaseBankAccountsArray);
    let mainArray: any = [];
    const chaseAccounts = bankAccounts
      .filter((account) => account.plaid_id)
      .filter((name) => name.bank_name?.toLowerCase() == 'chase');
    chaseAccounts.forEach(
      (account, index) =>
        (mainArray = [
          ...mainArray,
          {
            uuid: account.uuid,
            bankRoutingNumber:
              account.is_real_bank_numbers == true
                ? account.bank_routing_number?.toString()
                : '',
            bankRoutingNumberConfirm:
              account.is_real_bank_numbers == true
                ? account.bank_routing_number?.toString()
                : '',
            bankAccountNumber:
              account.is_real_bank_numbers == true
                ? account.bank_account_number?.toString()
                : '',
            bankAccountNumberConfirm:
              account.is_real_bank_numbers == true
                ? account.bank_account_number?.toString()
                : '',
          },
        ]),
    );
    await setChaseBankAccountsArray(mainArray);
    // console.log(chaseBankAccountsArray);
  };

  const chaseCheckerFillerFunc = async () => {
    console.log('from the checker func');
    const depositBank = bankAccounts.find(
      (bank) => bank.uuid === dealRecord.deposit_bank_account,
    );
    if (depositBank) {
      await setBankAccountToUpdate({
        ...bankAccountToUpdate,
        uuid: depositBank.uuid,
        bank_name: depositBank.bank_name,
        bank_account_type: depositBank.bank_account_type,
        account_last_four: depositBank.account_last_four,
        is_real_bank_numbers: depositBank.is_real_bank_numbers,
      });
    }
    if (
      depositBank &&
      depositBank.bank_name?.toLowerCase() == 'chase'
    ) {
      await setNeedsManualForm(true);
    }
    if (
      bankAccounts.length > 0 &&
      bankAccounts
        .filter((b) => b.plaid_id)
        .filter((n) => n.bank_name?.toLowerCase() == 'chase') &&
      needsManualForm
    ) {
      console.log('here');
      await setArray();
    }
  };

  useEffect(() => {
    const isAllBankInfoFilled = async () => {
      console.log('in the use effect of connect banks', {
        depositAccountNumberConfirm,
        depositRoutingNumberConfirm,
        withdrawalAccountNumberConfirm,
        withdrawalRoutingNumberConfirm,
        dealRecord,
      });

      if (
        isPlaidConnected === 'yes' &&
        dealRecord.deposit_bank_account &&
        dealRecord.withdrawal_bank_account
      ) {
        setisValid(true);
        chaseCheckerFillerFunc();
            return true;
      }

      const depositBank = bankAccounts.find(
        (bank) => bank.uuid === dealRecord.deposit_bank_account,
      );
      const withdrawalBank = bankAccounts.find(
        (bank) => bank.uuid === dealRecord.withdrawal_bank_account,
      );

      let allStringsThatShouldHaveValue = [
        depositBank?.bank_name,
        withdrawalBank?.bank_name,
        depositBank?.bank_account_number,
        depositRoutingNumberConfirm,
        depositAccountNumberConfirm,
      ];

      if (useSameAccountForWithdrawal === 'different-account') {
        allStringsThatShouldHaveValue = [
          ...allStringsThatShouldHaveValue,
          withdrawalBank?.bank_account_number,
          withdrawalRoutingNumberConfirm,
          withdrawalAccountNumberConfirm,
        ];
      }

      if (
        depositBank &&
        withdrawalBank &&
        allStringsThatShouldHaveValue.every(stringHasValue) &&
        depositBank.bank_account_number ==
          depositAccountNumberConfirm &&
        depositBank.bank_routing_number ==
          depositRoutingNumberConfirm &&
        depositBank.bank_routing_number.length == 9
      ) {
        if (useSameAccountForWithdrawal === 'same-account') {
          setisValid(true);
          return true;
        } else {
          if (
            withdrawalBank.bank_account_number ==
              withdrawalAccountNumberConfirm &&
            withdrawalBank.bank_routing_number ==
              withdrawalRoutingNumberConfirm &&
            withdrawalBank.bank_routing_number.length == 9
          ) {
            setisValid(true);

            return true;
          } else {
            setisValid(false);
            return false;
          }
        }
      }
      setisValid(false);
      return false;
    };

    console.log('isAllBankInfoFilled()', isAllBankInfoFilled());
    // props.setFilledOutAllBankInfo(isAllBankInfoFilled())
  }, [
    useSameAccountForWithdrawal,
    bankAccounts,
    depositRoutingNumberConfirm,
    depositAccountNumberConfirm,
    withdrawalRoutingNumberConfirm,
    withdrawalAccountNumberConfirm,
    dealRecord,
    isPlaidConnected,
  ]);
  // useEffect(() => {
  //   const needsManualForm = () => {
  //     const depositBank = bankAccounts.find(
  //       (bank) => bank.uuid === dealRecord.deposit_bank_account,
  //     );
  //     if (
  //       isAllBankInfoValidState &&
  //       depositBank &&
  //       depositBank.bank_name != 'TD Bank'
  //     ) {
  //       setNeedsManualForm(true);
  //       return true;
  //     }
  //     return false;
  //   };
  //   console.log('hihere', needsManualForm());
  // }, []);

  if (!bankAccounts || bankAccounts.length == 0) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  // if (!dealRecord.deposit_bank_account) {
  //     return <Loader />
  // }

  /*
    const finicityConnectCallback = async (connectedAccounts: any[]) => {
        setIsFinicityConnected(connectedAccounts.length > 0)
        const client = await getClient()
    
        if (client) {
            const bankRes = await client.bankAccountsControllerFindAll()
            setBankAccounts(bankRes.data)
            setisValid(true)
            console.log('bankRes', bankRes)
            const finicityBanks = bankRes.data.filter(b => b.finicity_id)
            if (finicityBanks.length == 1) {
                await saveDepositBank(finicityBanks[0])
                await saveWithdrawalBank(finicityBanks[0])
                setUseSameAccountForWithdrawal('same-account')
                updateDepositBankAccountNumberConfirm(finicityBanks[0].bank_account_number!)
                updateDepositBankRoutingNumberConfirm(finicityBanks[0].bank_routing_number!)
                console.log('finished my finicity callback')
            }
        }
        setLoadingFinicity(false)
    }
    
    const finicityChooseBank = async (bankAccount: BankAccount) => {
        const client = await getClient()
    
        if (client) {
            const bankRes = await client.bankAccountsControllerFindAll()
            console.log('bankRes', bankRes)
            const finicityBanks = bankRes.data.filter(b => b.finicity_id)
            if (finicityBanks.length > 0) {
                await saveDepositBank(bankAccount)
                await saveWithdrawalBank(bankAccount)
                setUseSameAccountForWithdrawal('same-account')
                updateDepositBankAccountNumberConfirm(bankAccount.bank_account_number!)
                updateDepositBankRoutingNumberConfirm(bankAccount.bank_routing_number!)
                console.log('finished my finicity callback')
    
            }
        }
        setLoadingFinicity(false)
    }
    */
  const plaidAccounts = bankAccounts.filter(
    (account) => account.plaid_id,
  );
  return (
    <div>
      <RequestFundingTitle
        section={'onboarding'}
        title="Bank Information"
        subtitle="Provide the bank info for where we should send the money to and where we can withdraw from"
        sectionNumber={3}
      />

      {process.env.REACT_APP_SHOW_PLAID == 'yes' && (
        <PlaidConnector />
      )}

      {finicityFeatureOn && (
        <div>
          {/* <FinicityConnect
                        finicityChooseBank={finicityChooseBank}
                        bankAccounts={bankAccounts}
                        successCb={async (connectedAccounts: any[]) => await finicityConnectCallback(connectedAccounts)} /> */}
        </div>
      )}
      {/* {(isPlaidConnected === 'no') &&
                <div>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <BankAccountForm key={bankAccounts[0].uuid} bankAccountIndexToUpdate={0} />
                        <div id="same-account-choice-spacer"></div>

                        <PayroRadioButtonGroup
                            options={[{ label: "Same Account", value: 'same-account' }, { label: "Different Account", value: 'different-account' }]}
                            onValueChange={(e) => {
                                setUseSameAccountForWithdrawal(e.target.value)
                                if (e.target.value == 'same-account') {
                                    setDealRecord({ ...dealRecord, withdrawal_bank_account: dealRecord.deposit_bank_account! })
                                    setBankAccounts([bankAccounts[0]])
                                } else {
                                    const newWithdrawalUuid = uuidv4()
                                    setBankAccounts([...bankAccounts, { uuid: newWithdrawalUuid }])
                                    setDealRecord({
                                        ...dealRecord, withdrawal_bank_account: newWithdrawalUuid,
                                    })
                                }
                            }
                            }
                            groupLabel="Which account would you like to use for repayment?"
                            groupName="repayment-account"
                            checkedValue={useSameAccountForWithdrawal}
                        />

                        {useSameAccountForWithdrawal == 'different-account' &&

                            <BankAccountForm key={bankAccounts[1]?.uuid} bankAccountIndexToUpdate={1} />

                        }
                    </form>
                </div>


            } */}

      <FooterButtons nextDisabled={false} />
    </div>
  );
};
