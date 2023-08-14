/* eslint-disable import/no-anonymous-default-export */
import { useEffect, useState } from 'react';
import { getClient } from '../../api-utils/general-utils';
import {
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import OnboardingWrapper from './Wrappers/onboarding';
import RepeatFundingWrapper from './Wrappers/repeatFunding';
import './index.scss';
import NoCreditAvailIcon from '../../common-icons/maintenance.svg';
import closeX from '../../common-icons/closex.svg';
import {
  dealDraftState,
  fundingStepState,
  sectionState,
} from '../../recoil-state/request-funding-states';
import {
  accountRecordState,
  mainSectionState,
} from '../../recoil-state/general-states';
import Loader from '../../widgets/Loader';
import { GetAccountDto } from '../../api-utils/generated-client';
import { useHistory } from 'react-router-dom';

interface RequestFundingProps {
  section: 'onboarding' | 'more-funding';
  // fundingStep: 'funding-amount' | 'congrats'
}

export default (props: RequestFundingProps) => {
  let history = useHistory();
  const setDealState = useSetRecoilState(dealDraftState);
  const [accountDetails, setAccountDetails] =
    useRecoilState<GetAccountDto>(accountRecordState);
  const setSection = useSetRecoilState(sectionState);
  const setMainSection = useSetRecoilState(mainSectionState);
  const [gotApi, setGotApi] = useState(false);
  const [fundingStep, setFundingStep] =
    useRecoilState(fundingStepState);

  useEffect(() => {
    const getDataNeededByAllComponents = async () => {
      const client = await getClient();
      if (!client) {
        return;
      }
      client.dealsControllerGetDraftDeal().then(({ data }) => {
        setDealState(data);
      });
      const accountData = await client.accountsControllerGetMyInfo();
      setAccountDetails(accountData.data);
      setSection(props.section);
      setMainSection(
        props.section === 'onboarding'
          ? 'Onboarding'
          : 'RepeatFunding',
      );
    };
    getDataNeededByAllComponents().then(() => {
      setGotApi(true);
    });
  }, [props.section]);

  useEffect(() => {
    if (
      props.section === 'more-funding' &&
      fundingStep == 'congrats'
    ) {
      setFundingStep('funding-amount');
    }
  });
  if (!gotApi) {
    return <Loader />;
  }

  return props.section == 'onboarding' ? (
    <OnboardingWrapper />
  ) : (accountDetails.credit_amount_available as number) <= 0 ? (
    <div id="request-more-outer-wrapper-no-available-credit">
      <img
        id="close-request-more"
        src={closeX}
        onClick={() => history.push('/dashboard')}
      />
      <div id="no-available-credit-title-and-image-wrapper">
        <p id="no-available-credit-text-title">
          Your account is currently unable to request funding
        </p>
        <img src={NoCreditAvailIcon} alt="maintenance" />
      </div>{' '}
    </div>
  ) : (
    <RepeatFundingWrapper />
  );
};
