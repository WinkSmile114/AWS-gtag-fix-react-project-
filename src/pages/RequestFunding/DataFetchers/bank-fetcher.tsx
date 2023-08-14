import { useContext } from 'react';
import { useEffect, useState } from 'react';
import { getClient } from '../../../api-utils/general-utils';
import { BankAccount } from '../../../api-utils/generated-client';
import { MessageContext } from '../../../context';
import { isFeatureOn } from '../../../utils';

import {
  useRecoilValue,
  useSetRecoilState,
  useRecoilState,
  useResetRecoilState,
} from 'recoil';
import {
  depositBankRoutingNumberConfirmState,
  depositBankAccountNumberConfirmState,
  withdrawalBankRoutingNumberConfirmState,
  withdrawalBankAccountNumberConfirmState,
  fundingStepState,
  bankAccountsState,
  dealDraftState,
  isAllBankInfoValidState,
} from '../../../recoil-state/request-funding-states';
import BankMeta from '../../../common-components/bank-account/bank-info';
import '../../../common-components/bank-account/index.scss';

/*
This component updates it's state on every change,
 but the actual bank info is not saved to the server until the user navigates
 either next or back.

*/

type SameOrDifferentAccount =
  | 'same-account'
  | 'different-account'
  | '';

export interface BankFetcherProps {
  getFromApiEvenIfEmptyArray: 'yes' | 'no';
}

const BankFetcher = (props: BankFetcherProps) => {
  const [bankAccounts, setBankAccounts] =
    useRecoilState(bankAccountsState);
  const setDepositBankRoutingNumberConfirm = useSetRecoilState(
    depositBankRoutingNumberConfirmState,
  );
  const setDepositBankAccountNumberConfirm = useSetRecoilState(
    depositBankAccountNumberConfirmState,
  );
  const setWithdrawalBankRoutingNumberConfirm = useSetRecoilState(
    withdrawalBankRoutingNumberConfirmState,
  );
  const setWithdrawalBankAccountNumberConfirm = useSetRecoilState(
    withdrawalBankAccountNumberConfirmState,
  );
  const [dealRecord, setDealRecord] = useRecoilState(dealDraftState);

  const messageContext = useContext(MessageContext);

  const [
    useSameAccountForWithdrawal,
    setUseSameAccountForWithdrawal,
  ] = useState<SameOrDifferentAccount>('');

  const bankNames = BankMeta.map((allInfo) => allInfo.name);
  const isNineNumbers = /^[0-9]{9}$/;
  const isValidSceenName = (newScreen: string): boolean => {
    const validScreens = ['repayment-date', 'verify-payroll'];
    return validScreens.includes(newScreen);
  };

  useEffect(() => {
    const initializeData = async () => {
      let allBankAccounts = bankAccounts;
      if (
        props.getFromApiEvenIfEmptyArray == 'yes' ||
        !allBankAccounts
      ) {
        const client = await getClient();
        if (client) {
          const bankAccountsRes =
            await client.bankAccountsControllerFindAll();
          allBankAccounts = bankAccountsRes.data as BankAccount[];
          setBankAccounts(allBankAccounts);
        }
      }
    };
    initializeData().then(() => {});
  }, []);

  return <></>;
};

export default BankFetcher;
