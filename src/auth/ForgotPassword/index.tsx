import React, {
  useState,
  useRef,
  useContext,
  useEffect,
} from 'react';
import {
  signIn,
  CognitoUserInfo,
  forgotPassword,
  forgotPasswordSubmit,
} from '../utils/auth-utils';
import './index.css';
import {} from 'aws-amplify';
import MfaCode from '../MfaCode';
import PayroInput from '../../widgets/PayroInput';
import PayroButton from '../../widgets/PayroButton';
import TitleSection from '../../Header/title-section';

import passwordNoIcon from '../SignUpForm/password-no-icon.png';
import passwordYesIcon from '../SignUpForm/password-yes-icon.png';
import { MessageContext } from '../../context';
import { useHistory, useParams } from 'react-router-dom';
import {
  emailforgotPasswordState,
  userContactInfoState,
} from '../../recoil-state/general-states';
import { useRecoilState } from 'recoil';
import Loader from '../../widgets/Loader';

const hasUpperCase = /[A-Z]/;
const hasLowerCase = /[a-z]/;
const hasNumbers = /\d/;
const isTenNumbers = /^[0-9]{10}$/;
const hasNonalphas = /\W/;

export default function ForgotPasswordForm() {
  let history = useHistory();

  const [codeSent, setCodeSent] = useState(false);
  const [email, setEmail] = useRecoilState(emailforgotPasswordState);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [userContactInfo, setUserContactInfo] = useRecoilState(
    userContactInfoState,
  );

  const messageContext = useContext(MessageContext);
  const validationFunctions: { [key: string]: boolean } = {
    newPassword:
      newPassword.length < 10 ||
      !hasUpperCase.test(newPassword) ||
      !hasLowerCase.test(newPassword) ||
      !hasNumbers.test(newPassword) ||
      !hasNonalphas.test(newPassword),
  };

  useEffect(() => {
    if (window.location.href.includes('reset')) {
      handleClick();
    }
  }, []);

  const handleClick = () => {
    if (!codeSent) {
      if (email.length < 1) {
        messageContext.addMessage({
          level: 'error',
          message: 'Incomplete Info',
        });
        return;
      }
      code.trim();
      forgotPassword(email);
      setCodeSent(true);
    } else {
      if (code.length < 6 || newPassword.length < 10) {
        messageContext.addMessage({
          level: 'error',
          message: 'Incomplete Info',
        });
        return;
      }
      forgotPasswordSubmit(email, code, newPassword)
        .then((res) => {
          if (window.location.href.includes('reset')) {
            messageContext.addMessage({
              level: 'info',
              message: 'Your password has been updated',
            });
            setTimeout(() => history.goBack(), 3000);
            // return <Loader message="Your password has been reset" />;
          } else {
            window.location.replace('/login');
          }

          // history.goBack();
        })
        .catch((err: any) => {
          messageContext.addMessage({
            level: 'error',
            message: 'Invalid Verification Code',
          });
        });
    }
  };

  return (
    <div id="forgot-password-page-wrapper" className="main-body">
      <TitleSection
        centered={true}
        title={
          window.location.pathname.includes('reset-password')
            ? 'Reset Password'
            : 'Forgot Password'
        }
        subtitle={
          !codeSent
            ? 'Enter your email that you used during your registration'
            : ` Please enter the verification code that was sent to ${email}`
        }
      />
      {!codeSent && (
        <div>
          <PayroInput
            onChange={(e) => {
              setEmail(e);
            }}
            required
            id="login-email"
            label="Email"
            value={email}
            placeholder="example@domain.com"
          />
        </div>
      )}
      {codeSent && (
        <>
          <div>
            <PayroInput
              onChange={(e: any) => {
                setCode(e.replace(/\s/g, ''));
              }}
              required
              id="login-password"
              label="Code"
              type="password"
              autoComplete="current-password"
              placeholder="Enter verification code"
            />
          </div>
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
        </>
      )}

      <PayroButton
        buttonSize="large"
        disabled={
          codeSent
            ? code.length != 6 || newPassword.length < 10
            : email.length < 5 ||
              email.indexOf('@') < 1 ||
              email.indexOf('.') < 3
        }
        centered
        className={'accent-background-color login-button'}
        onClick={(e: any) => {
          handleClick();
        }}
      >
        {codeSent ? 'Enter' : 'Continue'}
      </PayroButton>
    </div>
  );
}
