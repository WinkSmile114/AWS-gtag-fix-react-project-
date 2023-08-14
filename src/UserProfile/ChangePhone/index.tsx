import React, {
  useState,
  useRef,
  useEffect,
  useContext,
} from 'react';
import './index.css';
import axios from 'axios';
import PayroInput from '../../widgets/PayroInput';
import PayroButton from '../../widgets/PayroButton';
import FiniteNumbersGroup from '../../widgets/FiniteNumbersGroup';
import LockIcon from './lock-icon.png';
import TitleSection from '../../Header/title-section';
import { SHOW_EMAIL_CONFIRMATION_FORM } from '../../auth/utils/constants';
// import ConfirmEmail from '../../ConfirmEmail';
import { getCurrentAuthUser, signUp,getJwt,updateEmail,updatePhone } from '../../auth/utils/auth-utils';
import { MessageContext } from '../../context';
import { addBearerHeader } from '../../api-utils/general-utils';
import { useRecoilState } from 'recoil';
import { useHistory, useParams } from 'react-router-dom';
import Loader from '../../widgets/Loader';
import {
  userContactInfoState,
  userInfoState,
  userProfileLetterRecoil,
} from '../../recoil-state/general-states';
import { UpdateContactDto } from '../../api-utils/generated-client';
import { Contact } from '../../common-types';

import { getClient } from '../../api-utils/general-utils';

//import { companyNameState, firstNameState, lastNameState, passwordState, payrollAmountState, payrollCompanyState, phoneState, signUpFieldsState } from "../../recoil-state/application-stage-states";

enum PageOptions {
  CONFIRM_EMAIL,
  CONFIRM_PHONE,
  EMAIL_CONFIRMATION,
  PHONE_CONFIRMATION,
}

export default function ChangePhone() {
  let history = useHistory();
  const [pageToShow, setPageToShow] = useState<PageOptions>(PageOptions.CONFIRM_EMAIL);
  const [phone, setPhone] = useState<any>('');
  const [email, setEmail] = useState<any>('');
  const [userContactInfo, setUserContactInfo] = useRecoilState(
    userContactInfoState,
  );
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const [userProfileLetter, setUserProfileLetter] = useRecoilState<string>(userProfileLetterRecoil);
  const [Otp, setOtp] = useState<any>('');
  const [UserOtp, setUserOtp] = useState('');
  const [isNextDisabled, setisNextDisabled] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [cognitoUser, setcognitoUser] = useState<any>('');
  
  const messageContext = useContext(MessageContext);
  const [signUpFields, setSignUpFields] = useState<UpdateContactDto>({
    first_name: userContactInfo.first_name,
    last_name: userContactInfo.last_name,
    email: userContactInfo.email,
    phone: userContactInfo.phone,
  });
  
  const isTenNumbers = /^[0-9]{10}$/;


  const validationFunctions: { [key: string]: boolean } = {
    email:
      email.length < 5 ||
      email.indexOf('@') < 1 ||
      email.indexOf('.') < 3, 
    phone: !isTenNumbers.test(phone),
  };

  const updateContact = async (signUpFields: any) => {
    const apiClient = await getClient();
    if (!apiClient) {
      return;
    }
    await apiClient.contactsControllerUpdate(
      userContactInfo.uuid,
      signUpFields,
    );
    await apiClient.userInfoControllerAdminUpdateUserAttributes(
      signUpFields,
    );

    return;
  };
  const getAndParseUserContactInfo = async () => {
    const apiClient = await getClient();
    if (!apiClient) {
      return;
    }
    let contact_uuid: string;
    if (!userInfo || !userInfo.contact_uuid) {
      const userInfoRes =
        await apiClient.userInfoControllerGetUserInfo();
      setUserInfo(userInfoRes.data);
      contact_uuid = userInfoRes.data.contact_uuid!;
    } else {
      contact_uuid = userInfo.contact_uuid;
    }

    const allContactsRes =
      await apiClient.contactsControllerFindAll();

    let resDataCopy = [...(allContactsRes.data as Contact[])];
    resDataCopy.forEach(async (contact) => {
      if (contact.uuid == contact_uuid && contact.first_name) {
        setUserProfileLetter(
          contact.first_name.charAt(0).toUpperCase(),
        );

        await setUserContactInfo(contact);
        setSignUpFields({
          first_name: contact.first_name,
          last_name: contact.last_name,
          email: contact.email,
          phone: contact.phone,
        });
      }
    });
  };
  useEffect(() => {
    getAndParseUserContactInfo().then(() => {});
    
    getCurrentAuthUser().then(async(authUser) => {
      if(authUser){
        setcognitoUser(authUser)
      }
    })
    .catch((err) => {
      messageContext.addMessage({
        message: 'Unautorized access, please login and try again',
        level: 'error',
      });
    });

  }, []);

  const onSubmit = () => {
    messageContext.clearMessages();
    getCurrentAuthUser().then(async(authUser) => {
      if(authUser){
        setcognitoUser(authUser)
          const otp = Math.floor(100000 + Math.random() * 900000);
          setOtp(otp)
          var referenceId = btoa(otp.toString());
          await axios.post(
            `${process.env.REACT_APP_API}/user-info/sendVerificationEmail`,
            {email:authUser.attributes && authUser.attributes.email,referenceId:referenceId},
          ).then((res) => {
            if(res){
              setPageToShow(PageOptions.PHONE_CONFIRMATION)
            }
          });
      }
    })
    .catch((err) => {
      messageContext.addMessage({
        message: 'Unsutorized access, please login and try again',
        level: 'error',
      });
    });
   
  };
  const onVerify = async() => {
    let nphone = '+1'+phone;
    let fields = { ...signUpFields, phone: nphone };
    setPhone(nphone)
    if(Otp == UserOtp){
      setShowLoader(true);
      let resupdatecognito = await updateCognito(nphone)
      if(resupdatecognito){
        updateDetails(fields)
      }

    }else{
      messageContext.addMessage({
        message: 'OTP is not valid',
        level: 'error',
      });
    }
  }
  const updateCognito = (phone:string) => {

    return new Promise((resolve, reject) => {
      updatePhone(phone).then(async(authUser) => {
        if(authUser){
          resolve(true);
        }
      })
      .catch((err) => {
        setShowLoader(false);
        setPageToShow(PageOptions.CONFIRM_EMAIL)
        messageContext.addMessage({
          // message: 'We are unable to update your email at this time',
          message: err.message ? err.message : 'We are unable to update your phone number at this time',
          level: 'error',
        });
        reject(err)
      });
    });

    // return updatePhone(phone).then(async(authUser) => {
    //   if(authUser){
    //     return true;
    //   }
    // })
    // .catch((err) => {
    //   messageContext.addMessage({
    //     message: 'We are unable to update your phone number at this time',
    //     level: 'error',
    //   });
    //   setShowLoader(false);
    //   history.push('/settings/my-profile');
    //   return false;
    // });
  }
  const updateDetails = (fields:any) => {
    // console.log('signUpFieldsnphone',signUpFields)
    updateContact(fields)
    .then(() => getAndParseUserContactInfo())
    .then(() => {
      setShowLoader(false);
      messageContext.addMessage({
        message: 'Your info has been updated.',
        level: 'info',
      });
      // setPageToShow(PageOptions.CONFIRM_EMAIL)
      history.push('/settings/my-profile');
    })
    .catch((err) => {
      console.log(err);
      messageContext.addMessage({
        message:
          'We are unable to update your profile at this time',
        level: 'error',
      });
      setShowLoader(false);
      setTimeout(() => history.push('/settings/my-profile'), 2000);
    });
  }
  const resendOTP = () => {
    getCurrentAuthUser().then(async(authUser) => {
      const otp = Math.floor(100000 + Math.random() * 900000);
      setOtp(otp)
      // Encode the String
      var referenceId = btoa(otp.toString());
      if(authUser){
        setcognitoUser(authUser)
        axios
        .post(`${process.env.REACT_APP_API}/user-info/sendVerificationEmail`,{email:authUser.attributes && authUser.attributes.email,referenceId:referenceId})
        .then((res) => {
          if(res){
          }
        });
      }
    })
    .catch((err) => {
      messageContext.addMessage({
        message: 'Unautorized access, please login and try again',
        level: 'error',
      });
    });
  }

  // switch (pageToShow) {
    // case PageOptions.EMAIL_CONFIRMATION:
      // return <ConfirmEmail />;
  // }
  // console.log('cognitoUser',cognitoUser)

  if (showLoader) {
    return <Loader message="Updating Your Phone Number" />;
  }
  return (
    pageToShow == PageOptions.CONFIRM_EMAIL
    ?
    <div id="forgot-password-page-wrapper" className="main-body">
      <TitleSection
        centered={true}
        title="Change Phone"
        subtitle={'Enter the new phone number your account'}
      />
      <div>
        {/* <PayroInput
          onChange={(e) => {
            setPhone(e);
            setSignUpFields({ ...signUpFields, phone: e })
          }}
          required
          id="login-email"
          label="Email"
          value={email}
          placeholder="example@domain.com"
          error={email != '' && validationFunctions.email}
        /> */}
        <PayroInput
          error={phone != "" && validationFunctions.phone}
          onChange={(e) => {
            setPhone(e.toString());
            setSignUpFields({ ...signUpFields, phone: e.toString() })
          }}
          required
          id="phone"
          label="Phone"
          placeholder="Your Cell Number"
          isPhone={true}
          value={phone}
          variant="standard"
        />
      </div>
      <PayroButton
        buttonSize="large"
        centered
        disabled={validationFunctions.phone}
        className={'accent-background-color login-button'}
        onClick={() => onSubmit()}
      >
        Submit
      </PayroButton>
      <a
        className="cancel-design"
        onClick={() => history.push('/settings/my-profile')}
      >
        Cancel
      </a>
    </div>
    :
      <div id="mfa-code-page-wrapper" className="main-body">
        <TitleSection
          centered={true}
          titleIcon={LockIcon}
          title="2-Factor Verification"
          subtitle={`We've sent a 6 digit code to  ${cognitoUser && cognitoUser.attributes && cognitoUser.attributes.email}. Please enter the code below.`
          // subtitle={`We've sent a 6 digit code to Please enter the code below.`
        }
        />
        <FiniteNumbersGroup
          valueFilledCallback={async (newVal: string) => {
            setUserOtp(newVal);
          }}
        />
        <p id="bad-phone">
          If the email above cannot receive messages or is
          incorrect, please call us at 1-833-271-4449 or email
          processing@payrofinance.com.
        </p>

        <div className="submit-mfa-section">
          <p className="resend-code-section">
            Didn't receive the code?{' '}
            <span
              className="resend-code-text"
              onClick={() =>
                resendOTP()
              }
            >
              Resend Email
            </span>
          </p>
          <PayroButton
            className={'accent-background-color'}
            disabled={isNextDisabled || UserOtp.length != 6}
            onClick={() =>
              onVerify()
            }
            buttonSize="small"
            variant="purple"
          >
            Verify
          </PayroButton>
        </div>
      </div>
  );
}
