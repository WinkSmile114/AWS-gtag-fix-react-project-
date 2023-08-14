import React, {
  useState,
  useRef,
  useEffect,
  useContext,
} from 'react';
import './index.css';
import PayroInput from '../../widgets/PayroInput';
import PayroButton from '../../widgets/PayroButton';
import TitleSection from '../../Header/title-section';
import { SHOW_EMAIL_CONFIRMATION_FORM } from '../utils/constants';
import ConfirmEmail from '../ConfirmEmail';
import { getCurrentAuthUser, signUp } from '../utils/auth-utils';
import { MessageContext } from '../../context';
import { useRecoilState } from 'recoil';
//import { companyNameState, firstNameState, lastNameState, passwordState, payrollAmountState, payrollCompanyState, phoneState, signUpFieldsState } from "../../recoil-state/application-stage-states";

enum PageOptions {
  CONFIRM_EMAIL,
  EMAIL_CONFIRMATION,
}

export default function ChangeEmail() {
  const [pageToShow, setPageToShow] = useState<PageOptions>();
  const [email, setEmail] = useState('');
  // const [firstName, setFName] = useRecoilState<string>(firstNameState)
  // const [lastName, setLName] = useRecoilState<string>(lastNameState)
  // const [phone, setPhone] = useRecoilState<string>(phoneState)
  // const [companyName, setCompanyName] = useRecoilState<string>(companyNameState)
  // const [password, setPassword] = useRecoilState<string>(passwordState)
  // const [payrollCompany, setPayrollCompany] = useRecoilState<string>(payrollCompanyState)
  // const [payrollAmount, setPayrollAmount] = useRecoilState<number>(payrollAmountState)
  //const [signUpFieldsRecoilState, setSignUpFieldsRecoilState] = useRecoilState(signUpFieldsState)

  const messageContext = useContext(MessageContext);

  const validationFunctions: { [key: string]: boolean } = {
    email:
      email.length < 5 ||
      email.indexOf('@') < 1 ||
      email.indexOf('.') < 3,
  };

  const onSubmit = () => {
    messageContext.clearMessages();
    const password = localStorage.getItem('password') || '';
    const firstName = localStorage.getItem('firstName') || '';
    const lastName = localStorage.getItem('lastName') || '';
    const phone = localStorage.getItem('phone') || '';
    const companyName = localStorage.getItem('companyName') || '';
    const payrollCompany =
      localStorage.getItem('payrollCompany') || '';
    const payrollAmount = localStorage.getItem('payrollAmount') || '';

    signUp(
      firstName,
      lastName,
      email,
      password,
      phone,
      companyName,
      payrollCompany,
      parseInt(payrollAmount),
    )
      .then(() => {
        //using local storage in case of page refresh
        localStorage.setItem(SHOW_EMAIL_CONFIRMATION_FORM, 'yes');
        localStorage.setItem('email', email);
        localStorage.getItem('password');
        setPageToShow(PageOptions.EMAIL_CONFIRMATION);
      })
      .catch((err) => {
        messageContext.addMessage({
          message: err.message,
          level: 'error',
        });
      });
  };

  switch (pageToShow) {
    case PageOptions.EMAIL_CONFIRMATION:
      return <ConfirmEmail />;
  }

  return (
    <div id="forgot-password-page-wrapper" className="main-body">
      <TitleSection
        centered={true}
        title="Change Email"
        subtitle={'Enter the new email address for your account'}
      />
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
          error={email != '' && validationFunctions.email}
        />
      </div>
      <PayroButton
        buttonSize="large"
        centered
        disabled={validationFunctions.email}
        className={'accent-background-color login-button'}
        onClick={() => onSubmit()}
      >
        Submit
      </PayroButton>
      <a
        className="cancel-design"
        onClick={() => setPageToShow(PageOptions.EMAIL_CONFIRMATION)}
      >
        Cancel
      </a>
    </div>
  );
}
