import { useEffect, useState } from 'react';
import './App.css';
import { Auth } from 'aws-amplify';
import { ErrorBoundary } from 'react-error-boundary';
import * as FullStory from '@fullstory/browser';
import Header from './Header';
import Footer from './Footer';
import SignIn from './auth/SignInForm';
import ApplicationHomePage from './pages/Application/ApplicationHomePage';
import {
  getCurrentAuthUser,
  getJwt,
  signOut,
} from './auth/utils/auth-utils';
import ForgotPassword from './auth/ForgotPassword';
import ActivatePortalAccountForPreexistingSfAccount from './auth/activatePortalAccountForSfAccount';
import PlaidLinkUpdate from './PlaidLinkUpdate';
import { MessageContext, AppMessage } from './context';
import { intercom } from './intercom';

import ApplicationStatus from './pages/Underwriting-Decision/application-status';
import { getClient } from './api-utils/general-utils';
import Loader from './widgets/Loader';
import {
  DefaultApi,
  GetAccountDtoPayroFinanceStatusEnum,
  GetAccountDtoFundingStatusEnum,
  GetAccountStatusDtoFundingStatusEnum,
  Opportunity,
  OpportunityStageEnum,
  UserObject,
  GetRepaymentDto,
  GetAccountDto,
} from './api-utils/generated-client';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  accountRecordState,
  opportunityState,
  repaymentsState,
  userInfoState,
} from './recoil-state/general-states';
import TermsAndConditions from './auth/TermsAndConditions';
import RequestFunding from './pages/RequestFunding';
import EditMyProfile from './UserProfile/EditMyProfile';
import axios from 'axios';
import LedgerDetail from './pages/Ledger/LedgerDetail';
import PaymentScheduled from './pages/Ledger/LedgerDetail/PaymentScheduled';

import {
  Route,
  BrowserRouter,
  Switch,
  Redirect,
  useHistory,
} from 'react-router-dom';

import SignUpForm from './auth/SignUpForm';
import Alert from './widgets/Alert';
import LedgerHome from './pages/Ledger/LedgerHome';
import ScheduleTime from './pages/Underwriting-Decision/schedule-time';
import Dashboard from './pages/Dashboard';
import PaymentFailed from './pages/Ledger/LedgerDetail/PaymentFailed/PaymentFailed';
import Funded from './pages/RequestFunding/Funded';
import MeetingScheduled from './pages/Dashboard/RequestMoreCredit/MeetingScheduled';
import MeetingPending from './pages/Dashboard/RequestMoreCredit/MeetingPending';
import RequestMoreCreditForm from './pages/Dashboard/RequestMoreCredit/RequestMoreCreditForm';
import PortalInaccessiblePage from './pages/PortalInaccessible/PortalInaccessiblePage';
import Policies from './pages/Policies/policies';
import PayroBankingInfo from './pages/Payro/PayroBankingInfo';
import ChangeEmail from './UserProfile/ChangeEmail';
import PlaidConnector from './widgets/PlaidConnector';
import ConnectPlaid from './pages/ConnectPlaid';
import ConnectPlaidDebug from './pages/ConnectPlaidDebug';
import MySettings from './UserProfile/MySettings/mySettings';
import WireInfo from './pages/WireInfo';
import { useIdleTimer } from 'react-idle-timer';
import ChangePhone from './UserProfile/ChangePhone';
// import TagManager from 'react-gtm-module';

// import ReactGA from 'react-ga';
// //   const TRACKING_ID = "UA-281794877-1"; // OUR_TRACKING_ID
//   ReactGA.initialize('UA-281794877-1');

// const tagManagerArgs={
//     gtmId:'GTM-P88NWTZW',
//     dataLayer: {event: 'pageview'},
// }
// TagManager.initialize(tagManagerArgs)

function App() {
  // const useAnalyticsEventTracker = (category="Blog category") => {
  //   const eventTracker = (action = "test action", label = "test label") => {
  //     ReactGA.event({category, action, label});
  //   }
  //   return eventTracker;
  // }
  // const gaEventTracker = useAnalyticsEventTracker('Contact us');
  let history = useHistory();
  const [userInfo, setUserInfo] =
    useRecoilState<Partial<UserObject>>(userInfoState);

  const setAccountDetail = useSetRecoilState<Partial<GetAccountDto>>(
    accountRecordState,
  );

  const [userJwt, setUserJwt] = useState<any>(null);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [payroFinanceStatus, setPayroFinanceStatus] =
    useState<GetAccountDtoPayroFinanceStatusEnum>();
  const [fundingStatus, setFundingStatus] =
    useState<GetAccountDtoFundingStatusEnum>();
  const [opportunities, setOpportunities] = useRecoilState<
    Opportunity[] | undefined
  >(opportunityState);
  const [repayments, setRepayments] = useRecoilState<
    GetRepaymentDto[] | undefined
  >(repaymentsState);
  const [messages, setMessages] = useState<AppMessage[]>([]);
  const [isPortalAccessible, setIsPortalAccessible] =
    useState<boolean>();

  const [
    applicationSectionScreenName,
    setApplicationSectionScreenName,
  ] = useState<string>();

  const [activeOrIdleState, setActiveOrIdleState] =
    useState<string>('Active');
  const [count, setCount] = useState<number>(0);
  const [remaining, setRemaining] = useState<number>(0);
  const [hasLoggedOutMessage, setHasLoggedOutMessage] =
    useState(false);
  const addMessage = (newMessage: AppMessage) => {
    setMessages([...messages, newMessage]);
  };

  const checkAuth = async () => {
    const userJwt = await getJwt();

    if (!userJwt) {
      setCheckedAuth(true);
      return;
    }

    setUserJwt(userJwt);
    setCheckedAuth(true);
    return userJwt;
  };
  const getIsAccountAccessible = async () => {
    const client: DefaultApi | undefined = await getClient();
    if (!client) {
      return;
    }
    const isAccountAccessible =
      await client.portalAccessControllerGetIsPortalAccessible();

    if ((isAccountAccessible.data as unknown as boolean) == true) {
      setIsPortalAccessible(true);
    } else {
      setIsPortalAccessible(false);
    }
    return isAccountAccessible.data as unknown as boolean;
  };
  const onIdle = async () => {
    setActiveOrIdleState('Idle');
    try {
      const authUser = await getCurrentAuthUser();
      if (authUser) {
        signOut();

        if (!hasLoggedOutMessage) {
          addMessage({
            title: 'Logged Out',
            message: 'You have been logged out due to inactivity',
            level: 'info',
          });
          setHasLoggedOutMessage(true);
          setTimeout(() => window.location.replace('/login'), 5000);
        }
      }
    } catch (err) {
      console.log('User is not logged in.');
      window.location.replace('/login');
    }
  };

  const onActive = () => {
    setActiveOrIdleState('Active');
  };

  const onAction = () => {
    setCount(count + 1);
  };

  const fifteenMinutes = 15 * 60 * 1000;
  const { getRemainingTime } = useIdleTimer({
    onIdle,
    onActive,
    onAction,
    timeout: fifteenMinutes,
    throttle: 500,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.ceil(getRemainingTime() / 1000));
    }, 500);

    return () => {
      clearInterval(interval);
    };
  });

  useEffect(() => {
    const getAccountStatus = async () => {
      const client: DefaultApi | undefined = await getClient();
      if (!client) {
        return;
      }

      client
        .accountsControllerGetMyInfo()
        .then(async (accountInfo) => {
          setAccountDetail(accountInfo.data);

          setPayroFinanceStatus(
            accountInfo.data
              .payro_finance_status as GetAccountDtoPayroFinanceStatusEnum,
          );

          setFundingStatus(
            accountInfo.data
              .funding_status as GetAccountDtoFundingStatusEnum,
          );

          const { username } = await getCurrentAuthUser();
          const { attributes } = await Auth.currentUserInfo();
          if (userJwt && userInfo?.cognito_username && attributes) {
            intercom(attributes.given_name, attributes.email);
          }
          // if (userJwt && userInfo?.cognito_username) {
          //   chilipiper(
          //     userJwt,
          //     attributes.email,
          //     attributes.given_name,
          //     userInfo?.cognito_username,
          //   );
          // }
          if (username && attributes) {
            FullStory.identify(username, {
              displayName: accountInfo.data.legal_name,
              email: attributes.email,
            });
          }
        });

      client.userInfoControllerGetUserInfo().then((userInfoRes) => {
        if (userInfoRes.data.current_screen == 'OwnerInfo') {
          userInfoRes.data.current_screen = 'CompanyInfo';
        }
        if (userInfoRes.data.furthest_screen == 'OwnerInfo') {
          userInfoRes.data.furthest_screen = 'CompanyInfo';
        }
        setUserInfo(userInfoRes.data);
        setApplicationSectionScreenName(
          userInfoRes.data.current_screen,
        );
      });
    };

    const getOpportunities = async () => {
      const client: DefaultApi | undefined = await getClient();
      if (!client) {
        return;
      }
      const opportunitiesapi =
        await client.opportunitiesControllerFindAll();

      setOpportunities(opportunitiesapi.data);
    };

    const getRepayments = async () => {
      const client: DefaultApi | undefined = await getClient();
      if (!client) {
        return;
      }
      const dealsRes = await client.dealsControllerFindAll();

      setRepayments(dealsRes.data.loans);
    };

    const getAll = async () => {
      getAccountStatus();
      getRepayments();
      getOpportunities();
    };

    checkAuth().then((jwt) => {
      if (jwt) {
        getIsAccountAccessible().then((res) => {
          if (res) {
            // console.log(res, 'if');
            getAll();
          } else {
            // console.log(res, 'else');
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API}/announcements`)
      .then((res) => {
        const actualAnnouncements: any[] = res.data.announcements;
        if (actualAnnouncements.length > 0) {
          addMessage({
            title: actualAnnouncements[0].title,
            level: actualAnnouncements[0].type,
            message: actualAnnouncements[0].body,
          });
        }
      })
      .catch((err) => {
        addMessage({
          title: 'Technical Difficulties',
          level: 'error',
          message:
            'Online access is currently unavailable.  We apologize for the inconvenience.  Please call us at 1-833-271-4499 for all of your Payro needs.',
        });
      });

      // TagManager.initialize(tagManagerArgs)
  }, []);

  if (!checkedAuth) {
    return <div>...Please Wait</div>;
  }

  const messagesToDisplay = messages.map((message, i) => (
    <Alert key={`message-${i}`} appMessage={message} indexOfMe={i} />
  ));

  const setScreenNames = (
    newScreenName: string,
    furthestScreen: string,
  ) => {
    setApplicationSectionScreenName(newScreenName);
  };

  const getComponentForDefaultRoute = () => {
    if (!userJwt) {
      return <SignIn />;
    }
    if (!payroFinanceStatus || !opportunities || !repayments) {
      return <Loader />;
    }

    const mostRecentOpportunity = opportunities[0];

    switch (payroFinanceStatus) {
      case GetAccountDtoPayroFinanceStatusEnum.New:
        if (
          mostRecentOpportunity.stage ===
            OpportunityStageEnum.NeedInfoFromCustomer &&
          !userInfo!.document_signature_hash
        ) {
          return (
            <ApplicationHomePage
              setScreenNamesOnAppPage={setScreenNames}
            />
          );
        } else if (
          mostRecentOpportunity.stage ===
            OpportunityStageEnum.PendingDecision ||
          mostRecentOpportunity.stage ===
            OpportunityStageEnum.NeedInfoFromCustomer
        ) {
          return <ApplicationStatus />;
        }
        break;
      case GetAccountDtoPayroFinanceStatusEnum.Approved:
        if (fundingStatus === GetAccountDtoFundingStatusEnum.Yes) {
          const hasCompletedRepayments = repayments.some((r) => {
            return r.status !== 'New';
          });
          if (hasCompletedRepayments) {
            return <Redirect to="/dashboard" />;
          } else {
            return <RequestFunding section="onboarding" />;
          }
        } else if (
          fundingStatus === GetAccountDtoFundingStatusEnum.No
        ) {
          return <RequestFunding section="onboarding" />;
        }
        break;
      case GetAccountDtoPayroFinanceStatusEnum.Declined:
        return <ApplicationStatus />;
      case GetAccountDtoPayroFinanceStatusEnum.OnHold:
        return <Redirect to="/dashboard" />;
    }
  };

  const isInApplicationSection =
    payroFinanceStatus === GetAccountDtoPayroFinanceStatusEnum.New;
  const applicationSectionProgress = !isInApplicationSection
    ? undefined
    : !userInfo
    ? undefined
    : applicationSectionScreenName === 'SignAgreements' &&
      userInfo.document_signature_hash !== undefined
    ? 100
    : applicationSectionScreenName === 'CompanyInfo'
    ? 1 //displays as 0
    : applicationSectionScreenName === 'OwnerInfo'
    ? 15
    : applicationSectionScreenName === 'PayrollInfo'
    ? 25
    : applicationSectionScreenName === 'BankInfo'
    ? 50
    : applicationSectionScreenName === 'SignAgreements'
    ? 75
    : 100;

  interface ErrorFallbackProps {
    error: Error;
    resetErrorBoundary: Function;
  }

  function ErrorFallback(errorFallbackProps: ErrorFallbackProps) {
    return (
      <div role="alert">
        <p>Something went wrong:</p>
        <pre>{errorFallbackProps.error.message}</pre>
        <button onClick={(el) => errorFallbackProps.resetErrorBoundary()}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="App">
      {/* <a href="#" onClick={()=>gaEventTracker('call')}>Call Us</a> */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <MessageContext.Provider
          value={{
            messages: messages,
            addMessage: addMessage,
            popMessage: () => {
              if (messages.length > 0) {
                let messageCopy = [...messages];
                messageCopy.splice(messages.length - 1, 1);
                setMessages(messageCopy);
              }
            },
            clearMessages: () => {
              setMessages([]);
            },
          }}
        >
          {messages && messages.length > 0 && (
            <div className="alert-container">
              <div className="actual-alerts">{messagesToDisplay}</div>
            </div>
          )}

          <BrowserRouter>
            <Header
              webAppSection={
                isInApplicationSection ? 'Application' : undefined
              }
              status={payroFinanceStatus}
              clearedForFunding={
                //  fundingStatus ===
                // GetAccountDtoFundingStatusEnum.Yes &&
                repayments?.some((r) => {
                  return r.status != 'New';
                })
                  ? true
                  : false
              }
              applicationProgress={
                isInApplicationSection
                  ? applicationSectionProgress
                  : undefined
              }
            />
            <Switch>
              {/* {hasLoggedOutMessage && <Redirect to="/" />} */}
              <Route path="/portal-inaccessible">
                <PortalInaccessiblePage />
              </Route>
              {isPortalAccessible == false && (
                <Redirect to="/portal-inaccessible" />
              )}

              <Route path="/sign-up">
                {userJwt ? <Redirect to="/" /> : <SignUpForm />}
              </Route>

              <Route path="/login">
                {userJwt ? (
                  <Redirect to="/" />
                ) : (
                  <>
                    <SignIn />
                  </>
                )}
              </Route>
              <Route path="/forgot-password">
                <ForgotPassword />
              </Route>
              {/* <Route path="/reset-password">
                <ForgotPassword />
              </Route> */}
              <Route path="/legal-policies">
                <Policies />
              </Route>
              <Route path="/activateportalaccount">
                <ActivatePortalAccountForPreexistingSfAccount />
              </Route>
              <Route path="/connect-bank">
                <ConnectPlaid />
              </Route>
              <Route path="/connect-bank-debug">
                <ConnectPlaidDebug />
              </Route>
              <Route path="/plaidlinkupdatemode">
                <PlaidLinkUpdate />
              </Route>

              <Route path="/terms-and-conditions">
                <TermsAndConditions />
              </Route>

              <Route path="/schedule-time">
                <div className="underwriting-review-wrapper">
                  {userJwt ? <ScheduleTime /> : <ScheduleTime />}
                </div>
              </Route>
              <Route path="/application-status">
                <div className="underwriting-review-wrapper">
                  {userJwt ? (
                    <ApplicationStatus />
                  ) : (
                    <ApplicationStatus />
                  )}
                </div>
              </Route>

              <Route path="/request-initial-funding">
                {userJwt ? (
                  <RequestFunding section="onboarding" />
                ) : (
                  <SignUpForm />
                )}
              </Route>
              <Route path="/request-funding">
                {userJwt ? (
                  <RequestFunding section={'more-funding'} />
                ) : (
                  <SignUpForm />
                )}
              </Route>
              <Route path="/funded">
                {userJwt ? <Funded /> : <SignUpForm />}
              </Route>
              <Route path="/ledger">
                {userJwt ? <LedgerHome /> : <SignUpForm />}
              </Route>
              <Route path="/ledger-detail/:id">
                {userJwt ? (
                  payroFinanceStatus &&
                  opportunities &&
                  repayments ? (
                    <LedgerDetail />
                  ) : (
                    <Loader />
                  )
                ) : (
                  <SignUpForm />
                )}
              </Route>
              <Route path="/dashboard">
                {userJwt ? <Dashboard /> : <SignUpForm />}
              </Route>
              <Route path="/wire-info">
                {userJwt ? <WireInfo /> : <SignUpForm />}
              </Route>
              <Route path="/settings/:id">
                {userJwt ? <MySettings /> : <MySettings />}
              </Route>
              <Route path="/settings">
                {userJwt ? <MySettings /> : <MySettings />}
              </Route>
              <Route path="/banking-info">
                {userJwt ? <PayroBankingInfo /> : <SignUpForm />}
              </Route>
              <Route path="/edit-email/">
                {userJwt ? <ChangeEmail /> : <SignUpForm />}
              </Route>
              <Route path="/edit-phone/">
                {userJwt ? <ChangePhone /> : <SignUpForm />}
              </Route>
              <Route path="/payment-scheduled">
                {userJwt ? <PaymentScheduled /> : <SignUpForm />}
              </Route>
              <Route path="/payment-failed">
                {userJwt ? <PaymentFailed /> : <SignUpForm />}
              </Route>
              <Route path="/request-credit">
                {userJwt ? <RequestMoreCreditForm /> : <SignUpForm />}
              </Route>
              {/* <Route path="/meeting-scheduled">
                {userJwt ? <MeetingScheduled /> : <SignUpForm />}
              </Route>
              <Route path="/meeting-pending">
                {userJwt ? <MeetingPending /> : <SignUpForm />}
              </Route> */}

              <Route path="/">{getComponentForDefaultRoute()}</Route>
            </Switch>
            <Footer></Footer>
          </BrowserRouter>
        </MessageContext.Provider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
