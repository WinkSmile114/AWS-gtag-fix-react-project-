import React, { useState, useContext, useEffect } from 'react';
import {
  confirmSignUp,
  signIn,
  resendConfirmationCode as resendCognitoEmailConfirmationCode,
} from '../utils/auth-utils';
import { SHOW_EMAIL_CONFIRMATION_FORM } from '../utils/constants';
import './ConfirmEmail.css';
import MfaCode from '../MfaCode';

import TitleSection from '../../Header/title-section';
import PayroButton from '../../widgets/PayroButton';

import EmailIcon from './email-icon.png';
import FiniteNumbersGroup from '../../widgets/FiniteNumbersGroup';
import { MessageContext } from '../../context';
import ChangeEmail from '../ChangeEmail';

enum PageOptions {
  CONFIRM_EMAIL,
  MFA_CODE,
  CHANGE_EMAIL,
}

export default function ConfirmEmail(props: any) {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [successfullyConfirmed, setSuccessfullyConfirmed] =
    useState(false);
  const [cognitoUser, setCognitoUser] = useState<any>(undefined);
  const [pageToShow, setPageToShow] = useState<PageOptions>(
    PageOptions.CONFIRM_EMAIL,
  );
  const [resendButtonAbility, setResendButtonAbility] =
    useState(true);
  const [isNextDisabled, setIsNextDisabled] = useState(false);

  const messageContext = useContext(MessageContext);

  const email = localStorage.getItem('email');
  const password = localStorage.getItem('password');

  const forceResendMfa = () => {
    if (!email || !password) {
      alert('technical glitch');
      return;
    }
    signIn(email, password);
  };
  function clear() {
    messageContext.clearMessages();
    setResendButtonAbility(true);
  }

  const resendConfirmationCode = () => {
    setResendButtonAbility(false);
    if (email) {
      resendCognitoEmailConfirmationCode(email);
    }
    if (!props.needToResendCognitoEmailVerificationCode) {
      messageContext.addMessage({
        level: 'resent',
        message: `A new 6 digit code was sent to ${email}`,
      });
    }

    setTimeout(() => clear(), 5000);
  };

  const onSubmit = (confirmationCode: any) => {
    messageContext.clearMessages();

    if (!email || !password) {
      alert('techical glitch');
      return;
    }
    setIsNextDisabled(true);
    confirmSignUp(email, confirmationCode)
      .then((res) => {
        localStorage.removeItem(SHOW_EMAIL_CONFIRMATION_FORM);

        setSuccessfullyConfirmed(true);
        signIn(email, password).then((user) => {
          setCognitoUser(user);
          setPageToShow(PageOptions.MFA_CODE);
        });
      })
      .catch((error) => {
        messageContext.addMessage({
          level: 'error',
          message: error.message,
        });
      });
  };
  useEffect(() => {
    if (props.needToResendCognitoEmailVerificationCode) {
      resendConfirmationCode();
    }
  }, []);

  switch (pageToShow) {
    case PageOptions.MFA_CODE:
      if (!email || !password) {
        return <div>Error</div>;
      }
      return (
        <MfaCode
          email={email}
          password={password}
          cognitoUser={cognitoUser}
        />
      );

    case PageOptions.CHANGE_EMAIL:
      if (!email || !password) {
        return <div>Error</div>;
      }
      return <ChangeEmail />;

    case PageOptions.CONFIRM_EMAIL:
      return (
        <div id="confirm-email-wrapper" className="main-body">
          <TitleSection
            centered={true}
            titleIcon={EmailIcon}
            title="Verify your email"
            subtitle={`We've sent a 6 digit code to ${localStorage.getItem(
              'email',
            )} Please enter the code below.`}
          />

          <FiniteNumbersGroup
            valueFilledCallback={async (newVal: string) => {
              await setConfirmationCode(newVal);
              setIsNextDisabled(false);
              await onSubmit(newVal);
            }}
          />

          <div className="confirm-email-section">
            <p className="resend-code-section">
              Didn't receive the email?{' '}
              <span
                className="resend-code-text"
                onClick={() =>
                  resendButtonAbility
                    ? resendConfirmationCode()
                    : console.log('wait five sec')
                }
              >
                Resend Email
              </span>
            </p>
            <p className="resend-code-section">
              Wrong email address?{' '}
              <span
                className="resend-code-text"
                onClick={() =>
                  setPageToShow(PageOptions.CHANGE_EMAIL)
                }
              >
                Change Email
              </span>
            </p>
            <PayroButton
              className={'accent-background-color'}
              disabled={
                isNextDisabled || confirmationCode.length != 6
              }
              onClick={() => onSubmit(confirmationCode)}
              variant="purple"
            >
              Verify
            </PayroButton>
          </div>
        </div>
      );
  }
}
