import FooterButtons from '../../../Footer/footer-buttons';
import TitleSection from '../../../Header/title-section';
import FinchConnector from '../../../widgets/FinchConnector';
import { useContext, useEffect, useState } from 'react';
import './index.scss';
import refreshLogo from '../../../common-icons/refresh.png';
import { formatNumberAsDollars, isFeatureOn } from '../../../utils';
import { getClient } from '../../../api-utils/general-utils';
import LuxonUtils from '@date-io/luxon';
import PayroInput from '../../../widgets/PayroInput';
import PayroRadioButtonGroup from '../../../widgets/PayroRadioButtonGroup';
import Uploader from '../../../widgets/Uploader';
import Slider from '../../../widgets/RangeSlider';
import { getFiles, uploadFiles, deleteFile } from '../utils';

import Loader from '../../../widgets/Loader';
import RequestFundingTitle from '../request-funding-title';
import { PayrollInfo } from '../../../api-utils/generated-client';
import { MessageContext } from '../../../context';
import {
  useRecoilValue,
  useSetRecoilState,
  useRecoilState,
} from 'recoil';
import {
  finchPayrollInfoState,
  isThereFutureFinchPayroll,
} from '../../../recoil-state/finch-states';
import {
  dealDraftState,
  sectionState,
  uploadedFilesState,
} from '../../../recoil-state/request-funding-states';
import { accountRecordState } from '../../../recoil-state/general-states';

//gets from api in for "2021-04-15"
//needs to be stored in same form, but datepicker sets as date object and needs to be initialized as date object
interface VerifyPayrollProps {
  type?: string;
}
export default (props: VerifyPayrollProps) => {
  const [dealRecord, setDealRecord] = useRecoilState(dealDraftState);
  const [accountRecord, setAccountRecord] = useRecoilState(
    accountRecordState,
  );
  const section = useRecoilValue(sectionState);

  const finchFeatureOn: boolean = isFeatureOn('Finch');
  const [uploadedFiles, setUploadedFiles] = useRecoilState(
    uploadedFilesState,
  );

  const [loadedRepayment, setLoadedRepayment] =
    useState<boolean>(false);
  const [finishedloadingFinch, setFinishedLoadingFinch] =
    useState<boolean>(finchFeatureOn ? false : true);
  const [fundAmountSelection, setFundAmountSelection] = useState<
    'full' | 'other'
  >();
  const [isConnected, setIsConnected] = useState(false);
  const [statements, setStatements] = useState(false);
  const [showUploader, setShowUploader] = useState<boolean>(true);
  const [isThereFuturePayroll, setIsThereFuturePayroll] =
    useRecoilState(isThereFutureFinchPayroll);

  const uploadTheFiles = async (fileToUpload: any[]) => {
    const client = await getClient();
    if (client) {
      const uploadRes = await uploadFiles(fileToUpload, client);

      if (uploadRes == 'fail') {
        messageContext.addMessage({
          level: 'error',
          message: 'Only PDF uploads are valid',
        });
      }

      const gottenFiles = await getFiles(client);
      setUploadedFiles(gottenFiles);
    }
  };

  const getNewUploadedFiles = () =>
    getClient().then((client) => {
      if (!client) {
        return;
      }
      getFiles(client).then((gottenFiles) =>
        setUploadedFiles(gottenFiles),
      );
    });

  useEffect(() => {
    getNewUploadedFiles();
  }, []);
  // useEffect(() => {
  //     if (finchPayrollInfo) {
  //         if (finchPayrollInfo.length > 0) {
  //             const lastPayroll = finchPayrollInfo[0]
  //             const calculateFundingAmount = () => {
  //                 if (dealRecord.funding_amount) {
  //                     return dealRecord.funding_amount;
  //                 } else {
  //                     return getFundingLimitForThisPayroll(approvedCreditLimit, lastPayroll.company_debit.amount)
  //                 }
  //             }
  //             setRepaymentRecord({
  //                 ...repaymentRecord,
  //                 funding_amount: calculateFundingAmount(),
  //                 payroll_cash_due: repaymentRecord.payroll_cash_due ? repaymentRecord.payroll_cash_due : lastPayroll.company_debit.amount,
  //                 payroll_due_date: repaymentRecord.payroll_due_date ? repaymentRecord.payroll_due_date : lastPayroll.debit_date
  //             })
  //             setFinishedLoadingFinch(true)
  //         }
  //     }
  // }, [finchPayrollInfo])

  const messageContext = useContext(MessageContext);
  //const mostRecentFinchPayroll = finchPayrollInfo && finchPayrollInfo.length > 0 ? finchPayrollInfo[0] : undefined
  //const mostRecentPayroll = finchPayrollInfoState && finchPayrollInfoState.length > 0 ? finchPayrollInfoState[0] : undefined

  //setPayrollFunding({ ...payrollFunding, dueDate: e.target.value })

  const userRequestsTooMuchFunding =
    dealRecord.funding_amount &&
    dealRecord.funding_amount >
      (accountRecord.credit_amount_available as number);

  return (
    <div id="verify-payroll">
      <RequestFundingTitle
        section={section}
        title={
          props.type === 'increase-credit'
            ? 'Verify Last Payroll'
            : 'Payroll Verification'
        }
        subtitle="Please upload the payroll statement for the payroll you want to fund"
        sectionNumber={
          props.type == 'increase-credit'
            ? undefined
            : section == 'onboarding'
            ? 4
            : section == 'more-funding'
            ? 1
            : 1
        }
      />

      {finchFeatureOn && (
        <FinchConnector
          associatedPhase="repayment"
          refresh="yes"
          // level='error'
          // message='A future payroll must be manually uploaded in order to proceed.'
          isConnectedCallback={async () => {
            // props.setGotPayrollInfoFromFinch(true)
            setFinishedLoadingFinch(true);

            if (isThereFuturePayroll == 'yes') {
              //meaning there's a future payroll so manual upload isn't needed

              setShowUploader(false);
            }
            if (isThereFuturePayroll == 'no') {
              setShowUploader(true);
            }
          }}
          isDisconnectedCallback={() => {
            setFinishedLoadingFinch(true);
          }}
          onDisconnect={() => {
            setIsThereFuturePayroll(undefined);
            messageContext.clearMessages();
            setShowUploader(true);
          }}

          // broadcastPayrollInfo={setFinchPayrollInfo}
        />
      )}

      {!showUploader && isThereFuturePayroll == 'yes' && (
        <>
          <h5 id="payroll-verified">
            Your Payroll Has Been Verified
          </h5>

          {/* <p className="bold payroll-record-label">Current Payroll Record Found:</p>
                    <div className="rounded-corner-section-light grey-background payroll-record">
                        <div>
                            <span className="bold">Date:</span> <br />
                            {mostRecentPayroll.debit_date}
                        </div>
                        <div>
                            <span className="bold">Employees:</span> <br />
                            {mostRecentPayroll.individual_ids.length}
                        </div>
                        <div>
                            <span className="bold">Total Cash Due:</span> <br />
                            {formatNumberAsDollars(mostRecentPayroll.company_debit.amount)}
                        </div>
                        <img src={refreshLogo} onClick={() => getFreshPayrollInfo()}></img>

                        //(!mostRecentPayroll) && (finishedloadingFinch && showUploader) &&

                    </div> */}
        </>
      )}
      {isThereFuturePayroll == 'no' && (
        <div>
          <p id="no-future-payroll">
            We are connected to your payroll system, but we don't see
            any payroll with a date that has not passed. Some payroll
            companies may take up to 24 hours to post this info.{' '}
            <br />
            <b>Please upload your payroll statement manually.</b>
          </p>
        </div>
      )}
      {showUploader && (
        <>
          <Uploader
            inputChangeHandler={async (files: any) => {
              for (let i = 0; i < files.length; i++) {
                if (files[i].size > 10_000_000) {
                  messageContext.addMessage({
                    level: 'error',
                    message: 'File Size is limited to 10MB',
                  });
                  return;
                }
              }
              await uploadTheFiles(files);
            }}
            instructionsText="Upload Payroll Statement"
            uploadedFiles={uploadedFiles}
            getLatestUploadedFiles={async () => {
              await getNewUploadedFiles();
            }}
            deleteFile={(fileName) => {
              getClient().then((client) => {
                if (client) {
                  deleteFile(fileName, client).then((res) => {
                    getNewUploadedFiles().then((res: any) => {});
                  });
                }
              });
            }}
          />
        </>
      )}
    </div>
  );
};

const getFundingLimitForThisPayroll = (
  approvedCreditLimit: number | undefined,
  payrollAmount: number | undefined,
) => {
  if (!approvedCreditLimit || !payrollAmount) {
    return 0;
  }
  if (approvedCreditLimit > payrollAmount) {
    return payrollAmount;
  } else {
    return approvedCreditLimit;
  }
};
