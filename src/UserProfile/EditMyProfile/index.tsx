import { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import PayroInput from '../../widgets/PayroInput';
import {
  userContactInfoState,
  userInfoState,
  userProfileLetterRecoil,
} from '../../recoil-state/general-states';
import './index.css';
import PayroButton from '../../widgets/PayroButton';
import { getClient } from '../../api-utils/general-utils';
import { MessageContext } from '../../context';
import { UpdateContactDto } from '../../api-utils/generated-client';
import ConfirmEmail from '../../auth/ConfirmEmail';
import Loader from '../../widgets/Loader';
import SettingsTitleSection from '../MySettings/SettingsTitleSection';
import { Contact } from '../../common-types';
import InfoMessage from '../../widgets/InfoMessage';
import editIcon from '../../common-icons/edit-button.svg';

// const noValidations = {
//   firstName: false,
//   lastName: false,
//   phone: false,
//   email: false,
// };

const EditMyProfile = () => {
  let history = useHistory();
  let id = useParams();
  const idString = JSON.stringify(id);
  const [userContactInfo, setUserContactInfo] = useRecoilState(
    userContactInfoState,
  );
  const [backButtonText, setBackButtonText] =
    useState<string>('Cancel');
  const [showLoader, setShowLoader] = useState(false);
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const [userProfileLetter, setUserProfileLetter] =
    useRecoilState<string>(userProfileLetterRecoil);
  const messageContext = useContext(MessageContext);
  const [signUpFields, setSignUpFields] = useState<UpdateContactDto>({
    first_name: userContactInfo.first_name,
    last_name: userContactInfo.last_name,
    email: userContactInfo.email,
    phone: userContactInfo.phone,
  });

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
  }, []);

  const submitForm = async () => {
    // const { first_name, last_name, email, phone } = signUpFields;
    setShowLoader(true);
    updateContact(signUpFields)
      .then(() => getAndParseUserContactInfo())
      .then(() => {
        setShowLoader(false);
        setBackButtonText('Home');
        messageContext.addMessage({
          message: 'Your info has been updated.',
          level: 'info',
        });
      })
      .catch((err) => {
        console.log(err);
        messageContext.addMessage({
          message:
            'We are unable to update your profile at this time',
          level: 'error',
        });
        setTimeout(() => window.location.reload(), 3000);
      });
  };

  // if (!userContactInfo.first_name) {
  //   return <Loader />;
  // }

  if (showLoader) {
    return <Loader message="Updating Your Profile" />;
  }

  const isTenNumbers = /^[0-9]{10}$/;
  let allValid = signUpFields.first_name && signUpFields.last_name;
  return (
    <>
      <div id="profile-section-wrapper">
        <SettingsTitleSection title="My Profile" />
        <div className="profile-icon">
          <p id="circle-edit">
            <span className="user-letter-edit">
              {userContactInfo.first_name
                ? userContactInfo.first_name.charAt(0).toUpperCase()
                : ''}
            </span>{' '}
          </p>
        </div>
        <div className="avatar-buttons-wrapper">
          {/* <PayroButton>Change Avatar</PayroButton>{' '}
          <PayroButton variant="white">Remove Avatar</PayroButton>{' '} */}
        </div>
        <div className="my-profile-name-inputs">
          <PayroInput
            onChange={(e: any) =>
              setSignUpFields({ ...signUpFields, first_name: e })
            }
            error={!signUpFields.first_name}
            required
            placeholder="First Name"
            id="first-name"
            label="First Name"
            value={signUpFields.first_name}
            variant="edit-profile-input"
            wrapperAdditionalClasses="edit-profile-input"
          />
          
          <PayroInput
            error={!signUpFields.last_name}
            onChange={(e: any) =>
              setSignUpFields({ ...signUpFields, last_name: e })
            }
            required
            placeholder="Last Name"
            id="first-name"
            label="Last Name"
            value={signUpFields.last_name}
            variant="edit-profile-input"
            wrapperAdditionalClasses="edit-profile-input"
          />
        </div>
        <div className="my-profile-name-inputs">
          {/* <PayroInput
            onChange={(e: any) =>
              setSignUpFields({ ...signUpFields, email: signUpFields.email })
            }
            error={!signUpFields.email}
            required
            placeholder="Email"
            id="Email"
            label="Email"
            value={signUpFields.email}
            variant="edit-profile-input"
            wrapperAdditionalClasses="edit-profile-input email"
          /> */}
          <div className="input-container edit-profile-input">
            <span className="input-label">Email <img className='edit-icon-phone' onClick={ () => history.push('/edit-email')} src={editIcon} style={{width:"15px"}} /></span>
            <div className="input-wrapper edit-profile-input">
              <input placeholder="First Name" type="text" className="payro-actual-input not-focused edit-profile-input" value={signUpFields.email} /> 
            </div>
          </div>
          <div className="input-container edit-profile-input">
            <span className="input-label">Phone <img className='edit-icon-phone' onClick={ () => history.push('/edit-phone')} src={editIcon} style={{width:"15px"}} /> </span> 
            <div className="input-wrapper edit-profile-input">
              <input placeholder="First Name" type="text" className="payro-actual-input not-focused edit-profile-input" value={signUpFields.phone} /> 
            </div>
          </div>
          {/* <PayroInput
            onChange={(e: any) =>
              setSignUpFields({ ...signUpFields, phone: signUpFields.phone })
            }
            error={!signUpFields.phone}
            required
            placeholder="Phone"
            id="Phone"
            label="Phone"
            value={signUpFields.phone}
            variant="edit-profile-input"
            wrapperAdditionalClasses="edit-profile-input phone"
          /> */}
          {/* <img className='edit-icon-phone' src={editIcon} style={{width:"10px"}}/> */}
        </div>
        {/* <div>
          <p id="update-email-phone-warning">
            Updating email or phone will make you need to login agin
            using the new email and phone
          </p>
        </div> */}
        {/* <div className="my-profile-name-inputs">
          <PayroInput
            error={!signUpFields.email}
            onChange={(e: any) =>
              setSignUpFields({ ...signUpFields, email: e })
            }
            required
            id="email"
            label="Email"
            placeholder="Email"
            value={signUpFields.email}
            variant="edit-profile-input"
            wrapperAdditionalClasses="edit-profile-input"
          />{' '}
          <PayroInput
            wrapperAdditionalClasses="edit-profile-input"
            error={!signUpFields.phone}
            onChange={(e: any) =>
              setSignUpFields({
                ...signUpFields,
                phone: `+1${e.toString()}`,
              })
            }
            required
            id="phone"
            label="Phone"
            placeholder="Your Cell Number"
            isPhone={true}
            value={
              signUpFields.phone && signUpFields.phone.length > 10
                ? signUpFields.phone.slice(2)
                : signUpFields.phone
            }
            variant="edit-profile-input"
          />
        </div>{' '} */}
        {/* <div className="input-info-message-edit-profile">
          <p className="info-message-edit-profile-mobile">
            Phone number must receive SMS text messages
          </p>
        </div> */}
        <div></div>
        <div className="buttons-wrapper">
          <PayroButton
            className="save-changes"
            onClick={() => history.push('/settings')}
            variant="white"
          >
            {backButtonText}
          </PayroButton>

          <PayroButton
            disabled={!allValid}
            className="save-changes"
            onClick={() => submitForm()}
          >
            {' '}
            Save Changes
          </PayroButton>
        </div>
        <div className="profile-reset-password-wrapper">
          <a
            className="reset-password-profile-text"
            onClick={() => history.push('/settings/reset-password')}
          >
            {' '}
            Reset Password
          </a>{' '}
        </div>
      </div>
    </>
  );
};
export default EditMyProfile;
