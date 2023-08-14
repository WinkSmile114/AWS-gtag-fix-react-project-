import PayroButton from '../widgets/PayroButton';
import NextIcon from '../common-icons/next-arrow.svg';
import BackIcon from '../common-icons/back-arrow.svg';
import CheckIcon from '../common-icons/checkIconWhite.png';
import ProgressCircleLock from '../pages/Application/SectionMarker/ProgressCircleLock.svg';
import './footer-buttons.css';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  isNextButtonDisabledState,
  currentScreenState,
  signedDocsState,
  signatureDataUrlState,
  documentSectionsState,
  showDocsState,
  docVersionState,
  furthestScreenState,
  clientState,
  contactsState,
} from '../recoil-state/application-stage-states';
import {
  accountRecordState,
  allAccountUsersContactInfoState,
  FundingStepStateType,
  mainSectionState,
  userInfoState,
} from '../recoil-state/general-states';
import { useEffect, useState } from 'react';
import { getClient } from '../api-utils/general-utils';
import {
  isThereFutureFinchPayroll,
  numOfEmployeesState,
  opportunityRecordState,
  payrollAmountState,
  payrollCompanyState,
  payrollFrequencyState,
} from '../recoil-state/finch-states';
import {
  GetAccountDto,
  UserObject,
} from '../api-utils/generated-client';

import { DocumentSection } from '../pages/Application/SignAgreements/document-utils';
import {
  fundingStepState,
  dealDraftState,
  uploadedFilesState,
  isAllBankInfoValidState,
  bankAccountsState,
  needsManualFormState,
  bankAccountToUpdateState,
} from '../recoil-state/request-funding-states';
import { persistAllBankInfo } from '../pages/RequestFunding/ConnectBankAccounts/utils';
import { applicationStageSectionNames } from '../constants';
export type SectionMarkerSection =
  | 'CompanyInfo'
  | 'PayrollInfo'
  | 'BankStatements'
  | 'SignAgreements';
interface FooterButtonProps {
  nextType?: 'button' | 'reset' | 'submit' | 'getFunded' | 'cancel';
  formToSubmit?: string;
  customNextText?: string;
  hideBackButton?: boolean;
  hideNextButton?: boolean;
  nextDisabled?: boolean;
  updateFooter?: any;
  pageNumAndOutOf?: any;
  currentSection?: SectionMarkerSection;
  furthestSection?: SectionMarkerSection;
  screenNamesOnAppPage?: (
    newScreenName: string,
    furthestScreen: string,
  ) => void;
}
const FooterButtons = (props: FooterButtonProps) => {
  const mainSection = useRecoilValue(mainSectionState);
  const [currentScreen, setCurrentScreen] = useRecoilState<any>(
    currentScreenState,
  );

  const [bankAccountToUpdate, setBankAccountToUpdate] =
    useRecoilState(bankAccountToUpdateState);
  const [fundingStep, setFundingStep] =
    useRecoilState(fundingStepState);
  const [isNextDisabled, setIsNextDisabled] = useRecoilState(
    isNextButtonDisabledState,
  );
  const [backScreenName, setBackScreenName] = useState<any>();
  const [nextScreenName, setNextScreenName] = useState<any>();
  const [hideBackButton, setHideBackButton] = useState(false);
  const [hideNextButton, setHideNextButton] = useState(false);
  const [customNextText, setCustomNextText] = useState<any>();
  const [pageNumAndOutOf, setPageNumAndOutOf] = useState<any>();
  const [client, setClient] = useRecoilState<any>(clientState);
  const [payrollCompany, setPayrollCompany] = useRecoilState<any>(
    payrollCompanyState,
  );
  const [payrollAmount, setPayrollAmount] = useRecoilState<any>(
    payrollAmountState,
  );
  const [numOfEmployees, setNumOfEmployees] = useRecoilState<any>(
    numOfEmployeesState,
  );
  const [payrollFrequency, setPayrollFrequency] = useRecoilState<any>(
    payrollFrequencyState,
  );
  const [opportunityRecord, setOpportunityRecord] =
    useRecoilState<any>(opportunityRecordState);

  const [AccountDetail, setAccountDetail] =
    useRecoilState<GetAccountDto>(accountRecordState);
  const contacts = useRecoilValue(contactsState);
  const [dealRecord, setDealRecord] = useRecoilState(dealDraftState);
  const isAllBankInfoValid = useRecoilValue(isAllBankInfoValidState);

  const [furthestScreen, setFurthestScreen] = useRecoilState<any>(
    furthestScreenState,
  );
  const needsManualForm = useRecoilValue(needsManualFormState);
  const [signedDocs, setSignedDocs] =
    useRecoilState<boolean>(signedDocsState);
  const [signatureDataUrl, setSignaturedataUrl] = useRecoilState<any>(
    signatureDataUrlState,
  );
  const [bankAccounts, setBankAccounts] =
    useRecoilState(bankAccountsState);
  const [documentSections, setDocumentSections] = useRecoilState<
    DocumentSection[]
  >(documentSectionsState);
  const [showDocs, setShowDocs] = useRecoilState(showDocsState);
  const [docVersion, setDocVersion] =
    useRecoilState<string>(docVersionState);
  const isThereFuturePayroll = useRecoilValue(
    isThereFutureFinchPayroll,
  );
  const uploadedPayrollStatements = useRecoilValue(
    uploadedFilesState,
  );
  const userInfo = useRecoilValue(userInfoState);
  const getClientFunc = async () => {
    if (client) {
      return client;
    } else {
      const apiClient = await getClient();
      setClient(apiClient);
    }
  };
  const updateCurrentScreen = async (newScreenName: string) => {
    if (mainSection === 'Application') {
      setCurrentScreen(newScreenName);
      checkIfCurrentScreenIsNewFurthestScreen(newScreenName);
      await client.userInfoControllerUpdateUserInfo({
        current_screen: newScreenName,
      });

      props.screenNamesOnAppPage
        ? props.screenNamesOnAppPage(newScreenName, furthestScreen!)
        : console.log('else');
    } else if (mainSection === 'Onboarding') {
      setFundingStep(newScreenName as FundingStepStateType);
    }
  };
  const setFooterFunction = () => {
    if (mainSection === 'Application') {
      switch (currentScreen) {
        //--------APPLICTION SECTION SCREENS--------
        case 'CompanyInfo':
          setBackScreenName('Home');
          setNextScreenName('PayrollInfo');
          setHideBackButton(true);
          setIsNextDisabled(false);
          setCustomNextText('');
          break;
        case 'PayrollInfo':
          setBackScreenName('CompanyInfo');
          setNextScreenName('BankInfo');
          setHideBackButton(false);
          setIsNextDisabled(false);
          setCustomNextText('');
          setHideNextButton(false);
          break;
        case 'BankInfo':
          setBackScreenName('PayrollInfo');
          setNextScreenName('SignAgreements');
          setHideBackButton(false);
          setIsNextDisabled(false);
          setCustomNextText('');
          setHideNextButton(false);
          break;
        case 'SignAgreements':
          setBackScreenName('BankInfo');
          setHideNextButton(true);

          break;
      }
    } else if (mainSection === 'Onboarding') {
      switch (fundingStep) {
        case 'funding-amount':
          setBackScreenName('funding-amount');
          setNextScreenName('repayment-date');
          setIsNextDisabled(
            !dealRecord.funding_amount ||
              dealRecord.funding_amount < 5000 ||
              !AccountDetail ||
              dealRecord.funding_amount >
                (AccountDetail!.credit_amount_available ?? 0),
          );
          setCustomNextText('');
          setHideBackButton(true);
          setPageNumAndOutOf('1/4');
          break;
        case 'repayment-date':
          setBackScreenName('funding-amount');
          setNextScreenName('bank-info');
          setIsNextDisabled(false);
          setCustomNextText('');
          setPageNumAndOutOf('2/4');
          break;
        case 'bank-info':
          setBackScreenName('repayment-date');
          setNextScreenName(
            needsManualForm ? 'manual-bank-form' : 'verify-payroll',
          );
          setIsNextDisabled(!isAllBankInfoValid);
          setCustomNextText('');
          setPageNumAndOutOf('3/4');
          break;
        case 'manual-bank-form':
          setBackScreenName('bank-info');
          setNextScreenName('verify-payroll');
          setIsNextDisabled(true);
          setCustomNextText('');

          break;
        case 'verify-payroll':
          setBackScreenName(
            needsManualForm ? 'manual-bank-form' : 'bank-info',
          );
          setNextScreenName('confirm');
          setIsNextDisabled(
            isThereFuturePayroll != 'yes' &&
              uploadedPayrollStatements?.length < 1,
          );

          setCustomNextText('Next');
          setPageNumAndOutOf('4/4');
          setHideNextButton(false);
          break;
        case 'confirm':
          setBackScreenName('verify-payroll');
          setNextScreenName('funded');
          setHideNextButton(true);
          setIsNextDisabled(false);
          setCustomNextText('');
          setPageNumAndOutOf('');
          break;
      }
    }
  };
  const nextOnClick = async () => {
    const apiClient = await getClient();
    if (!apiClient) {
      return;
    }
    if (mainSection === 'Application') {
      switch (currentScreen) {
        case 'CompanyInfo':
          if (apiClient && AccountDetail) {
            apiClient.accountsControllerUpdate(AccountDetail);
            apiClient.contactsControllerUpsertAll({ contacts });
          }
          break;
        case 'PayrollInfo':
          if (apiClient) {
            let accdetails  = AccountDetail;
            if(payrollCompany){
              accdetails = {...AccountDetail,payroll_company:payrollCompany}
            }
            // console.log('accdetails',accdetails)
            apiClient.accountsControllerUpdate(accdetails);
            // apiClient.accountsControllerUpdate(AccountDetail);
            apiClient.opportunitiesControllerUpdate({
              uuid: opportunityRecord.uuid,
              number_of_employees_range: numOfEmployees,
              how_often_do_you_run_payroll: payrollFrequency,
              average_payroll_amount: payrollAmount,
            });
          }
          break;
        case 'BankInfo':
          break;
        case 'SignAgreements':
          setSignedDocs(true);
          setShowDocs(false);
          await apiClient.documentsControllerSignDocuments({
            signature: signatureDataUrl,
            documentVersion: docVersion as string,
          });
          window.location.reload();
          break;
      }
    } else if (mainSection === 'Onboarding') {
      switch (fundingStep) {
        case 'repayment-date':
          apiClient.dealsControllerUpdate({
            selected_num_of_weeks_in_portal:
              dealRecord.selected_num_of_weeks_in_portal ?? 2,
          });
          break;
        case 'bank-info':
          persistAllBankInfo(dealRecord, setDealRecord, bankAccounts);
          break;
        case 'manual-bank-form':
          {
            if (bankAccountToUpdate.uuid) {
              const t = await apiClient.bankAccountsControllerUpdate(
                bankAccountToUpdate.uuid,
                bankAccountToUpdate,
              );
              if (t) {
                const b =
                  await client.bankAccountsControllerFindAll();
                await setBankAccounts(b.data);
              }
            }
          }

          break;
        default:
          return;
      }
    }
  };
  const backOnClick = async () => {
    if (currentScreen !== 'PayrollInfo') return;
    const apiClient = await getClient();
    if (apiClient) {
      apiClient.accountsControllerUpdate({
        payroll_company: payrollCompany,
      });
      apiClient.opportunitiesControllerUpdate({
        uuid: opportunityRecord.uuid,
        number_of_employees_range: numOfEmployees,
        how_often_do_you_run_payroll: payrollFrequency,
        average_payroll_amount: payrollAmount,
      });
    }
  };
  const checkIfCurrentScreenIsNewFurthestScreen = (
    newScreenName: string | undefined,
  ) => {
    if (applicationStageSectionNames) {
      const possibleNewScreenNameIndex =
        applicationStageSectionNames.findIndex(
          (x) => x.apiRef == newScreenName,
        );

      const oldScreenNameIndex =
        applicationStageSectionNames.findIndex(
          (x) => x.apiRef == props.furthestSection,
        );
      if (possibleNewScreenNameIndex > oldScreenNameIndex) {
        setFurthestScreen(newScreenName);
      }
    }
  };
  useEffect(() => {
    setFooterFunction();
    getClientFunc();
  }, [
    currentScreen,
    mainSection,
    fundingStep,
    dealRecord,
    isAllBankInfoValid,
    isThereFuturePayroll,
    uploadedPayrollStatements,
    needsManualForm,
  ]);
  return (
    <>
      <div
        id="footer-button-wrapper"
        className={hideBackButton ? 'center-next' : ''}
      >
        <PayroButton
          onClick={() => {
            if (mainSection === 'RepeatFunding') {
              setFundingStep('funding-amount');
            } else {
              backOnClick();
              updateCurrentScreen(backScreenName);
            }
          }}
          hidden={hideBackButton}
          startIcon={BackIcon}
          variant="back-button"
          className={'accent-background-color'}
        >
          {props.nextType === 'cancel' || nextScreenName === 'funded'
            ? 'Edit Details'
            : 'Back'}
        </PayroButton>
        <p
          className={
            !hideBackButton
              ? 'page-number'
              : 'page-number-hide-back-button'
          }
        >
          {pageNumAndOutOf}
        </p>
        <PayroButton
          onClick={() => {
            nextOnClick();
            updateCurrentScreen(nextScreenName);
          }}
          endIcon={customNextText == 'Submit' ? CheckIcon : NextIcon}
          hidden={hideNextButton || props.nextType == 'cancel'}
          disabled={isNextDisabled}
          variant={
            (customNextText == 'Submit' && !isNextDisabled) ||
            props.nextType == 'submit'
              ? 'green'
              : props.nextType == 'cancel'
              ? 'red-white'
              : 'purple'
          }
          customWidth={
            props.nextType == 'submit' || customNextText == 'Submit'
              ? 'width-210'
              : props.nextType == 'cancel'
              ? 'width-200'
              : 'width-130'
          }
          className={'accent-background-color'}
        >
          {props.nextType == 'cancel'
            ? 'Cancel Request'
            : props.nextType == 'submit'
            ? 'Submit Application'
            : props.nextType == 'getFunded'
            ? 'Get funded!'
            : customNextText
            ? customNextText
            : 'Next'}
        </PayroButton>
      </div>
      {nextScreenName == 'verify-payroll' && (
        <div className="data-container">
          <img
            className="lock-icon-bank"
            src={ProgressCircleLock}
            alt="image"
          />
          <p className="data-encrypted-text">
            {' '}
            End-to-end encryption.
          </p>
        </div>
      )}
    </>
  );
};

export default FooterButtons;
