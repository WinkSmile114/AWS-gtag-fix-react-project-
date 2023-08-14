import React, { useState } from 'react';

import SignInForm from '../SignInForm';
import SignUpForm from '../SignUpForm';
import ConfirmEmail from '../ConfirmEmail';
import MfaCode from '../MfaCode';

import { Auth } from 'aws-amplify';
import PayroButton from '../../widgets/PayroButton';

const SIGN_UP = 'signUp';
const SIGN_IN = 'signIn';
const CONFIRM_CODE = 'confirmCode';
const MFA_CODE = 'mfaode';

const renderComponent = (componentAlias: string) => {
  switch (componentAlias) {
    case SIGN_UP:
      return <SignUpForm />;
    case SIGN_IN:
      return <SignInForm />;
  }
};

export const AuthWrapper = () => {
  const [formComponent, setFormComponent] = useState('');

  return (
    <div>
      <PayroButton onClick={() => setFormComponent(SIGN_UP)}>
        Sign Up
      </PayroButton>
      <PayroButton onClick={() => setFormComponent(SIGN_IN)}>
        Sign In
      </PayroButton>

      {renderComponent(formComponent)}
    </div>
  );
};
