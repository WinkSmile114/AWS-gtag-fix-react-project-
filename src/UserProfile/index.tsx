import { MouseEventHandler, useEffect, useState } from 'react';
import { isSignedIn, signOut } from '../auth/utils/auth-utils';
import './index.css';

import EditProfileIconPurple from './edit-profile.svg';
import SettingsIconPurple from '../common-icons/settings-icon.svg';
import bankIconGeneric from '../common-icons/bank-icon-grey.svg';
import LogoutIconPurple from './logout.svg';

import ArrowIcon from './arrow.svg';

import { getClient } from '../api-utils/general-utils';
import { Contact } from '../common-types';

import { intercom } from '../intercom';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  allAccountUsersContactInfoState,
  selectedIntegrationsRecoil,
  selectedProfileRecoil,
  userContactInfoState,
  userInfoState,
  userProfileLetterRecoil,
} from '../recoil-state/general-states';
import { useHistory } from 'react-router-dom';

const AUTH_PENDING = 'pending';
const SIGNED_IN = 'signedIn';
const SIGNED_OUT = 'signedOut';

interface UserProps {
  userProfile?: string;
}

interface ProfileOption {
  label: string;
  clickFunction: Function;
  icon: any;
}

const UserProfile = (props: UserProps) => {
  let history = useHistory();
  const [authStatus, setAuthStatus] = useState(AUTH_PENDING);
  const [showDropdown, setShowdropdown] = useState(false);
  const [userContactInfo, setUserContactInfo] = useRecoilState(
    userContactInfoState,
  );
  const [selectedProfile, setSelectedProfileTab] = useRecoilState(
    selectedProfileRecoil,
  );
  const [selectedIntegrations, setSelectedIntegrationsTab] =
    useRecoilState(selectedIntegrationsRecoil);
  const userInfo = useRecoilValue(userInfoState);
  const [userProfileLetter, setUserProfileLetter] =
    useRecoilState<string>(userProfileLetterRecoil);
  useEffect(() => {
    isSignedIn()
      .then((res) => setAuthStatus(SIGNED_IN))
      .catch((err) => setAuthStatus(SIGNED_OUT));
    getAndParseUserContactInfo();
  }, []);
  const getAndParseUserContactInfo = async () => {
    const apiClient = await getClient();
    if (!apiClient) {
      return;
    }

    const allContactsRes =
      await apiClient.contactsControllerFindAll();

    let resDataCopy = [...(allContactsRes.data as Contact[])];
    resDataCopy.forEach(async (contact) => {
      if (
        contact.uuid == userInfo.contact_uuid &&
        contact.first_name
      ) {
        setUserProfileLetter(
          contact.first_name.charAt(0).toUpperCase(),
        );

        await setUserContactInfo(contact);
      }
    });

    return;
  };

  const logoutOnClick = () =>
    signOut().finally(() => {
      // intercom('shutdown');
      window.location.replace('/');
    });

  window.onclick = function (e) {
    if (
      showDropdown &&
      e.target != document.getElementById('dropdown-content')
    ) {
      setShowdropdown(!showDropdown);
    }
  };

  const profileOptions: Array<ProfileOption> = [
    {
      label: 'Edit',
      clickFunction: () => {
        history.push('/settings/my-profile'),
          setSelectedIntegrationsTab(false),
          setSelectedProfileTab(true);
      },
      icon: EditProfileIconPurple,
    },
    {
      label: 'Settings',
      clickFunction: () => {
        history.push('/settings'),
          setSelectedIntegrationsTab(false),
          setSelectedProfileTab(false);
      },
      icon: SettingsIconPurple,
    },
    {
      label: 'Connect Bank',
      clickFunction: () => history.push('/connect-bank'),
      icon: bankIconGeneric,
    },
    {
      label: 'Logout',
      clickFunction: () => logoutOnClick(),
      icon: LogoutIconPurple,
    },
  ];

  const profileMenu = profileOptions.map((op) => {
    return (
      <>
        <div
          className={
            op.label == 'Logout' ? 'profile-menu-option-logout' : ''
          }
        ></div>
        <div
          className="profile-menu-option"
          key={op.label}
          onClick={op.clickFunction as MouseEventHandler}
        >
          <div className="profile-option-icon-wrapper">
            <img src={op.icon} />
          </div>
          <span className="dropdown-label-style"> {op.label}</span>
        </div>
      </>
    );
  });

  return (
    <div>
      {authStatus == SIGNED_IN && (
        <>
          <div className="profile-icon">
            <p id="circle">
              <span
                id="dropdown-content"
                onClick={() => setShowdropdown(!showDropdown)}
                className="user-letter"
              >
                {userProfileLetter}
              </span>{' '}
            </p>
          </div>{' '}
        </>
      )}

      {showDropdown && (
        <div>
          <div>
            <div className="dropdown-content ">
              <div className="profile-icon">
                <p id="circle">
                  <span className="user-letter">
                    {userProfileLetter}
                  </span>{' '}
                </p>{' '}
              </div>
              <div className="account-dropdown-email-username-wrapper ">
                <p className="account-dropdown-username">
                  {userContactInfo.first_name}{' '}
                  {userContactInfo.last_name}
                </p>
                <p className="account-dropdown-email">
                  {userContactInfo.email}
                </p>
              </div>

              {profileMenu}
              {/* <span id="edit-link" className="icon">
                {' '}
                <img
                  onClick={() =>
                    window.location.replace('/my-profile/edit')
                  }
                  src={EditProfileIconPurple}
                />{' '}
                <a href="/my-profile/edit">Edit</a>
              </span>
              <span id="profile-connect-bank" className="icon">
                {' '}
                <img
                  onClick={() =>
                    window.location.replace('/connect-bank')
                  }
                  src={bankIconGeneric}
                />{' '}
                <a href="/connect-bank">Connect Bank</a>
              </span>
           
              <span className="icon">
                {' '}
                <img
                  onClick={() => logoutOnClick()}
                  src={LogoutIconPurple}
                />{' '}
                <a onClick={() => logoutOnClick()}>Logout</a>
              </span> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default UserProfile;
