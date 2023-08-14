import { useEffect, useState } from 'react';
import { isSignedIn, signOut } from '../auth/utils/auth-utils';
import './index.css';
import PhoneIcon from '../common-icons/phone.png';
import fundPayrollIcon from '../common-icons/fund-payroll-icon.svg';
import loansIcon from '../common-icons/loans-header-icon.svg';
import loansIconSelected from '../common-icons/loans-header-icon-purple.svg';
import dashboardIconSelected from '../common-icons/dashboard-header-icon.svg';
import dashboardIcon from '../common-icons/dashboard-header-icon-grey.svg';
import LogoutIcon from '../common-icons/logout-icon.svg';
import ProgressBar from '../widgets/ProgressBar';
import { intercom } from '../intercom';
import PayroButton from '../widgets/PayroButton';
import UserProfile from '../UserProfile';
import { useHistory, useLocation } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import sampleLogo from './logo-sample.png';

import {
  accountRecordState,
  payrollPartnerState,
  userInfoState,
} from '../recoil-state/general-states';
import {
  GetAccountDto,
  GetAccountDtoPayroFinanceStatusEnum,
} from '../api-utils/generated-client';

const AUTH_PENDING = 'pending';
const SIGNED_IN = 'signedIn';
const SIGNED_OUT = 'signedOut';

const signOutAndRefresh = () =>
  signOut().finally(() => {
    // intercom('shutdown');
    window.location.replace('/');
  });

const redirectToSignIn = () => {
  window.location.replace('/login');
};

interface HeaderProps {
  webAppSection?: 'Application';
  applicationProgress?: number;
  status?: string;
  clearedForFunding?: boolean;
}

const url = () => {
  const searchString = window.location.href;
  if (searchString.includes('ledger-detail')) {
    return true;
  }

  return false;
};

const HeaderComponent = (props: HeaderProps) => {
  let history = useHistory();
  let location = useLocation();
  const [authStatus, setAuthStatus] = useState(AUTH_PENDING);
  const [payrollCompanyDetails, setPayrollCompanyDetails] =
    useRecoilState(payrollPartnerState);
  const [ledgerDetail, setLedgerDetail] = useState<any>();
  const userInfo = useRecoilValue(userInfoState);
  const [accountDetails, setAccountDetails] =
    useRecoilState<GetAccountDto>(accountRecordState);

  useEffect(() => {
    const authCheckInterval = setInterval(() => {
      isSignedIn()
        .then((res) => setAuthStatus(SIGNED_IN))
        .catch((err) => setAuthStatus(SIGNED_OUT));
    }, 2000);

    const ledger = url();
    if (ledger == true) {
      setLedgerDetail(true);
    }
    return () => clearInterval(authCheckInterval);
  }, [authStatus]);

  const authButton =
    authStatus == AUTH_PENDING ? (
      <div></div>
    ) : authStatus == SIGNED_IN ? (
      <p
        className="auth-button purple-text bold"
        onClick={signOutAndRefresh}
      >
        Logout
      </p>
    ) : authStatus == SIGNED_OUT ? (
      <p
        className="auth-button purple-text bold"
        onClick={redirectToSignIn}
      >
        Login
      </p>
    ) : (
      <div></div>
    );

  const brandedPage =
    payrollCompanyDetails &&
    payrollCompanyDetails.logo_url &&
    payrollCompanyDetails.logo_url.startsWith('https');

  //return seperate component for header in each stage of the application
  //payrol partner

  return (
    <>
      <div className="header-main-wrapper">
        <div
          className={
            'header-container' +
            (brandedPage ? ' branded' : '') +
            (ledgerDetail ? ' ledger-detail-header' : '') +
            (props.clearedForFunding &&
            props.webAppSection == undefined
              ? ' ledger-detail-header'
              : '') +
            (props.webAppSection ? ' ' + props.webAppSection : '') +
            (props.status && props.status != 'On Hold'
              ? ' ' + props.status
              : '')
          }
        >
          {props.clearedForFunding && (
            <>
              <div className="border-and-links-wrapper">
                <div className="grey-divider"></div>
                <div className="header-dashboard-links-wrapper">
                  <div
                    className={
                      location.pathname == '/dashboard'
                        ? 'link-and-icon-wrapper-selected'
                        : 'link-and-icon-wrapper'
                    }
                  >
                    {' '}
                    <img
                      className="header-icon"
                      onClick={() => {
                        history.push('/dashboard');
                      }}
                      src={
                        location.pathname == '/dashboard'
                          ? dashboardIconSelected
                          : dashboardIcon
                      }
                    ></img>
                    <p
                      onClick={() => {
                        history.push('/dashboard');
                      }}
                      className={
                        window.location.pathname == '/dashboard'
                          ? 'selected-header-link'
                          : 'not-selected-header-link'
                      }
                    >
                      Dashboard
                    </p>
                  </div>
                  <div
                    className={
                      location.pathname == '/ledger'
                        ? 'link-and-icon-wrapper-selected loans-link'
                        : 'link-and-icon-wrapper loans-link'
                    }
                  >
                    <img
                      className="header-icon"
                      onClick={() => history.push('/ledger')}
                      src={
                        location.pathname == '/ledger'
                          ? loansIconSelected
                          : loansIcon
                      }
                    ></img>
                    <p
                      onClick={() => history.push('/ledger')}
                      className={
                        location.pathname == '/ledger'
                          ? 'selected-header-link'
                          : 'not-selected-header-link'
                      }
                    >
                      Loans
                    </p>
                  </div>
                </div>
              </div>
              <div className="border-and-button-wrapper ">
                <div className="header-button-wrapper">
                  <PayroButton
                    disabled={
                      accountDetails.payro_finance_status ==
                        GetAccountDtoPayroFinanceStatusEnum.OnHold ||
                      accountDetails.payro_finance_status ==
                        GetAccountDtoPayroFinanceStatusEnum.Declined
                    }
                    startIcon={fundPayrollIcon}
                    customWidth="width-182"
                    onClick={() => history.push('/request-funding')}
                  >
                    Fund Payroll
                  </PayroButton>{' '}
                </div>
                <div className="grey-divider"></div>
              </div>
            </>
          )}

          {!brandedPage && (
            <div className="logo-div-wrapper">
              <img
                className="logo"
                onClick={() => window.location.replace('/')}
                src="/color-logo-new.svg"
                alt="image"
              />
            </div>
          )}
          {brandedPage && (
            <div
              id="branded-page-mobile" //only show logo on mobile view
              className="logo-div-wrapper"
            >
              <img
                className="logo"
                onClick={() => window.location.replace('/')}
                src="/color-logo-new.svg"
                alt="image"
              />
            </div>
          )}
          {brandedPage && (
            <div
              id="branded-page-desktop"
              className="payroll-partner-branding"
            >
              <img
                className="partner-logo"
                alt={payrollCompanyDetails.partner_name + ' logo'}
                src={payrollCompanyDetails.logo_url}
              />
              <div className="payroll-divider"></div>
              <div className="partnered-with-wrapper">
                <img
                  className="payro-logo-partner"
                  src={
                    'https://media.payrofinance.com/partner-logos/payro-logo.svg'
                  }
                />
                <h1 className="partnered-with">Payro Partner </h1>
              </div>
            </div>
          )}

          <div className="loan-stage">
            {props.applicationProgress && (
              <ProgressBar
                sectionName="Application Underwriting"
                percentComplete={props.applicationProgress}
              ></ProgressBar>
            )}
          </div>

          <div className="header-right-side">
            {authStatus === SIGNED_OUT ||
            authStatus === AUTH_PENDING ? (
              <>
                <div className="right-side-wrapper">
                  <div id="phone-icon-and-num-one">
                    <a
                      className="mobile-phone-section"
                      href="tel:18332714499"
                    >
                      <img
                        className="phone-icon"
                        src={PhoneIcon}
                        alt="image"
                        width={16.55}
                        height={16.55}
                      />
                    </a>

                    <img
                      className="desktop-phone-section phone-icon"
                      src={PhoneIcon}
                      alt="image"
                      width={16.55}
                      height={16.55}
                    />
                    <p className="desktop-phone-section phone-icon ">
                      {' '}
                      1-833-271-4499
                    </p>
                  </div>

                  <p className="grey-text header-phone-divider">|</p>
                  <div className="auth-button">{authButton}</div>
                </div>{' '}
              </>
            ) : (
              <>
                {!props.clearedForFunding && (
                  <div id="phone-icon-and-num">
                    <img
                      className="logout-icon"
                      src={LogoutIcon}
                      alt="image"
                      width={24}
                      height={24}
                      onClick={signOutAndRefresh}
                    />
                    <div className="auth-button">{authButton}</div>
                  </div>
                )}

                {Object.keys(userInfo).length !== 0 && (
                  <UserProfile></UserProfile>
                )}
              </>
            )}
          </div>
        </div>

        {brandedPage && (
          <>
            <div
              id="branded-page-mobile"
              className="partner-logo-wrapper"
            >
              <img
                className="partner-logo"
                alt={payrollCompanyDetails.partner_name + ' logo'}
                src={payrollCompanyDetails.logo_url}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default HeaderComponent;
