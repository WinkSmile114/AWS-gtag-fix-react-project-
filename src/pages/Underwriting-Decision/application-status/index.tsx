import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getClient } from '../../../api-utils/general-utils';
import {
  GetAccountDto,
  GetAccountDtoPayroFinanceStatusEnum,
} from '../../../api-utils/generated-client';

import { formatNumberAsDollars } from '../../../utils';
import Loader from '../../../widgets/Loader';
import PayroButton from '../../../widgets/PayroButton';
import './index.scss';
import ApprovedIcon from './approved-icon.svg';
import DeclinedIcon from './declined-icon.png';
import ApplicationSubmittedIcon from './application-submitted-icon.png';

import { useContext } from 'react';
import { MessageContext } from '../../../context';
import PhoneIcon from '../../../common-icons/phone.png';

const AccountStatusPage = () => {
  const [accountInfo, setAccountInfo] = useState<GetAccountDto>();
  const [accountStatus, setAccountStatus] =
    useState<GetAccountDtoPayroFinanceStatusEnum>();

  const history = useHistory();

  const messageContext = useContext(MessageContext);
  useEffect(() => {
    const fetchApi = async () => {
      const client = await getClient();
      if (!client) {
        return;
      }
      const accountRes = await client.accountsControllerGetMyInfo();
      setAccountInfo(accountRes.data);
      setAccountStatus(accountRes.data.payro_finance_status);
    };

    fetchApi();
  }, []);

  if (!accountInfo) {
    return <Loader></Loader>;
  }

  let titleText;
  let subtileText;
  let logo;
  switch (accountStatus) {
    case GetAccountDtoPayroFinanceStatusEnum.Approved:
      titleText = 'Application Approved';
      logo = ApprovedIcon;
      break;
    case GetAccountDtoPayroFinanceStatusEnum.New:
      titleText = 'Awesome! Your application was submitted.';
      logo = ApplicationSubmittedIcon;
      subtileText =
        'We are currently reviewing your application, check back here periodically to see the status of your application.';
      break;
    case GetAccountDtoPayroFinanceStatusEnum.Declined:
      titleText = 'Application Declined';
      logo = DeclinedIcon;
      subtileText =
        'We are sorry to have to decline your application.  Declined applicants may wait 3 months and try again.';
      break;
  }
  if (!titleText) {
    titleText = 'Application Under Review';
  }

  return (
    <>
      <div
        id={
          accountStatus == GetAccountDtoPayroFinanceStatusEnum.New
            ? 'funding-status-header-wrapper-under-review'
            : 'funding-status-header-wrapper'
        }
      >
        <img id="funding-status-icon" src={logo}></img>
        <h2 id="funding-status-text">{titleText}</h2>
        {subtileText && (
          <p className="application-status-subtitle">{subtileText}</p>
        )}
      </div>

      {accountStatus == GetAccountDtoPayroFinanceStatusEnum.New && (
        <div className="schedule-container">
          <p className="under-review-additional-text">
            Feel free to schedule a call with an underwriter if you
            have any questions
          </p>
          <p className="phone-number">
            <img
              className="phone-icon-under-review"
              src={PhoneIcon}
              alt="image"
              width={20}
              height={20}
            />
            1-833-271-4499
          </p>
        </div>
      )}

      {accountStatus ==
        GetAccountDtoPayroFinanceStatusEnum.Approved && (
        <div className="credit-amount-wrapper">
          <p className="credit-number-label">Line of Credit</p>
          <p className="credit-number">
            {accountInfo.approved_credit_amount
              ? formatNumberAsDollars(
                  accountInfo.approved_credit_amount,
                )
              : ''}
          </p>
          <PayroButton onClick={() => history.push('')}>
            Request Funding
          </PayroButton>
        </div>
      )}
    </>
  );
};

export default AccountStatusPage;
