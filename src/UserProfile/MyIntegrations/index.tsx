import { useRecoilState } from 'recoil';
import { bankAccountsState } from '../../recoil-state/request-funding-states';
import PlaidConnector from '../../widgets/PlaidConnector';

import SettingsTitleSection from '../MySettings/SettingsTitleSection';
import './index.scss';
const MyIntegrations = () => {
  return (
    <>
      <div id="profile-section-wrapper-integrations">
        <SettingsTitleSection title="Bank Accounts" />
        <div className="bank-accounts-wrapper-settings">
          <PlaidConnector stage="integrations" />
        </div>
      </div>
    </>
  );
};
export default MyIntegrations;
