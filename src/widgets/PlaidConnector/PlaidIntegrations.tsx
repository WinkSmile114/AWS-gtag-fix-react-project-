import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { getClient } from '../../api-utils/general-utils';
import { BankAccount } from '../../api-utils/generated-client';
import {
  bankAccountsState,
  depositBankState,
  withdrawalBankState,
} from '../../recoil-state/request-funding-states';
import bankIcon from '../../common-icons/helpful-tool-bank-icon.svg';
import Loader from '../Loader';
const PlaidIntegrations = () => {
  const [bankAccounts, setBankAccounts] =
    useRecoilState(bankAccountsState);
  const [depositBank, setDepositBankState] =
    useRecoilState(depositBankState);
  const [withdrawalBank, setWithdrawalBankState] = useRecoilState(
    withdrawalBankState,
  );
  const [backButtonText, setBackButtonText] =
    useState<string>('Cancel');
  const [linkToken, setLinkToken] = useState<string>();
  useEffect(() => {
    const getToken = async () => {
      const client = await getClient();

      if (!client) {
        return;
      }
      const banksIncludingPlaid =
        await client.bankAccountsControllerFindAll();
      setBankAccounts(banksIncludingPlaid.data);

      const linkResponse: any =
        await client.plaidControllerCreateLinkToken();
      setLinkToken(linkResponse.data.link_token);

      return linkResponse.data.link_token;
    };
    getToken();
  }, []);

  const plaidAccounts = bankAccounts.filter(
    (account) => account.plaid_id,
  );
  const connectedAccountsUi = plaidAccounts.map(
    (account: BankAccount, index) => {
      let bankOnClickFunction = async (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        if (account) {
          const client = await getClient();
          setDepositBankState(account.uuid);
          if (client) {
            await client.bankAccountsControllerSelectForDeposit(
              false,
              { uuid: account.uuid },
            );
          }
          setTimeout(() => 10000);
        }
      };

      if (!bankAccounts) {
        return <Loader />;
      }

      return (
        <>
          <div
            onClick={bankOnClickFunction}
            className={`connected-account-container-integrations ${
              plaidAccounts.length === 1 ||
              account?.uuid === depositBank
                ? 'selected'
                : ''
            }`}
            key={account?.uuid}
          >
            <div id="finicity-details-wrapper">
              <div>
                <img
                  className="bank-logo-style"
                  src={
                    account.logo
                      ? `data:image/png;base64,${account.logo}`
                      : bankIcon
                  }
                />
              </div>
              <div className="full-wrapper-bank-name">
                <div className="bank-name-number-wrapper">
                  <p className="finicity-bank-name">
                    {account?.bank_name}
                  </p>
                  <p className="finicity-account-4dots">....</p>
                  <p className="finicity-account-last4">
                    {account.account_last_four}
                  </p>
                </div>
                <p className="bank-account-type-style">
                  {account.bank_account_type}
                </p>
              </div>
            </div>
          </div>
        </>
      );
    },
  );

  const connectedAccountsUiWithdrawal = plaidAccounts.map(
    (account: BankAccount, index) => {
      let bankOnClickFunction = async (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        if (account) {
          const client = await getClient();
          setWithdrawalBankState(account.uuid);
          if (client) {
            await client.bankAccountsControllerSelectForWithdrawal(
              false,
              {
                uuid: account.uuid,
              },
            );
            setTimeout(() => 10000);
          }
        }
      };

      return (
        <>
          <div
            onClick={bankOnClickFunction}
            className={`connected-account-container-integrations ${
              plaidAccounts.length === 1 ||
              account?.uuid === withdrawalBank
                ? 'selected'
                : ''
            }`}
            key={account?.uuid}
          >
            <div id="finicity-details-wrapper">
              <div>
                <img
                  className="bank-logo-style"
                  src={
                    account.logo
                      ? `data:image/png;base64,${account.logo}`
                      : bankIcon
                  }
                />
              </div>
              <div className="full-wrapper-bank-name">
                <div className="bank-name-number-wrapper">
                  <p className="finicity-bank-name">
                    {account?.bank_name}
                  </p>
                  <p className="finicity-account-4dots">....</p>
                  <p className="finicity-account-last4">
                    {account.account_last_four}
                  </p>
                </div>
                <p className="bank-account-type-style">
                  {account.bank_account_type}
                </p>
              </div>
            </div>
          </div>
        </>
      );
    },
  );

  return (
    <>
      <div className="integrations-bank-wrapper">
        <p className="select-bank-type-header-style">
          Select your default deposit bank:
        </p>
        {connectedAccountsUi}
      </div>
      <div className="integrations-bank-wrapper">
        <p className="select-bank-type-header-style">
          Select your default withdrawal bank:
        </p>
        {connectedAccountsUiWithdrawal}
      </div>
    </>
  );
};

export default PlaidIntegrations;
