import { useEffect, useState } from 'react';

import InfoIcon from '../../../common-icons/info-icon.svg';
import '../index.scss';
import { useRecoilState } from 'recoil';
import {
  bankAccountToUpdateState,
  needsManualFormState,
  showHideClassNameModalManualFormState,
} from '../../../recoil-state/request-funding-states';
import { UpdateBankAccountDto } from '../../../api-utils/generated-client';

interface OpenModalLinkProps {
  showLink?: boolean;
  bankAccountLastFour?: string;
}
const OpenModalLink = (props: OpenModalLinkProps) => {
  const [needsManualForm, setNeedsManualForm] = useRecoilState(
    needsManualFormState,
  );
  const [
    showHideClassNameModalDisplay,
    setShowHideClassNameModalDisplay,
  ] = useRecoilState(showHideClassNameModalManualFormState);
  const [bankAccountToUpdate, setBankAccountToUpdate] =
    useRecoilState<UpdateBankAccountDto>(bankAccountToUpdateState);

  return (
    <>
      {props.showLink && (
        <div className="text-and-icon-wrapper">
          <a
            className="info-text-label"
            onClick={async () => {
              setNeedsManualForm(true);

              await setShowHideClassNameModalDisplay(
                'modal display-block',
              );
            }}
          >
            Chase Bank {props.bankAccountLastFour} requires account
            numbers to be entered manually.{' '}
            <span className="underline">Click Here</span>
          </a>
        </div>
      )}
    </>
  );
};

export default OpenModalLink;
