import React, {
  useEffect,
  useContext,
  useState,
  useCallback,
} from 'react';
import { PlaidLinkStableEvent, usePlaidLink } from 'react-plaid-link';
import { getClient } from '../../api-utils/general-utils';
import { MessageContext } from '../../context';
import './index.css';
import PayroButton from '../PayroButton';
import Loader from '../Loader';
import {
  BankAccount,
  UpdateBankAccountDto,
} from '../../api-utils/generated-client';
import repayment from '../../pages/Ledger/LedgerHome/Repayments/repayment';
import {
  bankAccountsState,
  bankAccountToUpdateState,
  chaseBankAccountsArrayState,
  dealDraftState,
  depositBankRoutingNumberConfirmState,
  needsManualFormState,
} from '../../recoil-state/request-funding-states';
import PayroSelect from '../../widgets/PayroSelectv2';
import {
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import {
  isPlaidConnectedState,
  mainSectionState,
} from '../../recoil-state/general-states';
import connectIcon from '../../common-icons/connect-icon.png';
import rightArrow from '../FinchConnector/right-arrow.png';
import checkCircle from '../FinchConnector/check-circle.png';
import plaidLogo from '../PlaidConnector/plaid-logo.svg';
import infoIcon from '../../common-icons/info-icon-fixed-rate.svg';
import schedulePayment from '../../common-icons/schedule-payment.png';
import { Calendar } from 'plaid-threads';
import { formatNumberAsDollars } from '../../utils';
import bankIconGeneric from '../../common-icons/helpful-tool-bank-icon.svg';
import PlaidNotConnected from '../PlaidConnector/PlaidNotConnected';
import PlaidIntegrations from './PlaidIntegrations';

interface PlaidProps {
  setRepaymentRecord?: Function;
  finicityChooseBank?: Function;
  successCb?: Function;
  bankAccounts?: BankAccount[];
  stage?: string;
  justShowConnected?: boolean;
}

const PlaidConnector = (props: PlaidProps) => {
  const [bankAccounts, setBankAccounts] =
    useRecoilState(bankAccountsState);
  const [plaidbankAccounts, setPlaidBankAccounts] =
    useRecoilState(bankAccountsState);
  const mainSection = useRecoilValue(mainSectionState);
  const setNeedsManualForm = useSetRecoilState(needsManualFormState);
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
  const [bankIcon, setBankIcon] = useState<any>(bankIconGeneric);

  const [bankAccountToUpdate, setBankAccountToUpdate] =
    useRecoilState<UpdateBankAccountDto>(bankAccountToUpdateState);
  let [chaseBankAccountsArray, setChaseBankAccountsArray] =
    useRecoilState(chaseBankAccountsArrayState);

  const setArray = async () => {
    let mainArray: any = [];
    const chaseAccounts = bankAccounts
      .filter((account) => account.plaid_id)
      .filter((name) => name.bank_name?.toLowerCase() == 'chase');
    chaseAccounts.forEach(
      (account, index) =>
        (mainArray = [
          ...mainArray,
          {
            key: Math.random(),
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
  };
  const onSuccess = React.useCallback((public_token: string) => {
    // send public_token to server
    const setToken = async () => {
      const client = await getClient();
      if (!client) return;
      setShowLoader(true);

      const response = await client.plaidControllerSetAccessToken({
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

  let isOauth = false;
  const config: Parameters<typeof usePlaidLink>[0] = {
    token: linkToken!,
    onSuccess,
  };

  if (window.location.href.includes('?oauth_state_id=')) {
    // TODO: figure out how to delete this ts-ignore
    // @ts-ignore
    config.receivedRedirectUri = window.location.href;
    isOauth = true;
  }

  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    if (isOauth && ready) {
      open();
    }
  }, [ready, open, isOauth]);

  useEffect(() => {
    const checkConnectedStatus = async () => {
      const client = await getClient();
      if (!client) {
        return;
      }
      if (isPlaidConnected === 'unknown') {
        const connectedStatusRes =
          await client.plaidControllerCheckIfConnected();
        if (connectedStatusRes.data) {
          setIsPlaidConnected('yes');
        } else {
          setIsPlaidConnected('no');
        }
      }
      if (isPlaidConnected === 'yes') {
        if (props.justShowConnected === true) {
          return;
        }
        const plaidAccounts = bankAccounts.filter(
          (ba) => ba.plaid_id,
        );

        if (props.stage !== 'repeat-funding') {
          if (
            plaidAccounts.length > 0 &&
            plaidAccounts.find(
              (b) => b.bank_name?.toLowerCase() == 'chase',
            ) &&
            chaseBankAccountsArray[0].uuid == undefined
          ) {
            await setArray();
          }

          if (dealRecord && plaidAccounts.length === 1) {
            await setDealRecord({
              ...dealRecord,
              deposit_bank_account: plaidAccounts[0].uuid,
              withdrawal_bank_account: plaidAccounts[0].uuid,
            });

            await client.bankAccountsControllerSelectForDeposit(
              true,
              {
                uuid: plaidAccounts[0].uuid,
              },
            );
            await client
              .bankAccountsControllerSelectForWithdrawal(true, {
                uuid: plaidAccounts[0].uuid,
              })
              .then(() => {});
          }
        }
      }
    };
    checkConnectedStatus().then(() => {});
  }, [isPlaidConnected, bankAccounts]);

  const setBalance = async (selectedBank: any) => {
    if (balancesListState == undefined) {
      const client = await getClient();
      if (!client) {
        return;
      }

      const itemAndBalanaces = await Promise.all([
        client.plaidControllerGetItem(),
        client.plaidControllerGetBalance(),
      ]);

      const balances = itemAndBalanaces[1];

      const balancesData = balances.data as any;
      const balanceslist = balancesData.accounts;

      if (balanceslist && balanceslist.length > 0) {
        const account = balanceslist.find(
          (p: any) => p.account_id == selectedBank.plaid_id,
        );

        setSelectedBankBalance(account && account.balances.available);
      }
      await setBalancesList(balanceslist);
    } else {
      const account = balancesListState.find(
        (p: any) => p.account_id == selectedBank.plaid_id,
      );
      setSelectedBankBalance(account.balances.available);
      // setBankIcon={`data:image/png;base64,${selectedBank.logo}`}
    }
  };

  // const getLogoPngFromBase64 = (logoString: string) => {
  //   const baseString = `data:image/png;base64,${logoString}`;
  //   setBankIcon(baseString);
  // };
  useEffect(() => {
    const getToken = async () => {
      const client = await getClient();

      if (!client) {
        return;
      }

      if (
        props.stage == 'repeat-funding' ||
        (isPlaidConnected == 'yes' && props.stage == 'integrations')
      ) {
        const banksIncludingPlaid =
          await client.bankAccountsControllerFindAll();
        setBankAccounts(banksIncludingPlaid.data);
        await setDefualtSelectedBank(
          banksIncludingPlaid.data.filter(
            (account) => account.plaid_id,
          )[0],
        );
        setBalance(
          banksIncludingPlaid.data.filter(
            (account) => account.plaid_id,
          )[0],
        );
      }

      const linkResponse: any =
        await client.plaidControllerCreateLinkToken();
      setLinkToken(linkResponse.data.link_token);

      return linkResponse.data.link_token;
    };
    getToken();
  }, []);

  const wrapperClassName = isPlaidConnected
    ? 'finicity-wrapper'
    : 'purple-background-color finicity-wrapper';

  const plaidAccounts = bankAccounts.filter(
    (account) => account.plaid_id,
  );

  const connectedAccountsUi = plaidAccounts.map(
    (account: BankAccount, index) => {
      let bankOnClickFunction = async (e: any) => {
        e.preventDefault();
        e.stopPropagation();

        if (account.bank_name?.toLowerCase() == 'chase') {
          setBankAccountToUpdate({
            ...bankAccountToUpdate,
            uuid: account.uuid,
            bank_name: account.bank_name,
            bank_account_type: account.bank_account_type,
            account_last_four: account.account_last_four,
          });
          console.log(account);
          await setNeedsManualForm(true);
        } else {
          await setNeedsManualForm(false);
        }

        if (account && dealRecord) {
          const client = await getClient();
          if (client) {
            setDealRecord({
              ...dealRecord,
              deposit_bank_account: account.uuid,
              withdrawal_bank_account: account.uuid,
            });

            await client.bankAccountsControllerSelectForDeposit(
              true,
              { uuid: account.uuid },
            );
            setTimeout(() => 0, 10000);
            await client.bankAccountsControllerSelectForWithdrawal(
              true,
              {
                uuid: account.uuid,
              },
            );
          }
        }

        // only if there's a repayment
        // get bank accounts
        // set select withdrawal and depoist on account
        // set withdrawal and deposit on repayment
      };

      return (
        <div
          onClick={bankOnClickFunction}
          className={`connected-account-container ${
            plaidAccounts.length === 1 ||
            account?.uuid === dealRecord.deposit_bank_account
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
                  {/* {account.bank_account_number?.slice(
                    account.bank_account_number.length - 4,
                  )} */}
                </p>
              </div>
              <p className="bank-account-type-style">
                {account.bank_account_type}
              </p>
            </div>
          </div>
        </div>
      );
    },
  );

  if (isPlaidConnected === 'unknown') {
    return (
      <Loader
        message={
          props.stage != 'repeat-funding'
            ? 'Checking connected status'
            : ''
        }
      />
    );
  }

  if (showLoader) {
    return <Loader />;
  }

  console.log('isPlaidConnected', isPlaidConnected);

  return (
    <>
      <div>
        {isPlaidConnected === 'no' && (
          <PlaidNotConnected stage={props.stage} />
        )}
        {isPlaidConnected === 'yes' &&
          (mainSection === 'Application' ||
            props.justShowConnected === true) && (
            <div className="plaid-wrapper">
              {/* <img
              className="plaid-logo"
              src={plaidLogo}
              alt="HTML5 Icon"
              width="30"
              height="34"
            ></img>
            <img
              className="finch-right-arrow"
              src={rightArrow}
              alt="HTML5 Icon"
            ></img> */}
              {!linkToken ? (
                <img
                  className="plaid-check-circle"
                  src={infoIcon}
                  alt="HTML5 Icon"
                ></img>
              ) : (
                <img
                  className="plaid-check-circle"
                  src={checkCircle}
                  alt="HTML5 Icon"
                ></img>
              )}
              <span className="plaid-connected-words">
                {!linkToken ? 'Getting link token' : 'Connected'}
              </span>
            </div>
          )}
        {isPlaidConnected === 'yes' &&
          props.stage == 'integrations' && <PlaidIntegrations />}
        {isPlaidConnected === 'yes' &&
          props.stage == 'repeat-funding' && (
            <div className="plaid-repeat-funding">
              <p className="connected-bank-name bank-balance-title">
                {selectedBankBalance == null
                  ? 'Connected Bank:'
                  : 'Bank Balance:'}
              </p>
              <p className="bank-balance">
                {formatNumberAsDollars(selectedBankBalance)}
              </p>

              <PayroSelect
                leftSideIcon={bankIcon}
                wrapperAdditionalClasses="dashboard"
                options={plaidAccounts.map((b) => {
                  return {
                    label: `${b.bank_name ? b.bank_name : ''} ${
                      b.account_last_four ? b.account_last_four : ''
                    }`,
                    value: b.uuid,
                  };
                })}
                onSelect={async (uuid: string) => {
                  const bankAccountWithThisUuid = bankAccounts.find(
                    (b) => b.uuid === uuid,
                  );
                  await setDefualtSelectedBank(
                    bankAccountWithThisUuid,
                  );
                  setBalance(bankAccountWithThisUuid);
                }}
                selectName="deposit-bank"
                placeholderText="Bank Balance"
                defaultSelectedValue={selectedBank?.uuid}
              />
            </div>
          )}

        {isPlaidConnected === 'yes' &&
          !props.justShowConnected &&
          mainSection !== 'Application' &&
          props.stage != 'integrations' &&
          props.stage != 'repeat-funding' && (
            <div id="finicity-connected-wrapper">
              {/* {plaidAccounts.length > 1 &&
              bankAccounts.find((b) => b.bank_name == 'TD Bank') ? (
                <PlaidUIChase />
              ) : ( */}
              <div>
                {' '}
                <h4 className="finicity-connected-message">
                  {plaidAccounts.length > 1 && bankAccounts
                    ? 'Please select one of the following:'
                    : 'Connected'}
                </h4>
                {connectedAccountsUi}
              </div>
              {/* )} */}
            </div>
          )}
      </div>
      <div id="connect-container"></div>
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

/*

dealing with
- bank accounts
- deal (setting bank account uuid)
- account(setting defaults) and also an
- object of withdrawal/ deposit bank
  * this seems unnecessary.
  * it was only really for historical purposes made like that.  We should really just be editing the bank account.
  *
Persisting bank accounts
- {
  repayment: {

  },
  bankAccounts: [

  ],
  depositBankOnAccount: {
    id,
    idtype
  }
  withdrawalBankOnAccount: {
    id,
    idtype
  }
}

NOTHING IN SALESFORCE UNTIL DEAL IS ACTIVATED
- what if user wants to change bank account by calling customer service?
- they can, but then it will be changed in Salesforce
   * this means that the repeat funding will have to pull bank accounts from Salesforce
*/
