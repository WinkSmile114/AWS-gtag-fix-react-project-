import { useEffect, useState, useContext } from 'react';
import { getJwt, signUp } from '../utils/auth-utils';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import './SignUp.css';
import ConfirmEmail from '../ConfirmEmail';

import PayroButton from '../../widgets/PayroButton';
import { SHOW_EMAIL_CONFIRMATION_FORM } from '../utils/constants';
import PayroInput from '../../widgets/PayroInput';
import TitleSection from '../../Header/title-section';

import { MessageContext } from '../../context';
import InfoIcon from '../../common-icons/info-icon.svg';
import passwordNoIcon from './password-no-icon.png';
import passwordYesIcon from './password-yes-icon.png';
import { getClient } from '../../api-utils/general-utils';
import { CheckForSalesforceAccountDTO } from '../../api-utils/generated-client';
import StepApplication from './StepApplication.svg';
import payrollCompaniesLogos from './payroll-companies.png';

import { useRecoilState } from 'recoil';
import { Link } from 'react-router-dom';

import { useHistory, useLocation } from 'react-router-dom';
import { payrollPartnerState } from '../../recoil-state/general-states';
import axios from 'axios';
import Loader from '../../widgets/Loader';
import { PayrollPartner } from './payrollCompanies';

enum PageOptions {
  SIGN_UP,
  EMAIL_CONFIRMATION,
}

const noValidations = {
  firstName: false,
  lastName: false,
  phone: false,
  email: false,
  companyName: false,
  password: false,
  confirmedPassword: false,
  payrollAmount: false,
};

const REFERRAL_SOURCE = 'rs';

export default function SignUpForm() {
  interface SignUpFields {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    companyName: string;
    password: string;
    confirmedPassword: string;
    payrollCompany: string;
    payrollAmount: number;
  }

  const [signUpFields, setSignUpFields] = useState<SignUpFields>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    password: '',
    confirmedPassword: '',
    payrollCompany: '',
    payrollAmount: 0,
  });

  const [pageToShow, setPageToShow] = useState<PageOptions>(
    PageOptions.SIGN_UP,
  );
  const [payrollCompanies, setPayrollCompanies] =
    useState<PayrollPartner[]>();
  const [payrollCompanyDetails, setPayrollCompanyDetails] =
    useRecoilState(payrollPartnerState);
  const [validationsToShow, setValidationsToShow] =
    useState<any>(noValidations);
  const [hideNonPasswordFields, setHideNonPasswordFields] =
    useState(false);
  const [checked, setCheckBox] = useState(false);
  const [agreeToTermsConditions, setAgreeToTermsConditions] =
    useState(false);
  const [buttonDisabled, setButtonDisabled] =
    useState<boolean>(false);

  const messageContext = useContext(MessageContext);
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API}/accounts/iso-links`)
      .then((res) => {
        setPayrollCompanies(res.data);
      });
  }, []);

  useEffect(() => {
    if (localStorage.getItem(SHOW_EMAIL_CONFIRMATION_FORM)) {
      setPageToShow(PageOptions.EMAIL_CONFIRMATION);
    }

    const searchString = location.search;

    if (searchString) {
      let searchParams = new URLSearchParams(searchString);
      const rs = searchParams.get('partner');

      if (rs) {
        console.log('rs', rs);
        if (!payrollCompanies) {
          return;
        }
        const selectedCompany = payrollCompanies.find((el) => {
          return el.partner_name === rs.toLowerCase();
        });
        if (!selectedCompany) {
          return;
        }

        localStorage.setItem(
          REFERRAL_SOURCE,
          selectedCompany.partner_account_uuid,
        );
        setPayrollCompanyDetails(selectedCompany);
      }
    }
  });

  useEffect(() => {
    const initializeInfoFromWebToken = async () => {
      if (pageToShow == PageOptions.SIGN_UP) {
        const urlParams = new URLSearchParams(window.location.search);
        const webToken = urlParams.get('webtoken');
        console.log('webtoken', webToken);
        if (!webToken) {
          return;
        }
        const client = await getClient(true);
        if (!client) {
          return;
        }
        let leadRes;
      }
    };
    initializeInfoFromWebToken().then((res) => console.log('done'));
  }, []);

  const onFormSubmit = async () => {
    setButtonDisabled(true);
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      companyName,
      payrollCompany,
      payrollAmount,
    } = signUpFields;
    messageContext.clearMessages();

    const contactinfo: CheckForSalesforceAccountDTO = {
      phone: phone,
      email: email,
    };
    const client = await getClient(true);
    if (!client) {
      return;
    }

    const checkIfContactInfoMatchesExistingSalesforceAccounts =
      async (contactinfo: CheckForSalesforceAccountDTO) => {
        // sa: this endpoint will return false if a cognito account already exists with this email
        const res: any =
          await client.accountsControllerCheckIfNewSignUpAlreadyHasSalesforceAccountsOrHasMultipleOrHasCognito(
            contactinfo,
          );

        if (res.data == 'call') {
          setButtonDisabled(false);
          messageContext.addMessage({
            message:
              'Your account needs some TLC. Please call us at 1-833-271-4499',
            level: 'error',
          });
          throw 'multiple accounts detected. Please call us at 1-833-271-4499';
        } else if (res.data) {
          window.location.href = `/activateportalaccount?contactEmail=${email}`;
          setButtonDisabled(false);
        }
        return res;
      };
    const connectedAlreadyRes =
      await checkIfContactInfoMatchesExistingSalesforceAccounts(
        contactinfo,
      );
    if (!connectedAlreadyRes.data) {
      signUp(
        firstName,
        lastName,
        email,
        password,
        phone,
        companyName,
        payrollCompany,
        payrollAmount,
        localStorage.getItem(REFERRAL_SOURCE),
      )
        .then(() => {
          localStorage.setItem(SHOW_EMAIL_CONFIRMATION_FORM, 'yes');
          localStorage.setItem('email', email);
          localStorage.setItem('password', password);
          localStorage.setItem('firstName', firstName);
          localStorage.setItem('lastName', lastName);
          localStorage.setItem('phone', phone);
          localStorage.setItem('companyName', companyName);
          localStorage.setItem('payrollCompany', payrollCompany);
          localStorage.setItem(
            'payrollAmount',
            payrollAmount.toString(),
          );
          setPageToShow(PageOptions.EMAIL_CONFIRMATION);
        })
        .catch((err) => {
          setButtonDisabled(false);
          let errorMessage = (err.message ?? '') as string;
          if (errorMessage.toLowerCase().includes('email already exists')) {
            errorMessage = errorMessage + ' Try just logging in on the top right of your screen.'
          }
          messageContext.addMessage({
            message: errorMessage,
            level: 'error',
          });
        });
    }
  };

  if (!payrollCompanies) {
    return <Loader />;
  }

  switch (pageToShow) {
    case PageOptions.EMAIL_CONFIRMATION:
      return <ConfirmEmail />;
    case PageOptions.SIGN_UP:
      const urlParams = new URLSearchParams(window.location.search);

      const hasUpperCase = /[A-Z]/;
      const hasLowerCase = /[a-z]/;
      const hasNumbers = /\d/;
      const isTenNumbers = /^[0-9]{10}$/;
      const hasNonalphas = /\W/;

      const {
        firstName,
        lastName,
        email,
        password,
        phone,
        companyName,
        confirmedPassword,
        payrollCompany,
      } = signUpFields;

      const validationFunctions: { [key: string]: boolean } = {
        firstName: firstName.length < 1,
        lastName: lastName.length < 1,
        phone: !isTenNumbers.test(phone),
        email:
          email.length < 5 ||
          email.indexOf('@') < 1 ||
          email.lastIndexOf('.') < 3,
        companyName: companyName.length < 1,

        password:
          password.length < 10 ||
          !hasUpperCase.test(password) ||
          !hasLowerCase.test(password) ||
          !hasNumbers.test(password) ||
          !hasNonalphas.test(password),
        confirmedPassword:
          confirmedPassword.length < 10 ||
          password !== confirmedPassword,
      };

      let allValid =
        Object.keys(validationFunctions).every(
          (fieldName) => !validationFunctions[fieldName],
        ) &&
        checked &&
        agreeToTermsConditions;
      return (
        <HelmetProvider>
          <div id="sign-up-outer-wrapper">
            <Helmet>
              <link
                rel="canonical"
                href="https://portal.payrofinance.com/sign-up"
              />
            </Helmet>

            <div id="pay-on-time-section">
              <h1 id="pay-on-time-title"> Pay your staff on time</h1>
              <p id="pay-on-time-subtitle">
                Easy Payroll funding, fast and secure.
              </p>
              <img id="application-steps" src={StepApplication} />

              {!payrollCompanyDetails && (
                <div className="payroll-companies-section">
                  <p id="payroll-companies">
                    Trusted Payroll Partners
                  </p>
                  <img
                    id="payroll-companies"
                    src={payrollCompaniesLogos}
                  />
                </div>
              )}
            </div>

            <div className="main-body " id="signup-section-wrapper">
              <TitleSection
                title="Get Started with Payroll Funding"
                centered
                subtitle="Apply now. Approval takes 48 hours."
              />

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onFormSubmit();
                }}
              >
                <div>
                  {!hideNonPasswordFields && (
                    <>
                      <div className="name-inputs">
                        <PayroInput
                          onFocus={() =>
                            setValidationsToShow({
                              ...validationsToShow,
                              firstName: false,
                            })
                          }
                          onBlurFunction={() =>
                            setValidationsToShow({
                              ...validationsToShow,
                              firstName: true,
                            })
                          }
                          error={
                            validationsToShow.firstName &&
                            validationFunctions.firstName
                          }
                          onChange={(e: any) =>
                            setSignUpFields({
                              ...signUpFields,
                              firstName: e,
                            })
                          }
                          required
                          placeholder="Your First Name"
                          id="first-name"
                          label="First Name"
                          value={signUpFields.firstName}
                          variant="standard"
                        />
                        <PayroInput
                          onFocus={() =>
                            setValidationsToShow({
                              ...validationsToShow,
                              lastName: false,
                            })
                          }
                          onBlurFunction={() =>
                            setValidationsToShow({
                              ...validationsToShow,
                              lastName: true,
                            })
                          }
                          error={
                            validationsToShow.lastName &&
                            validationFunctions.lastName
                          }
                          onChange={(e: any) =>
                            setSignUpFields({
                              ...signUpFields,
                              lastName: e,
                            })
                          }
                          required
                          id="last-name"
                          label="Last Name"
                          placeholder="Your Last Name"
                          value={signUpFields.lastName}
                          variant="standard"
                        />
                      </div>
                      <div>
                        <PayroInput
                          onFocus={() =>
                            setValidationsToShow({
                              ...validationsToShow,
                              email: false,
                            })
                          }
                          onBlurFunction={() =>
                            setValidationsToShow({
                              ...validationsToShow,
                              email: true,
                            })
                          }
                          error={
                            validationsToShow.email &&
                            validationFunctions.email
                          }
                          onChange={(e: any) =>
                            setSignUpFields({
                              ...signUpFields,
                              email: e,
                            })
                          }
                          required
                          id="email"
                          label="Email"
                          placeholder="example@domain.com"
                          value={signUpFields.email}
                          variant="standard"
                        />

                        <div className="input-info-message">
                          <img
                            className="password-info-icon"
                            src={InfoIcon}
                          ></img>
                          <p>
                            A verification code will be sent to this
                            email
                          </p>
                        </div>
                      </div>
                      <div>
                        <PayroInput
                          onFocus={() =>
                            setValidationsToShow({
                              ...validationsToShow,
                              phone: false,
                            })
                          }
                          onBlurFunction={() =>
                            setValidationsToShow({
                              ...validationsToShow,
                              phone: true,
                            })
                          }
                          error={
                            validationsToShow.phone &&
                            validationFunctions.phone
                          }
                          onChange={(e: any) =>
                            setSignUpFields({
                              ...signUpFields,
                              phone: e.toString(),
                            })
                          }
                          required
                          id="phone"
                          label="Phone"
                          placeholder="Your Cell Number"
                          isPhone={true}
                          helperText={
                            !validationsToShow.phone
                              ? ''
                              : validationFunctions.phone
                              ? 'We require a valid 10 digit number'
                              : ''
                          }
                          value={signUpFields.phone}
                          variant="standard"
                        />
                      </div>
                      <div className="input-info-message">
                        <input
                          type="checkbox"
                          onChange={() => setCheckBox(!checked)}
                          className="checkbox-design"
                        />
                        <p
                          className={checked == false ? 'error' : ''}
                        >
                          Phone number can receive SMS text messages
                        </p>
                      </div>

                      <div>
                        <PayroInput
                          onFocus={() =>
                            setValidationsToShow({
                              ...validationsToShow,
                              companyName: false,
                            })
                          }
                          onBlurFunction={() =>
                            setValidationsToShow({
                              ...validationsToShow,
                              companyName: true,
                            })
                          }
                          error={
                            validationsToShow.companyName &&
                            validationFunctions.companyName
                          }
                          onChange={(e: any) =>
                            setSignUpFields({
                              ...signUpFields,
                              companyName: e,
                            })
                          }
                          required
                          id="company-name"
                          label="Company Name"
                          placeholder="Your Company Name"
                          value={signUpFields.companyName}
                          variant="standard"
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <PayroInput
                      onFocus={() =>
                        setValidationsToShow({
                          ...validationsToShow,
                          password: false,
                        })
                      }
                      onBlurFunction={() =>
                        setValidationsToShow({
                          ...validationsToShow,
                          password: true,
                        })
                      }
                      error={
                        validationsToShow.password &&
                        validationFunctions.password
                      }
                      onChange={(e: any) =>
                        setSignUpFields({
                          ...signUpFields,
                          password: e,
                        })
                      }
                      required
                      id="the-password"
                      label="Create Password"
                      type="password"
                      placeholder=""
                      autoComplete="current-password"
                      variant="standard"
                      onCopy={(e: any) => {
                        e.preventDefault();
                        return false;
                      }}
                      onPaste={(e: any) => {
                        e.preventDefault();
                        return false;
                      }}
                    />
                  </div>

                  <div className="password-info-message">
                    <span className="password-error-text">
                      <img
                        className="password-icon"
                        src={
                          password.length < 10
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
                          !hasUpperCase.test(password)
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
                          !hasLowerCase.test(password)
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
                          !hasNumbers.test(password)
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
                          !hasNonalphas.test(password)
                            ? passwordNoIcon
                            : passwordYesIcon
                        }
                        height={18}
                        width={18}
                      ></img>
                      Special Character
                    </span>
                  </div>

                  <div>
                    <PayroInput
                      onFocus={() =>
                        setValidationsToShow({
                          ...validationsToShow,
                          confirmedPassword: false,
                        })
                      }
                      onBlurFunction={() =>
                        setValidationsToShow({
                          ...validationsToShow,
                          confirmedPassword: true,
                        })
                      }
                      error={
                        validationsToShow.confirmedPassword &&
                        validationFunctions.confirmedPassword
                      }
                      onChange={(e: any) =>
                        setSignUpFields({
                          ...signUpFields,
                          confirmedPassword: e,
                        })
                      }
                      required
                      id="confirmed-password"
                      label="Confirm Password"
                      type="password"
                      autoComplete="current-password"
                      variant="standard"
                      helperText={
                        !validationsToShow.confirmedPassword
                          ? ''
                          : validationFunctions.confirmedPassword &&
                            confirmedPassword.length > 0
                          ? 'Passwords Do Not Match'
                          : ''
                      }
                      onCopy={(e: any) => {
                        e.preventDefault();
                        return false;
                      }}
                      onPaste={(e: any) => {
                        e.preventDefault();
                        return false;
                      }}
                    />
                  </div>

                  <div className="input-info-message">
                    <input
                      type="checkbox"
                      onChange={() =>
                        setAgreeToTermsConditions(
                          !agreeToTermsConditions,
                        )
                      }
                      className="checkbox-design"
                    />
                    <p id="accept-conditions-message">
                      I agree to and accept the{' '}
                      <Link
                        to="/terms-and-conditions"
                        target="_blank"
                        className={
                          agreeToTermsConditions == false
                            ? 'terms-design-error'
                            : 'terms-design'
                        }
                      >
                        <span className="underline">
                          Terms and Conditions
                        </span>
                      </Link>{' '}
                      and{' '}
                      <Link
                        to="/legal-policies"
                        target="_blank"
                        className={
                          agreeToTermsConditions == false
                            ? 'terms-design-error'
                            : 'terms-design'
                        }
                      >
                        <span className="underline">
                          Privacy Policy
                        </span>
                      </Link>
                    </p>
                  </div>
                </div>
                <div></div>
                <PayroButton
                  buttonSize="large"
                  isFormSubmit={allValid ? true : false}
                  centered
                  disabled={!allValid || buttonDisabled}
                  className={'accent-background-color'}
                >
                  Start Application
                </PayroButton>
              </form>
            </div>
          </div>
        </HelmetProvider>
      );
  }
}
