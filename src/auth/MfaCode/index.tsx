import { useContext, useEffect, useState } from 'react';
import {
  createPassword,
  enterMfa,
  getCurrentAuthUser,
  getJwt,
  signIn,
} from '../utils/auth-utils';
import './MfaCode.css';
import { createAccount } from '../../api-utils/account-utils';
import PayroButton from '../../widgets/PayroButton';
import PayroInput from '../../widgets/PayroInput';
import FiniteNumbersGroup from '../../widgets/FiniteNumbersGroup';
import TitleSection from '../../Header/title-section';
import { getClient } from '../../api-utils/general-utils';
import LockIcon from './lock-icon.png';
import { MessageContext } from '../../context';
import Loader from '../../widgets/Loader';
import { setTimeout } from 'timers';
import ForgotPassword from '../ForgotPassword';
import passwordNoIcon from '../SignUpForm/password-no-icon.png';
import passwordYesIcon from '../SignUpForm/password-yes-icon.png';
import { logGreen, logOrange } from '../../common-utils';

interface MfaCodeProps {
  email: string;
  password: string;
  cognitoUser: any;
}
enum FormToShowOptions {
  MFA,
  SIGN_IN,
  FORGOT_PASSWORD,
}

const hasUpperCase = /[A-Z]/;
const hasLowerCase = /[a-z]/;
const hasNumbers = /\d/;
const isTenNumbers = /^[0-9]{10}$/;
const hasNonalphas = /\W/;

export default function MfaCode({
  cognitoUser,
  email,
  password,
}: MfaCodeProps) {
  const [mfaCode, setMfaCode] = useState('');
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [theCognitoUser, setTheCognitoUser] =
    useState<any>(cognitoUser);
  const [resendButtonAbility, setResendButtonAbility] =
    useState(true);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [formToShow, setFormToShow] = useState<FormToShowOptions>(
    FormToShowOptions.SIGN_IN,
  );
  const [newPassword, setNewPassword] = useState('');
  const [reload, setReload] = useState(false);
  const messageContext = useContext(MessageContext);
  function clear() {
    messageContext.clearMessages();
    setResendButtonAbility(true);
  }

  const resendMfa = () => {
    setResendButtonAbility(false);

    messageContext.addMessage({
      level: 'resent',
      message: `A new 6 digit code was sent to your phone`,
    });

    setTimeout(() => clear(), 5000);

    signIn(email, password)
      .then((res) => {
        logGreen('sign in res', res);
        setTheCognitoUser(res);
      })
      .catch((err) => {
        logOrange('sign in err', err);
      });
  };

  useEffect(() => {
    if (!creatingAccount) {
      return;
    }
    messageContext.clearMessages();
    getCurrentAuthUser().then((authUser) => {
      if (messageContext.messages.length > 0) {
        messageContext.popMessage(messageContext.messages.length - 1);
      }
      if (!authUser.attributes['custom:accountUuid']) {
        getClient().then((client) => {
          if (client) {
            client
              .accountsControllerCreateFromIdToken()
              .then(() => {
                localStorage.removeItem('email');
                localStorage.removeItem('password');
                window.location.replace('/');
              })
              .catch((err: any) => {
                messageContext.addMessage({
                  level: 'error',
                  message: err.response.data.message,
                });
              });
          }
        });
      }
    });
  }, [creatingAccount, !reload]);

  const onSubmit = async (mfaCode: any) => {
    messageContext.clearMessages();
    try {
      await enterMfa(theCognitoUser, mfaCode);
      setIsNextDisabled(true);
    } catch (err: any) {

      messageContext.clearMessages();
      let customErrorMessage = '';
      const errorType = err.name
      if (errorType === 'CodeMismatchException') {
        customErrorMessage =
          'Incorrect code. Just backspace the code you put in and try again.  For your security, you will not get many chances, so try to get it right the next time.';
      } else if (errorType === 'ExpiredCodeException') {
        customErrorMessage =
          'Your code has expired. Press the resend code option below and try entering the new code you get.';
      } else if (errorType === 'NotAuthorizedException') {
        customErrorMessage =
          'It does not appear you are authorized to do this.';
      }

      messageContext.addMessage({
        level: 'error',
        message: customErrorMessage,
      });
      setIsNextDisabled(true);
    }

    const authUser: any = await getCurrentAuthUser();

    if (!authUser.attributes['custom:accountUuid']) {
      setCreatingAccount(true);
    } else {
      window.location.replace('/');
      localStorage.removeItem('email');
      localStorage.removeItem('password');
    }
  };

  //const enterButtonDisbled = false
  //setIsNextDisabled(mfaCode.length < 6 || mfaCode.length > 6)

  if (creatingAccount == true) {
    return (
      <Loader message="Hold on a moment while we set up your account" />
    );
  }
  // if(cognitoUser.challengeName=="NEW_PASSWORD_REQUIRED"){
  //  // setFormToShow(FormToShowOptions.FORGOT_PASSWORD)
  //  return  <ForgotPassword emailProp={email} cognitoUser={cognitoUser}/>
  // }

  return (
    <>
      {cognitoUser.challengeName != 'NEW_PASSWORD_REQUIRED' ? (
        <div id="mfa-code-page-wrapper" className="main-body">
          <TitleSection
            centered={true}
            titleIcon={LockIcon}
            title="2-Factor Verification"
            subtitle={`We've sent a 6 digit code to  ${cognitoUser && cognitoUser.challengeParam && cognitoUser.challengeParam.CODE_DELIVERY_DESTINATION}. Please enter the code below.
        `}
          />
          <FiniteNumbersGroup
            valueFilledCallback={async (newVal: string) => {
              await setMfaCode(newVal);
              await onSubmit(newVal);
            }}
          />
          <p id="bad-phone">
            If the number above cannot receive SMS text messages or is
            incorrect, please call us at 1-833-271-4449 or email
            processing@payrofinance.com.
          </p>

          <div className="submit-mfa-section">
            <p className="resend-code-section">
              Didn't receive the code?{' '}
              <span
                className="resend-code-text"
                onClick={() =>
                  resendButtonAbility
                    ? resendMfa()
                    : console.log('wait five sec')
                }
              >
                Resend Code
              </span>
            </p>
            <PayroButton
              className={'accent-background-color'}
              disabled={isNextDisabled || mfaCode.length != 6}
              onClick={() =>
                onSubmit(mfaCode).then((_) => console.log('success'))
              }
              buttonSize="small"
              variant="purple"
            >
              Verify
            </PayroButton>
          </div>
        </div>
      ) : (
        <div id="forgot-password-page-wrapper" className="main-body">
          <TitleSection
            centered={true}
            title="Set Your Password"
            subtitle={'Enter your new 10 digit password'}
          />

          <div>
            <PayroInput
              onChange={(e: any) => {
                setNewPassword(e);
              }}
              required
              id="login-password"
              label="New Password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your new password"
              //error={newPassword !='' && validationFunctions.newPassword}
            />
          </div>
          <div className="password-info-message">
            <span className="password-error-text">
              <img
                className="password-icon"
                src={
                  newPassword.length < 10
                    ? passwordNoIcon
                    : passwordYesIcon
                }
                height={18}
                width={18}
              ></img>
              10 characters{' '}
            </span>
            <span className="password-error-text">
              <img
                className="password-icon"
                src={
                  !hasUpperCase.test(newPassword)
                    ? passwordNoIcon
                    : passwordYesIcon
                }
                height={18}
                width={18}
              ></img>
              Uppercase{' '}
            </span>
          </div>
          <div className="password-info-message-two">
            <span className="password-error-text">
              <img
                className="password-icon"
                src={
                  !hasLowerCase.test(newPassword)
                    ? passwordNoIcon
                    : passwordYesIcon
                }
                height={18}
                width={18}
              ></img>
              Lowercase
            </span>
            <span className="password-error-text">
              <img
                className="password-icon"
                src={
                  !hasNumbers.test(newPassword)
                    ? passwordNoIcon
                    : passwordYesIcon
                }
                height={18}
                width={18}
              ></img>
              Number
            </span>
          </div>
          <div className="password-info-message-three">
            <span className="password-error-text">
              <img
                className="password-icon"
                src={
                  !hasNonalphas.test(newPassword)
                    ? passwordNoIcon
                    : passwordYesIcon
                }
                height={18}
                width={18}
              ></img>
              Special Character
            </span>
          </div>

          <PayroButton
            buttonSize="large"
            disabled={
              newPassword.length < 10 ||
              !hasUpperCase.test(newPassword) ||
              !hasLowerCase.test(newPassword) ||
              !hasNumbers.test(newPassword) ||
              !hasNonalphas.test(newPassword)
            }
            centered
            className={'accent-background-color login-button'}
            onClick={() => {
              createPassword(
                cognitoUser,
                newPassword,
                cognitoUser.challengeParam.userAttributes.given_name,
                cognitoUser.challengeParam.userAttributes.family_name,
              )
                .then(() => {
                  setReload(!reload);
                })
                .catch((err: any) => {
                  messageContext.addMessage({
                    level: 'error',
                    message: 'Invalid Verification Code',
                  });
                });
            }}
          >
            Enter
          </PayroButton>
        </div>
      )}
    </>
  );
}
