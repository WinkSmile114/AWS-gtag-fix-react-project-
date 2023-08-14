import PayroButton from '../../../widgets/PayroButton';
import './index.scss';
import NextIcon from '../../../common-icons/next-arrow.svg';
import NoCreditAvailIcon from '../../../common-icons/maintenance.svg';
import { useHistory } from 'react-router-dom';
import VerifyPayroll from '../../RequestFunding/VerifyPayroll';
import { useRecoilState, useRecoilValue } from 'recoil';
import { uploadedFilesState } from '../../../recoil-state/request-funding-states';
import { userContactInfoState } from '../../../recoil-state/general-states';
import { getClient } from '../../../api-utils/general-utils';
import VerifyPayrollUploader from './VerifyPayrollUploader';
import { useEffect, useState } from 'react';
import { DateTime, Interval } from 'luxon';
import Loader from '../../../widgets/Loader';

const RequestMoreCreditForm = () => {
  let history = useHistory();
  const [userCanRequestMoreCredit, setUserCanRequestMoreCredit] =
    useState<boolean>();
  const [uploadedFiles, setUploadedFiles] = useRecoilState(
    uploadedFilesState,
  );
  const userContactInfo = useRecoilValue(userContactInfoState);

  useEffect(() => {
    const checkIfLongEnoughSinceLastOpportunity = async () => {
      const client = await getClient();
      if (!client) {
        return;
      }
      //setUserCanRequestMoreCredit(true);
      const opportunity =
        await client.opportunitiesControllerFindCreditIncreaseOpportunity();

      if (opportunity.data.length > 0) {
        const result = dateCheck(opportunity.data[0].created_date);
        setUserCanRequestMoreCredit(result);
      } else {
        setUserCanRequestMoreCredit(true);
      }
    };

    checkIfLongEnoughSinceLastOpportunity();
  }, []);

  const dateCheck = (oppDate: any) => {
    const a = DateTime.fromISO(oppDate);
    const b = DateTime.now();
    const interval = Interval.fromDateTimes(b, a);
    const intervalDays = interval.length('days');
    console.log(a);
    console.log(b);
    console.log(interval);
    console.log(intervalDays);
    if (intervalDays < 90) {
      return false;
    }
    return true;
  };

  const onRequestFunc = async () => {
    const client = await getClient();
    if (!client) {
      return;
    }
    const opp =
      await client.opportunitiesControllerCreateNewOpportunity();
    if (opp.status == 200 || opp.status == 201) {
      console.log('success');
      setUploadedFiles(['']);
    }
  };
  if (userCanRequestMoreCredit == undefined) {
    return <Loader />;
  }
  return (
    <div id="myModal">
      <div className="request-more-credit-content ">
        <span
          onClick={() => {
            history.goBack();
          }}
          className="close"
        >
          &times;
        </span>
        <p className="modal-header ">Request More Credit</p>
        {userCanRequestMoreCredit ? (
          <>
            <div>
              <VerifyPayrollUploader />
            </div>
            <div>
              <form className="myModal">
                <PayroButton
                  centered={true}
                  disabled={uploadedFiles.length < 1}
                  customWidth="width-182"
                  endIcon={NextIcon}
                  onClick={async () => {
                    onRequestFunc();
                    const theWindow = window as any;
                    theWindow.ChiliPiper.submit(
                      'payrofinance',
                      'inbound-router',
                      {
                        lead: {
                          FirstName: `${userContactInfo.first_name}`,
                          LastName: `${userContactInfo.last_name}`,
                          Email: `${userContactInfo.email}`,
                        },
                      },
                      { domElement: '#myModal' },
                    );
                  }}
                >
                  Request
                </PayroButton>
              </form>
            </div>
          </>
        ) : (
          <div id="no-available-credit-title-and-image-wrapper">
            <img src={NoCreditAvailIcon} alt="maintenance" />
            <p
              id="unable-to-request-credit-text-container"
              className="unable-to-request-credit-text-title"
            >
              You may only request a credit increase three months
              after your last credit request.
            </p>
          </div>
        )}{' '}
      </div>{' '}
    </div>
  );
};

export default RequestMoreCreditForm;
