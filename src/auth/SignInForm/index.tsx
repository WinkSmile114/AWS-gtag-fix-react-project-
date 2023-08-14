import React, {
  useState,
  useRef,
  useEffect,
  useContext,
} from 'react';
import { useLocation } from 'react-router-dom';
import { signIn, getJwt, CognitoUserInfo } from '../utils/auth-utils';
import { getClient } from '../../api-utils/general-utils';
import './SignIn.css';
import {} from 'aws-amplify';
import MfaCode from '../MfaCode';
import PayroInput from '../../widgets/PayroInput';
import PayroButton from '../../widgets/PayroButton';
import TitleSection from '../../Header/title-section';
import { MessageContext } from '../../context';
import ConfirmEmail from '../ConfirmEmail';

enum FormToShowOptions {
  MFA,
  SIGN_IN,
  EMAIL_CONFIRMATION,
}

export default function SignInForm() {
  const location = useLocation();
  const [attemptedSignIn, setAttemptedSignIn] = useState(false);
  const [cognitoUser, setCognitoUser] = useState<any | undefined>(
    undefined,
  );
  const [formToShow, setFormToShow] = useState<FormToShowOptions>(
    FormToShowOptions.SIGN_IN,
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginFlow, setLoginFlow] = useState<
    'temporarypassword' | undefined
  >();
  const messageContext = useContext(MessageContext);

  useEffect(() => {
    let searchString = location.search;
    let searchParams = new URLSearchParams(searchString);
    const flow = searchParams.get('flow');

    if (flow === 'temporarypassword') {
      setLoginFlow(flow);
      messageContext.addMessage({
        message:
          'It looks like we have your email already in our system.  In order to connect your online account, a temporary password has been sent to your email. Please login with your email and temporary password below',
        level: 'error',
      });
    }
  }, []);

  const onSubmit = () => {
    messageContext.clearMessages();
    signIn(email, password)
      .then((user) => {
        setAttemptedSignIn(true);
        if (user) {
          setCognitoUser(user);
          setFormToShow(FormToShowOptions.MFA);
        }
      })
      .catch((err) => {
        if (err.message === 'User is not confirmed.') {
          localStorage.setItem('email', email);
          localStorage.setItem('password', password);
          setFormToShow(FormToShowOptions.EMAIL_CONFIRMATION);
        } else {
          messageContext.addMessage({
            message: err.message,
            level: 'error',
          });
        }
      });
  };

  switch (formToShow) {
    case FormToShowOptions.MFA:
      return (
        <MfaCode
          email={email}
          password={password}
          cognitoUser={cognitoUser}
        />
      );
    case FormToShowOptions.EMAIL_CONFIRMATION:
      return (
        <ConfirmEmail
          needToResendCognitoEmailVerificationCode={true}
        />
      );
    case FormToShowOptions.SIGN_IN:
      const STANDARD_LOGIN_MSG =
        'Login with your data that you entered during your registration';
      const TEMP_PWD_LOGIN_MSG =
        'Login with your email and your temporary password that has been sent to your email';
      return (
        <div id="sign-in-page">
          <div className="sign-in-background-image">
            <img
              id="sign-in-background-image-one"
              src="https://media.payrofinance.com/sign-in-background-image-one.svg"
            />
          </div>

          <div id="login-page-wrapper" className="main-body">
            <TitleSection
              centered={true}
              title="Login"
              subtitle={
                loginFlow == 'temporarypassword'
                  ? TEMP_PWD_LOGIN_MSG
                  : STANDARD_LOGIN_MSG
              }
            />
            <form
              onSubmit={(e: any) => {
                e.preventDefault();
                onSubmit();
              }}
            >
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
              <div>
                <PayroInput
                  onChange={(e: any) => {
                    setPassword(e);
                  }}
                  required
                  id="login-password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                />
              </div>

              <div id="login-button-wrapper">
                <PayroButton
                  buttonSize="large"
                  disabled={!password || !email}
                  isFormSubmit={true}
                >
                  Login
                </PayroButton>
              </div>
            </form>
            <div className="login-subtexts">
              <p
                className="centered-text"
                onClick={() => window.location.replace('/sign-up')}
              >
                Don't have an account?{' '}
                <span className="bold purple-text">Sign Up!</span>
              </p>
              <p
                className="purple-text bold centered-text"
                onClick={() =>
                  window.location.replace('/forgot-password')
                }
              >
                Forgot Password?
              </p>
            </div>
          </div>
          <div className="sign-in-background-image">
            <img
              id="sign-in-background-image-two"
              src="https://media.payrofinance.com/sign-in-background-image-two.svg"
            />
          </div>
        </div>
      );
  }
}
