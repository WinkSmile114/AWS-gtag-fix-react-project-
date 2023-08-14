import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import ForgotPassword from '../../auth/ForgotPassword';
import {
  emailforgotPasswordState,
  userContactInfoState,
} from '../../recoil-state/general-states';
import AdditionalUsers from '../AdditionalUsers';
import EditMyProfile from '../EditMyProfile';
import MyIntegrations from '../MyIntegrations';
import './index.scss';
import SettingsHomePage from './SettingsHomePage';
import SettingsSideBar from './SettingsSideBar';
const Settings = () => {
  let history = useHistory();
  let id = useParams();
  const idString = JSON.stringify(id);
  const [userContactInfo, setUserContactInfo] = useRecoilState(
    userContactInfoState,
  );
  const [email, setEmail] = useRecoilState(emailforgotPasswordState);

  useEffect(() => {setEmail(userContactInfo.email);}, []);
  // console.log(idString, 'ids');
  return (
    <>
      {' '}
      <div className="settings-main-wrapper">
        <div className="settings-main-container">
          <div>
            {' '}
            {!idString.includes('my-profile') &&
            !idString.includes('integrations') &&
            !idString.includes('additional-users') &&
            !idString.includes('reset-password') &&
            !idString.includes('reports') ? (
              <SettingsHomePage idString={idString} />
            ) : (
              <SettingsSideBar idString={idString} />
            )}
          </div>
          <div>
            {' '}
            {idString.includes('my-profile') ? <EditMyProfile /> : ''}
            {idString.includes('reset-password') ? (
              <ForgotPassword />
            ) : (
              ''
            )}
            {idString.includes('integrations') ? (
              <MyIntegrations />
            ) : (
              ''
            )}
            {idString.includes('additional-users') ? (
              <AdditionalUsers />
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
