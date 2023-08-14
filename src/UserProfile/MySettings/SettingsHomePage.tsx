import './index.scss';
import profileIcon from '../../common-icons/side-bar-profile.svg';
import profileIconPurple from '../../common-icons/side-bar-profile-purple.svg';
import additionalUsersIcon from '../../common-icons/side-bar-additional-users.svg';
import additionalUsersIconPurple from '../../common-icons/side-bar-additional-users-purple.svg';
import integrationsIcon from '../../common-icons/side-bar-integrations.svg';
import integrationsIconPurple from '../../common-icons/side-bar-integrations-purple.svg';
import greyArrowIcon from '../../common-icons/dashboard-grey-arrow.svg';
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
const SettingsHomePage = (props: sideBarProps) => {
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
    subLabel: string;
    clickFunction: Function;
    icon: any;
    iconSelected: any;
    selected: boolean;
    title: string;
    className?: string;
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
      subLabel: 'View and edit your Payro profile details',
      clickFunction: () => {
        history.push('/settings/my-profile'), setAll();
        setSelectedProfileTab(true);
      },
      icon: profileIcon,
      iconSelected: profileIconPurple,
      selected: selectedProfile,
      title: 'Profile',
    },
    {
      label: 'Bank Account',
      subLabel: 'Manage your bank accounts ',
      clickFunction: () => {
        history.push('/settings/integrations'),
          setAll(),
          setSelectedIntegrationsTab(true);
      },

      icon: integrationsIcon,
      iconSelected: integrationsIconPurple,
      selected: selectedIntegrations,
      title: 'Integrations',
    },
    {
      label: 'Additional Users',
      subLabel: 'View users and connect more',
      clickFunction: () => {
        setAll(), setSelectedAdditionalTab(true);
      },
      icon: additionalUsersIcon,
      iconSelected: additionalUsersIconPurple,
      selected: selectedAdditional,
      title: 'Additional Users',
      className: 'disabled',
    },
    {
      label: 'Reports',
      subLabel: 'Download and export reports',
      clickFunction: () => {
        setAll(), setSelectedReportsTab(true);
      },
      icon: reportsIcon,
      iconSelected: reportsIconPurple,
      selected: selectedReports,
      title: 'Reports',
      className: 'disabled',
    },
    {
      label: 'Preferences',
      subLabel: 'Manage and setup your notification preferences',
      clickFunction: () => {
        setAll(), setSelectedPreferencesTab(true);
      },
      icon: preferencesIcon,
      iconSelected: preferencesIconPurple,
      selected: selectedPreferences,
      title: 'Preferences',
      className: 'disabled',
    },
    {
      label: 'Legal and Documents',
      subLabel: 'View and edit your Payro profile details',
      clickFunction: () => {
        setAll(), setSelectedDocsTab(true);
      },
      icon: legalIcon,
      iconSelected: legalIconPurple,
      selected: selectedDocs,
      title: 'Legal and Document',
      className: 'disabled',
    },
  ];

  const profileMenu = profileOptions.map((op) => {
    return (
      <>
        <div
          id="side-bar-menu-option-home"
          key={op.label}
          onClick={op.clickFunction as MouseEventHandler}
        >
          <div className="setting-option-title">{op.title}</div>
          <div
            className={
              op.className == 'disabled'
                ? 'settings-individual-option-wrapper disabled'
                : 'settings-individual-option-wrapper'
            }
          >
            <div className="icon-and-label-wrapper">
              <img
                id="options-icon"
                className="options-icon-style"
                src={op.iconSelected}
              />
              <div className="label-sublabel-wrapper">
                <span className="settings-label-style">
                  {' '}
                  {op.label}
                </span>
                <span className="settings-sublabel-style">
                  {op.subLabel}
                </span>
              </div>
            </div>
            <div>
              <img
                // className="options-icon"
                src={greyArrowIcon}
              />
            </div>
          </div>
        </div>
      </>
    );
  });
  return (
    <>
      <div className="settings-home-container">
        <p className="settings-title">Account Settings</p>
        <div className="settings-options-home-container">
          {profileMenu}
        </div>
      </div>
    </>
  );
};

export default SettingsHomePage;
