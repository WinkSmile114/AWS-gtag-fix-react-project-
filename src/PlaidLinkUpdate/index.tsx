import React, { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { getClient } from '../api-utils/general-utils';
import './index.css';
import PayroButton from '../widgets/PayroButton';
import Loader from '../widgets/Loader';
import { BankAccount } from '../api-utils/generated-client';
import {
  bankAccountsState,
  dealDraftState,
} from '../recoil-state/request-funding-states';

import { useRecoilState, useRecoilValue } from 'recoil';
import {
  isPlaidConnectedState,
  mainSectionState,
} from '../recoil-state/general-states';
import connectIcon from '../common-icons/connect-icon.png';

interface PlaidProps {
  setRepaymentRecord?: Function;
  finicityChooseBank?: Function;
  successCb?: Function;
  bankAccounts?: BankAccount[];
  stage?: string;
}

const PlaidConnector = (props: PlaidProps) => {
  const [bankAccounts, setBankAccounts] =
    useRecoilState(bankAccountsState);
  const [plaidbankAccounts, setPlaidBankAccounts] =
    useRecoilState(bankAccountsState);
  const mainSection = useRecoilValue(mainSectionState);

  const [isPlaidConnected, setIsPlaidConnected] = useRecoilState(
    isPlaidConnectedState,
  );
  const [linkToken, setLinkToken] = useState<string>();
  const [showLoader, setShowLoader] = useState(false);
  const [dealRecord, setDealRecord] = useRecoilState(dealDraftState);
  const [selectedBank, setDefualtSelectedBank] = useState<any>();
  const [selectedBankBalance, setSelectedBankBalance] =
    useState<any>();
  const [balancesListState, setBalancesList] = useState<any>();
  const onSuccess = React.useCallback((public_token: string) => {
    const setToken = async () => {
      const client = await getClient();
      if (!client) return;
      setShowLoader(true);
      await client.plaidControllerSetAccessToken({
        access_token: public_token,
      });
      const banksIncludingPlaid =
        await client.bankAccountsControllerFindAll();
      setBankAccounts(banksIncludingPlaid.data);
      setIsPlaidConnected('yes');
      setShowLoader(false);
    };
    setToken();
  }, []);

  const config: Parameters<typeof usePlaidLink>[0] = {
    token: linkToken!,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    const getToken = async () => {
      const client = await getClient();

      if (!client) {
        return;
      }

      const linkResponse: any =
        await client.plaidControllerCreateLinkTokenForPlaidLinkUpdate();

      setLinkToken(linkResponse.data.link_token);

      return linkResponse.data.link_token;
    };

    getToken().then((token) => {
      if (ready) open();
    });
  }, []);
  useEffect(() => {
    open();
  }, [open, ready, linkToken]);

  return (
    <>
      <div></div>
    </>
  );
};

PlaidConnector.displayName = 'Payro Plaid';
const getLastFourCharacters = (s: string | undefined) => {
  if (!s) {
    return '';
  }

  if (s.length <= 4) {
    return s;
  }

  return s.substr(s.length - 4, 4);
};

export default PlaidConnector;
