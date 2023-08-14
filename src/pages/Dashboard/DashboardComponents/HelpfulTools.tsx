import { useEffect, useState } from 'react';
import bankIcon from '../../../common-icons/helpful-tool-bank-icon.svg';
import chatIcon from '../../../common-icons/helpful-tool-support-icon.svg';
import requestIcon from '../../../common-icons/helpful-tool-request-icon.svg';
import arrowIcon from '../../../common-icons/dashboard-helpful-tool-arrow.svg';
import { intercom } from '../../../intercom';
import '../index.scss';
import PayroButton from '../../../widgets/PayroButton';
import { useRecoilState, useRecoilValue } from 'recoil';
import { showHideClassNameModalDisplayState } from '../../../recoil-state/request-funding-states';
import ManageBankAccounts from '../RequestMoreCredit/ManageBankAccountsModal';
import { useHistory } from 'react-router-dom';
import PendingBalanceMessage from './PendingBalanceMessage';
import {
  selectedIntegrationsRecoil,
  selectedProfileRecoil,
  userContactInfoState,
} from '../../../recoil-state/general-states';

const HelpfulTools = () => {
  let history = useHistory();
  const [selectedIntegrations, setSelectedIntegrationsTab] =
    useRecoilState(selectedIntegrationsRecoil);
  const [selectedProfile, setSelectedProfileTab] = useRecoilState(
    selectedProfileRecoil,
  );
  const [
    showHideClassNameModalDisplay,
    setShowHideClassNameModalDisplay,
  ] = useRecoilState(showHideClassNameModalDisplayState);
  return (
    <div>
      <ManageBankAccounts></ManageBankAccounts>
      <p className="helpful-tools-title"> HELPFUL TOOLS</p>
      <div className="helpful-tools-main-wrapper">
        <div className="helpful-tool-wrapper">
          <img id="helpful-tools-circle" src={bankIcon} />
          <div className="text-and-icon-wrapper">
            <p className="helpful-tools-text">Manage Bank Accounts</p>
            <PayroButton
              customWidth="width-small"
              variant="purple-white"
              endIcon={arrowIcon}
              onClick={() => {
                history.push('/settings/integrations'),
                  setSelectedProfileTab(false);
                setSelectedIntegrationsTab(true);
              }}
            >
              {''}
            </PayroButton>
          </div>
        </div>
        <div className="helpful-tool-wrapper">
          <img id="helpful-tools-circle" src={chatIcon} />
          <div className="text-and-icon-wrapper">
            <p className="helpful-tools-text">
              Chat with Payro Support
            </p>

            <div>
              <img
                id="my_custom_link"
                className="arrow-info-icon"
                src={arrowIcon}
              ></img>
            </div>
          </div>
        </div>
        <div className="helpful-tool-wrapper-request-more">
          <img id="helpful-tools-circle" src={requestIcon} />
          <div className="text-and-icon-wrapper">
            <p className="helpful-tools-text">Request More Credit</p>
            <PayroButton
              customWidth="width-small"
              variant="purple-white"
              endIcon={arrowIcon}
              // onClick={() => {
              //   history.push('/request-credit');
              // }}
              onClick={() => {
                setShowHideClassNameModalDisplay(
                  'modal display-block',
                );
              }}
            >
              {''}
            </PayroButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpfulTools;
