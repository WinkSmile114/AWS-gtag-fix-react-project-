import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  useRecoilState,
  useSetRecoilState,
  useRecoilValue,
} from 'recoil';
import CompanyInfo from '../CompanyInfo';

import PayrollInfo from '../PayrollInfo';
import BankInfo from '../BankInfo';
import './application.css';

import SignAgreements from '../SignAgreements';
import Loader from '../../../widgets/Loader';
import SectionMarker, {
  SectionMarkerSection,
} from '../SectionMarker';
import FooterButtons from '../../../Footer/footer-buttons';
import {
  isNextButtonDisabledState,
  currentScreenState,
  furthestScreenState,
} from '../../../recoil-state/application-stage-states';
import {
  mainSectionState,
  userInfoState,
} from '../../../recoil-state/general-states';

interface ApplicationHomePageProps {
  setScreenNamesOnAppPage?: (
    newScreenName: string,
    furthestScreen: string,
  ) => void;
}

function ApplicationHomePage(props: ApplicationHomePageProps) {
  const [checkedAuth, setCheckedAuth] = useState(false);

  const history = useHistory();

  const [currentScreen, setCurrentScreen] = useRecoilState<any>(
    currentScreenState,
  );
  const [furthestScreen, setFurthestScreen] = useRecoilState<any>(
    furthestScreenState,
  );
  const [isNextDisabled, setIsNextDisabled] = useRecoilState(
    isNextButtonDisabledState,
  );

  const userInfo = useRecoilValue(userInfoState);

  const setSectionState = useSetRecoilState(mainSectionState);

  const loadUser = async () => {
    if (userInfo.current_screen)
      setCurrentScreen(userInfo.current_screen);
    if (userInfo.furthest_screen)
      setFurthestScreen(userInfo.furthest_screen);
    setCheckedAuth(true);
  };

  useEffect(() => {
    async function loadUserAsync() {
      await loadUser();
    }
    loadUserAsync();
    setSectionState('Application');
  }, []);

  if (!checkedAuth) {
    return <Loader />;
  }

  const getCurrentMainBody = () => {
    switch (currentScreen) {
      case 'CompanyInfo':
        return <CompanyInfo />;
      case 'PayrollInfo':
        return <PayrollInfo />;
      case 'BankInfo':
        return <BankInfo />;

      case 'SignAgreements':
        return <SignAgreements />;
    }
    return;
  };

  return (
    <div id="application-pages-container-wrapper">
      <SectionMarker
        currentSection={currentScreen as SectionMarkerSection}
        furthestSection={
          (furthestScreen as SectionMarkerSection) ?? undefined
        }
      />
      <div>
        <div id="application-pages-container" className="main-body">
          {}
          {getCurrentMainBody()}

          <FooterButtons
            screenNamesOnAppPage={props.setScreenNamesOnAppPage}
            nextDisabled={isNextDisabled}
            currentSection={currentScreen as SectionMarkerSection}
            furthestSection={
              (furthestScreen as SectionMarkerSection) ?? undefined
            }
          />
        </div>
      </div>
    </div>
  );
}
export default ApplicationHomePage;
