import './index.scss';
import profileIcon from '../../common-icons/side-bar-profile.svg';
import profileIconPurple from '../../common-icons/side-bar-profile-purple.svg';
import additionalUsersIcon from '../../common-icons/side-bar-additional-users.svg';
import additionalUsersIconPurple from '../../common-icons/side-bar-additional-users-purple.svg';
import integrationsIcon from '../../common-icons/side-bar-integrations.svg';
import integrationsIconPurple from '../../common-icons/side-bar-integrations-purple.svg';
import arrowIcon from '../../common-icons/dashboard-helpful-tool-arrow.svg';
import reportsIcon from '../../common-icons/side-bar-reports.svg';
import reportsIconPurple from '../../common-icons/side-bar-reports-purple.svg';
import preferencesIcon from '../../common-icons/side-bar-preferences.svg';
import preferencesIconPurple from '../../common-icons/side-bar-preferences-purple.svg';
import legalIcon from '../../common-icons/legal-and-document.svg';
import legalIconPurple from '../../common-icons/legal-and-document-purple.svg';
import { MouseEventHandler, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import {
  selectedIntegrationsRecoil,
  selectedProfileRecoil,
} from '../../recoil-state/general-states';
import PayroButton from '../../widgets/PayroButton';

interface sideBarProps {
  idString?: string;
}
const SettingsSideBar = (props: sideBarProps) => {
  let history = useHistory();
  const [selectedProfile, setSelectedProfileTab] = useRecoilState(
    selectedProfileRecoil,
  );
  const [selectedAdditional, setSelectedAdditionalTab] =
    useState(false);
  const [selectedIntegrations, setSelectedIntegrationsTab] =
    useRecoilState(selectedIntegrationsRecoil);
  const [selectedReports, setSelectedReportsTab] = useState(false);
  const [selectedPreferences, setSelectedPreferencesTab] =
    useState(false);
  const [selectedDocs, setSelectedDocsTab] = useState(false);
  interface ProfileOption {
    label: string;
    clickFunction: Function;
    icon: any;
    iconSelected: any;
    selected: boolean;
  }

  const setAll = () => {
    setSelectedProfileTab(false);
    setSelectedAdditionalTab(false);
    setSelectedIntegrationsTab(false);
    setSelectedPreferencesTab(false);
    setSelectedReportsTab(false);
    setSelectedDocsTab(false);
  };

  const profileOptions: Array<ProfileOption> = [
    {
      label: 'My Profile',
      clickFunction: () => {
        history.push('/settings/my-profile'), setAll();
        setSelectedProfileTab(true);
      },
      icon: profileIcon,
      iconSelected: profileIconPurple,
      selected: selectedProfile,
    },
    {
      label: 'Integrations',
      clickFunction: () => {
        history.push('/settings/integrations'),
          setAll(),
          setSelectedIntegrationsTab(true);
      },

      icon: integrationsIcon,
      iconSelected: integrationsIconPurple,
      selected: selectedIntegrations,
    },
    // {
    //   label: 'Additional Users',
    //   clickFunction: () => {
    //     history.push('/settings/additional-users'),
    //       setAll(),
    //       setSelectedAdditionalTab(true);
    //   },
    //   icon: additionalUsersIcon,
    //   iconSelected: additionalUsersIconPurple,
    //   selected: selectedAdditional,
    // },

    // {
    //   label: 'Reports',
    //   clickFunction: () => {
    //     setAll(), setSelectedReportsTab(true);
    //   },
    //   icon: reportsIcon,
    //   iconSelected: reportsIconPurple,
    //   selected: selectedReports,
    // },
    // {
    //   label: 'Preferences',
    //   clickFunction: () => {
    //     setAll(), setSelectedPreferencesTab(true);
    //   },
    //   icon: preferencesIcon,
    //   iconSelected: preferencesIconPurple,
    //   selected: selectedPreferences,
    // },
    // {
    //   label: 'Legal and Documents',
    //   clickFunction: () => {
    //     setAll(), setSelectedDocsTab(true);
    //   },
    //   icon: legalIcon,
    //   iconSelected: legalIconPurple,
    //   selected: selectedDocs,
    // },
  ];

  const profileMenu = profileOptions.map((op) => {
    return (
        <div
          id="side-bar-menu-option"
          key={op.label}
          onClick={op.clickFunction as MouseEventHandler}
        >
          <div
            className={
              op.selected
                ? 'side-bar-selected-border'
                : 'side-bar-not-selected-border'
            }
          ></div>
          <div className="profile-option-icon-wrapper">
            <img src={op.selected ? op.iconSelected : op.icon} />
          </div>
          <span
            className={
              op.selected
                ? 'side-bar-selected-text'
                : 'side-bar-not-selected-text'
            }
          >
            {' '}
            {op.label}
          </span>
        </div>
    );
  });
  return (
    <>
      <div className="button-and-dropdown-wrapper">
        <div className="button-wrapper-explore-settings"></div>
        <div className="settings-side-bar-container">
          {profileMenu}
        </div>
        <PayroButton
          onClick={() => history.push('/settings')}
          variant="white"
          endIcon={arrowIcon}
          customWidth="width-250"
        >
          Explore Settings
        </PayroButton>
      </div>
    </>
  );
};

export default SettingsSideBar;
