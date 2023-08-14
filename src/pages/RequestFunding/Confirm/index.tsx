import { useContext, useEffect } from 'react';
import { useState } from 'react';
import { getClient } from '../../../api-utils/general-utils';
import {
  BankAccount,
  TransactionAvailability,
  UpdateBankAccountDto,
} from '../../../api-utils/generated-client';
import FooterButtons from '../../../Footer/footer-buttons';
import TitleSection from '../../../Header/title-section';
import Loader from '../../../widgets/Loader';
import './index.scss';
import { formatDate, formatNumberAsDollars } from '../../../utils';
import { DateTime } from 'luxon';
import PayroButton from '../../../widgets/PayroButton';
import RequestFundingTitle from '../request-funding-title';
import { calculateTotalPayback } from '../utils';
import PayroSelect from '../../../widgets/PayroSelectv2';
import {
  useRecoilValue,
  useSetRecoilState,
  useRecoilState,
} from 'recoil';
import BankFetcher from '../DataFetchers/bank-fetcher';

import {
  bankAccountsState,
  dealDraftState,
  sectionState,
  transactionAvailabilityState,
  needsManualFormState,
  showHideClassNameModalManualFormState,
  bankAccountToUpdateState,
  chaseBankAccountsArrayState,
} from '../../../recoil-state/request-funding-states';
import ManualBankModal from '../../../widgets/PlaidConnector/ManualBankModal';
import { MessageContext } from '../../../context';
import OpenModalLink from './OpenManualModalLink';
import { isPlaidConnectedState } from '../../../recoil-state/general-states';
import InfoMessage from '../../../widgets/InfoMessage';

interface myProps {
  confirmButtonClick: Function;
}

interface ConfirmationInfoLine {
  theLabel: string;
  theValue?: any;
}

const ConfirmPage = (props: myProps) => {
  const section = useRecoilValue(sectionState);
  const [dealRecord, setDealRecord] = useRecoilState(dealDraftState);
  const [bankAccounts, setBankAccounts] =
    useRecoilState(bankAccountsState);
  const [signedAch, setSignedAch] = useState(false);
  const [showClickedConfirmLoader, setShowClickConfirmedLoader] =
    useState(false);
  const [transactionAvailability, setTransactionAvailability] =
    useRecoilState<TransactionAvailability>(
      transactionAvailabilityState,
    );
  const [legalCompanyName, setLegalCompanyName] = useState<string>();
  const [needsManualForm, setNeedsManualForm] = useRecoilState(
    needsManualFormState,
  );
  const [
    showHideClassNameModalDisplay,
    setShowHideClassNameModalDisplay,
  ] = useRecoilState(showHideClassNameModalManualFormState);
  const [bankAccountToUpdate, setBankAccountToUpdate] =
    useRecoilState<UpdateBankAccountDto>(bankAccountToUpdateState);

  let [chaseBankAccountsArray, setChaseBankAccountsArray] =
    useRecoilState(chaseBankAccountsArrayState);
  const messageContext = useContext(MessageContext);
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
  useEffect(() => {
    const getTransactionAvailability = async () => {
      if (!transactionAvailability.fundingDate) {
        const client = await getClient();
        if (client) {
          const availability =
            await client.dealsControllerGetTransactionAvailability();
          setTransactionAvailability(availability.data);
        }
      }
    };
    getTransactionAvailability().then(() => {});
  }, []);

  useEffect(() => {
    const getCompanyName = async () => {
      if (!legalCompanyName) {
        const client = await getClient();
        if (client) {
          const account = await client.accountsControllerGetMyInfo();
          setLegalCompanyName(account.data.legal_name);
        }
      }
    };
    getCompanyName();

    {
      bankAccounts.length > 0 && setArray();
    }
  }, [bankAccounts, needsManualForm]);

  if (!transactionAvailability.fundingDate) {
    return <Loader />;
  }

  if (
    !dealRecord.funding_amount ||
    !dealRecord.selected_num_of_weeks_in_portal ||
    !bankAccounts
  ) {
    return (
      <div>
        <Loader message="1 second please" />
        <BankFetcher getFromApiEvenIfEmptyArray="yes" />
      </div>
    );
  }

  const depositBank = bankAccounts.find(
    (ba) => ba.uuid === dealRecord.deposit_bank_account,
  );
  const withdrawalBank = bankAccounts.find(
    (ba) => ba.uuid === dealRecord.withdrawal_bank_account,
  );

  const totalPayback = formatNumberAsDollars(
    calculateTotalPayback(
      dealRecord.funding_amount,
      dealRecord.selected_num_of_weeks_in_portal,
    ),
  );

  const totalInterest =
    dealRecord.funding_amount *
    0.015 *
    dealRecord.selected_num_of_weeks_in_portal;

  const paybackDate = DateTime.fromISO(
    transactionAvailability.fundingDate,
  )
    .plus({ weeks: dealRecord.selected_num_of_weeks_in_portal })
    .toLocaleString();

  const getAccountLastFour = (b: any) => {
    if (
      b.account_last_four != '' ||
      b.account_last_four != undefined ||
      b.account_last_four != null
    ) {
      return b.account_last_four;
    } else {
      getLastFourCharacters(b.bank_account_number);
    }
  };
  const depositBankSelect = (
    <PayroSelect
      wrapperAdditionalClasses="select-content-bank"
      options={bankAccounts.map((b) => {
        return {
          label: `${
            b.bank_name ? b.bank_name : ''
          } ${getAccountLastFour(b)}`,
          value: b.uuid,
        };
      })}
      onSelect={async (uuid: string) => {
        const bankAccountWithThisUuid = bankAccounts.find(
          (b) => b.uuid === uuid,
        );
        const client = await getClient();
        if (!client) {
          return;
        }
        if (!bankAccountWithThisUuid) {
          return;
        }
        await setDealRecord({
          ...dealRecord,
          deposit_bank_account: uuid,
        });
        await client.bankAccountsControllerSelectForDeposit(true, {
          uuid: uuid,
        });
        if (
          bankAccountWithThisUuid.bank_name?.toLowerCase() ==
            'chase' &&
          bankAccountWithThisUuid.is_real_bank_numbers == false
        ) {
          setBankAccountToUpdate({
            ...bankAccountToUpdate,
            uuid: bankAccountWithThisUuid.uuid,
            bank_name: bankAccountWithThisUuid.bank_name,
            bank_account_type:
              bankAccountWithThisUuid.bank_account_type,
            account_last_four:
              bankAccountWithThisUuid.account_last_four,
          });
          if (section == 'more-funding') {
            await setArray();
          }
          setNeedsManualForm(true);
          await setShowHideClassNameModalDisplay(
            'modal display-block',
          );
        } else {
          setNeedsManualForm(false);
          await setShowHideClassNameModalDisplay(
            'modal display-none',
          );
        }
      }}
      selectName="deposit-bank"
      placeholderText="deposit bank number"
      defaultSelectedValue={depositBank?.uuid}
    />
  );
  const withdrawalBankSelect = (
    <PayroSelect
      wrapperAdditionalClasses="select-content-bank"
      options={bankAccounts.map((b) => {
        return {
          label: `${
            b.bank_name ? b.bank_name : ''
          }  ${getAccountLastFour(b)}`,
          value: b.uuid,
        };
      })}
      onSelect={async (uuid: string) => {
        const bankAccountWithThisUuid = bankAccounts.find(
          (b) => b.uuid === uuid,
        );
        const client = await getClient();
        if (!client) {
          return;
        }
        if (!bankAccountWithThisUuid) {
          return;
        }
        await setDealRecord({
          ...dealRecord,
          withdrawal_bank_account: uuid,
        });

        if (
          bankAccountWithThisUuid.bank_name?.toLowerCase() ==
            'chase' &&
          bankAccountWithThisUuid.is_real_bank_numbers == false
        ) {
          setBankAccountToUpdate({
            ...bankAccountToUpdate,
            uuid: bankAccountWithThisUuid.uuid,
            bank_name: bankAccountWithThisUuid.bank_name,
            bank_account_type:
              bankAccountWithThisUuid.bank_account_type,
            account_last_four:
              bankAccountWithThisUuid.account_last_four,
          });
          if (section == 'more-funding') {
            await setArray();
          }
          setNeedsManualForm(true);
          await setShowHideClassNameModalDisplay(
            'modal display-block',
          );
        } else {
          setNeedsManualForm(false);
          await setShowHideClassNameModalDisplay(
            'modal display-none',
          );
        }

        await client.bankAccountsControllerSelectForWithdrawal(true, {
          uuid: uuid,
        });
      }}
      selectName="withdrawal-bank"
      placeholderText="withdrawal bank number"
      defaultSelectedValue={withdrawalBank?.uuid}
    />
  );

  const confirmationInfo: ConfirmationInfoLine[] = [
    // { theLabel: 'For Payroll Date', theValue: DateTime.fromISO(repaymentRecord.payroll_due_date as string).toLocaleString() },
    // { theLabel: "Payback Date:", theValue: paybackDate },
    // {
    //   theLabel: "Total Interest:",
    //   theValue: formatNumberAsDollars(totalInterest),
    // },
    // {
    //   theLabel: "Total Interest %:",
    //   theValue: `${1.5 * dealRecord.selected_num_of_weeks_in_portal}%`,
    // },

    { theLabel: 'Total Payback:', theValue: totalPayback },
    { theLabel: 'Funds sent to Bank:', theValue: depositBankSelect },
    { theLabel: 'Repayment Bank:', theValue: withdrawalBankSelect },
  ];

  const infoDisplay = confirmationInfo.map((el, idx) => {
    return (
      <div key={idx * 10} className="confirmation-info-wrapper">
        <div className="confirmation-info-label">{el.theLabel}</div>
        <div className="confirmation-info-value">{el.theValue}</div>
      </div>
    );
  });
  return (
    <div id="confirm-outer-wrapper">
      {needsManualForm &&
        chaseBankAccountsArray[0].uuid != undefined && (
          <ManualBankModal
            key={bankAccountToUpdate.uuid}
          ></ManualBankModal>
        )}
      <RequestFundingTitle
        centered={section == 'onboarding'}
        section={section}
        fundingStep="confirm"
        title={
          section == 'onboarding'
            ? 'Review and Confirm'
            : 'Review Details'
        }
        subtitle=""
      />

      <BankFetcher getFromApiEvenIfEmptyArray="yes" />

      <div
        id={
          section == 'more-funding'
            ? 'confirm-container-repeat-funding'
            : 'confirm-container'
        }
      >
        <div>
          <div id="confirm-highlights">
            <p
              className={
                section == 'onboarding'
                  ? '  funding-amount-color'
                  : '  repeat-funding'
              }
            >
              Funding Amount:
            </p>
            <p
              className={
                section == 'onboarding'
                  ? 'total-repayment-val-confirm  amount-design'
                  : 'total-repayment-val-confirm amount-design'
              }
            >
              {formatNumberAsDollars(dealRecord.funding_amount)}
            </p>

            <p
              className={
                section == 'more-funding'
                  ? 'your-numbers-label confirm-label-total-loan'
                  : 'your-numbers-label confirm-label-total-loan'
              }
            >
              Payback Date:
              <span className=" confirm-label-total-loan-amount">
                {paybackDate}
              </span>
            </p>
          </div>
        </div>

        <div
          className={
            section == 'more-funding'
              ? 'funding-date-more'
              : 'funding-date'
          }
        >
          <p className="funding-date-message">
            {' '}
            The funds will arrive in your account on {''}
            {DateTime.fromISO(
              transactionAvailability.fundingDate,
            ).toLocaleString()}
          </p>
          <p className="funding-date-explanation">
            The deadline for same-day funding is 1:00 PM EST
          </p>
        </div>

        {transactionAvailability.fundingDate >
        formatDate(DateTime.now().toISODate()) ? (
          <InfoMessage
            theBackgroundColor="yellow"
            messageText={`Funding is unavailable today. Your funding date is ${DateTime.fromISO(
              transactionAvailability.fundingDate,
            ).toLocaleString()}.`}
          ></InfoMessage>
        ) : (
          ''
        )}
        {infoDisplay}

        <div
          className={
            section == 'more-funding'
              ? 'ach-container-more'
              : 'ach-container'
          }
        >
          <p className="ach-header-text">
            <input
              type="checkbox"
              onChange={() => setSignedAch(!signedAch)}
              className="grey-square"
              // className="checkbox-design"
            />
            <span className="ach-span">ACH Debit Authorization:</span>
          </p>
          <p className="ach-text">{`I hereby authorize Payro Finance LLC to debit from ${
            withdrawalBank?.bank_name
          }  ${getLastFourCharacters(
            withdrawalBank?.bank_account_number,
          )} account according to the terms of all signed contracts between ${legalCompanyName} company and Payro, and if necessary, initiate adjustments for any transactions credited or debited in error.`}</p>
        </div>
      </div>

      {showClickedConfirmLoader && (
        <Loader message="Hold on a few seconds while we process your request!" />
      )}
      {!showClickedConfirmLoader && (
        <div
          className={
            section == 'onboarding' ? '' : 'get-funded-button-wrapper'
          }
        >
          {/* <OpenModalLink
            showLink={
              chaseBankAccountsArray[0].bankRoutingNumber !=
                undefined &&
              ((bankAccountToUpdate.bank_account_type != undefined &&
                depositBank &&
                depositBank.bank_name?.toLowerCase() == 'chase' &&
                depositBank.is_real_bank_numbers == false) ||
                (withdrawalBank &&
                  withdrawalBank.bank_name?.toLowerCase() ==
                    'chase' &&
                  withdrawalBank.is_real_bank_numbers == false))
            }
            bankAccountLastFour={
              depositBank &&
              depositBank.bank_name?.toLowerCase() == 'chase' &&
              depositBank.is_real_bank_numbers == false &&
              depositBank.account_last_four
                ? depositBank.account_last_four
                : withdrawalBank &&
                  withdrawalBank.bank_name?.toLowerCase() ==
                    'chase' &&
                  withdrawalBank.is_real_bank_numbers == false &&
                  withdrawalBank.account_last_four
                ? withdrawalBank.account_last_four
                : ''
            }
            // selctedBank={bankAccountToUpdate.uuid==depositBank?.uuid &&}
          /> */}
          <PayroButton
            className={
              section == 'onboarding'
                ? 'get-funded-button-onboarding'
                : 'get-funded-button-repeat-funding'
            }
            centered={true}
            onClick={() => {
              setShowClickConfirmedLoader(true);
              props.confirmButtonClick();
            }}
            buttonSize="large"
            disabled={
              signedAch == false ||
              (depositBank &&
                depositBank.bank_name?.toLowerCase() == 'chase' &&
                depositBank.is_real_bank_numbers == false) ||
              (withdrawalBank &&
                withdrawalBank.bank_name?.toLowerCase() == 'chase' &&
                withdrawalBank.is_real_bank_numbers == false)
            }
          >
            Get Funded
          </PayroButton>
        </div>
      )}
    </div>
  );
};

const getLastFourCharacters = (s: string | undefined) => {
  if (!s) {
    return '';
  }

  if (s.length <= 4) {
    return s;
  }

  return s.substr(s.length - 4, 4);
};

export default ConfirmPage;
