import PayrollToFundDetails from '../PayrollToFundDetails';
import RepaymentDate from '../RepaymentDate';
import { RequestFundingWrapperProps } from './interfaces';
import FooterButtons from '../../../Footer/footer-buttons';
import Funded from '../Funded';
import {
  BankAccount,
  GetAccountDto,
  UpdateBankAccountDto,
} from '../../../api-utils/generated-client';
import NextIcon from '../../../common-icons/next-arrow.svg';
import ConnectBankAccounts from '../ConnectBankAccounts/connect-banks';
import Confirm from '../Confirm';
import VerifyPayroll from '../VerifyPayroll';
import PayroButton from '../../../widgets/PayroButton';
import LedgerHome from '../../Ledger/LedgerHome';
import {
  fundingStepState,
  dealDraftState,
  uploadedFilesState,
  bankAccountToUpdateState,
  bankAccountsState,
  chaseBankAccountsArrayState,
} from '../../../recoil-state/request-funding-states';
import { isThereFutureFinchPayroll } from '../../../recoil-state/finch-states';
import {
  useRecoilValue,
  useSetRecoilState,
  useRecoilState,
} from 'recoil';
import { getClient } from '../../../api-utils/general-utils';
import { useContext, useEffect, useState } from 'react';
import { MessageContext } from '../../../context';
import RequestFundingTitle from '../request-funding-title';
import TotalPayback from '../TotalPayback';
import DealFailed from '../DealFailed/DealFailed';
import closeX from '../../../common-icons/closex.svg';
import { useHistory } from 'react-router-dom';
import { logGreen } from '../../../common-utils';
import { accountRecordState } from '../../../recoil-state/general-states';

export default () => {
  let history = useHistory();
  const isValidSceenName = (newScreen: string): boolean => {
    const validScreens = [
      'funding-amount',
      'repayment-date',
      'bank-info',
      'verify-payroll',
      'confirm',
      'funded',
      'dashboard',
    ];
    return validScreens.includes(newScreen);
  };
  const [fundingStep, setFundingStep] =
    useRecoilState(fundingStepState);
  const dealRecord = useRecoilValue(dealDraftState);
  const uploadedFiles = useRecoilValue(uploadedFilesState);
  const isThereFuturePayrollFromFinch = useRecoilValue(
    isThereFutureFinchPayroll,
  );
  const [hideConfirmFooterButtons, setHideConfirmFooterButtons] =
    useState(false);
  const [bankAccountToUpdate, setBankAccountToUpdate] =
    useRecoilState<UpdateBankAccountDto>(bankAccountToUpdateState);
  const [bankAccounts, setBankAccounts] =
    useRecoilState(bankAccountsState);
  let [chaseBankAccountsArray, setChaseBankAccountsArray] =
    useRecoilState(chaseBankAccountsArrayState);

  const [accountDetails, setAccountDetails] =
    useRecoilState<GetAccountDto>(accountRecordState);

  const messageContext = useContext(MessageContext);

  useEffect(() => {
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

    console.log(chaseBankAccountsArray);

    const getBankAccounts = async () => {
      const client = await getClient();
      if (!client) {
        return;
      }
      const b = await client.bankAccountsControllerFindAll();
      await setBankAccounts(b.data);
    };
    getBankAccounts();
    {
      bankAccounts && bankAccounts.length > 1 && setArray();
    }

    const setBank = () => {
      setBankAccountToUpdate({
        ...bankAccountToUpdate,
        uuid: bankAccounts[0].uuid,
        bank_name: bankAccounts[0].bank_name,
        bank_account_type: bankAccounts[0].bank_account_type,
        account_last_four: bankAccounts[0].account_last_four,
      });
    };
    // setBank();
    // {
    //    bankAccounts &&
    //     bankAccounts.length > 1 &&
    //     chaseBankAccountsArray[0].uuid != undefined &&
    //     setBank();
    // }
    // console.log(chaseBankAccountsArray);
    {
      bankAccounts && bankAccounts.length > 1 && setBank();
    }
  }, []);

  return (
    <div
      id={`request-funding-wrapper-${fundingStep}`}
      className={`main-body more-funding `}
    >
      {fundingStep != 'failed' && (
        <img
          id="close-request-more-on-page"
          src={closeX}
          onClick={() => history.push('/dashboard')}
        />
      )}
      {fundingStep == 'funding-amount' && (
        <div>
          <RequestFundingTitle
            fundingStep="confirm"
            title={'Fund Payroll'}
            subtitle=""
          />
          <VerifyPayroll />

          <PayrollToFundDetails />

          <RepaymentDate />

          <TotalPayback />

          <PayroButton
            centered={true}
            onClick={() => {
              setFundingStep('confirm');
              messageContext.clearMessages();
            }}
            disabled={
              !dealRecord.funding_amount ||
              dealRecord.funding_amount < 5000 ||
              (accountDetails.credit_amount_available &&
                dealRecord.funding_amount >
                  accountDetails.credit_amount_available) ||
              (isThereFuturePayrollFromFinch != 'yes' &&
                uploadedFiles.length <= 0) ||
              !dealRecord.selected_num_of_weeks_in_portal
            }
            customWidth="width-200"
            endIcon={NextIcon}
          >
            Review and Confirm
          </PayroButton>
        </div>
      )}

      {fundingStep == 'confirm' && (
        <div>
          <Confirm
            confirmButtonClick={async () => {
              setHideConfirmFooterButtons(true);
              const client = await getClient();
              try {
                const dealStatus =
                  await client?.dealsControllerActivateDeal();

                if (dealStatus?.status == 200) {
                  setFundingStep('funded');
                  history.push('/funded');
                } else {
                  setFundingStep('failed');
                }
              } catch (error) {
                logGreen('requestFundingFailed', error);

                setFundingStep('failed');
              }
            }}
          />
          {!hideConfirmFooterButtons && (
            <FooterButtons
              hideNextButton={true}
              //     nextDisabled={false}
              nextType="cancel"

              // //the next type is set to cancel so that the button will say cancel request
            />
          )}
        </div>
      )}
      {fundingStep == 'failed' && <DealFailed />}

      {/* {fundingStep == 'funded' && <Funded />} */}
    </div>
  );
};
