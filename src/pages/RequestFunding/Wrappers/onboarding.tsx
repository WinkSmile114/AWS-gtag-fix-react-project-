import PayrollToFundDetails from '../PayrollToFundDetails';
import RepaymentDate from '../RepaymentDate';
import { RequestFundingWrapperProps } from './interfaces';
import FooterButtons from '../../../Footer/footer-buttons';
import Funded from '../Funded';
import { BankAccount } from '../../../api-utils/generated-client';
import ConnectBankAccounts from '../ConnectBankAccounts/connect-banks';
import Confirm from '../Confirm';
import VerifyPayroll from '../VerifyPayroll';
import ProgressBar from '../../../widgets/ProgressBar';
import RangeSlider from '../../../widgets/RangeSlider';
import CongratsPage from '../../Onboarding/congrats';
import LedgerHome from '../../Ledger/LedgerHome';
import { persistAllBankInfo } from '../ConnectBankAccounts/utils';
import {
  FundingStepStateType,
  fundingStepState,
  numOfWeeksState,
  dealDraftState,
  sectionState,
  isAllBankInfoValidState,
  uploadedFilesState,
} from '../../../recoil-state/request-funding-states';
import {
  accountRecordState,
  mainSectionState,
} from '../../../recoil-state/general-states';
import { useRecoilState, useRecoilValue } from 'recoil';
import { getClient } from '../../../api-utils/general-utils';
import { isThereFutureFinchPayroll } from '../../../recoil-state/finch-states';
import DealFailed from '../DealFailed/DealFailed';
import { useHistory } from 'react-router-dom';
import ManualBankForm from '../../../widgets/PlaidConnector/ManualBankForm';
import SignAgreements from '../../Application/SignAgreements';

export default () => {
  let history = useHistory();
  const [fundingStep, setFundingStep] =
    useRecoilState(fundingStepState);
  const [accountRecord, setAccountRecord] = useRecoilState(
    accountRecordState,
  );
  const [dealRecord, setDealRecord] = useRecoilState(dealDraftState);

  const [section, setSection] = useRecoilState(sectionState);
  const isAllBankInfoValid = useRecoilValue(isAllBankInfoValidState);
  const isThereFuturePayroll = useRecoilValue(
    isThereFutureFinchPayroll,
  );
  const uploadedPayrollStatements = useRecoilValue(
    uploadedFilesState,
  );
  const isValidSceenName = (newScreen: string): boolean => {
    const validScreens = [
      'congrats',
      'sign-contract',
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

  const getMainComponent = () => {
    switch (fundingStep) {
      case 'congrats':
        return (
          <div>
            <CongratsPage />
          </div>
        );

      // case 'dashboard':
      //   return (
      //     <div>
      //       <LedgerHome />
      //     </div>
      //   );

      case 'funding-amount':
        return (
          <div>
            <ProgressBar
              percentComplete={dealRecord.funding_amount ? 25 : 0}
            />

            <div className="request-funding-main-body">
              <PayrollToFundDetails />

              <FooterButtons
                hideBackButton={true}
                nextDisabled={false}
              />
            </div>
          </div>
        );

      case 'repayment-date':
        return (
          <div>
            <div>
              <ProgressBar percentComplete={50} />
              <div className="request-funding-main-body">
                <RepaymentDate />

                <FooterButtons
                  hideBackButton={false}
                  nextDisabled={false}
                />
              </div>
            </div>
          </div>
        );

      case 'bank-info':
        return (
          <div>
            <ProgressBar
              percentComplete={isAllBankInfoValid ? 75 : 50}
            />
            <div className="request-funding-main-body">
              <ConnectBankAccounts
              // FooterButtons IS INSIDE OF CONNECT BANK ACCOUNTS
              />
            </div>
          </div>
        );

      case 'verify-payroll':
        return (
          <div>
            <ProgressBar
              percentComplete={
                isThereFuturePayroll != 'yes' &&
                uploadedPayrollStatements?.length < 1
                  ? 75
                  : 85
              }
            />
            <div className="request-funding-main-body">
              <VerifyPayroll />
              <FooterButtons
                nextDisabled={
                  false
                  //TODO  props.isMainInfoNextDisabled()
                }
              />
            </div>
          </div>
        );
      case 'confirm':
        return (
          <div>
            <ProgressBar percentComplete={95} />
            <div className="request-funding-main-body">
              <Confirm
                confirmButtonClick={async () => {
                  const client = await getClient();
                  try {
                    const dealStatus =
                      await client?.dealsControllerActivateDeal();

                    if (dealStatus?.status == 200) {
                      history.push('/funded');
                      setFundingStep('funded');
                    } else {
                      setFundingStep('failed');
                    }
                  } catch {
                    setFundingStep('failed');
                  }
                }}
              />
              <FooterButtons
                hideNextButton={true}
                nextDisabled={false}
                nextType="getFunded"
              />
            </div>
          </div>
        );
      case 'manual-bank-form':
        return (
          <>
            <ProgressBar percentComplete={80} />

            <div className="request-funding-main-body">
              <ManualBankForm />
              <FooterButtons
                hideNextButton={true}
                nextDisabled={false}
              />
            </div>
          </>
        );
      case 'funded':
        return <Funded />;
      case 'failed':
        return <DealFailed />;
      case 'sign-contract':
        return <SignAgreements stage="onboarding" />;

      default:
        return <div>Please call support</div>;
    }
  };

  return (
    <div
      className={
        fundingStep == 'confirm'
          ? 'request-funding-wrapper-confirm'
          : fundingStep == 'sign-contract'
          ? 'request-funding-wrapper-sign-contract'
          : fundingStep == 'congrats'
          ? 'request-funding-wrapper-congrats'
          : fundingStep == 'funded' || fundingStep == 'failed'
          ? 'request-funding-wrapper-funded'
          : 'request-funding-wrapper'
      }
    >
      {getMainComponent()}
    </div>
  );
};
