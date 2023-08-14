import React from 'react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { updateAccount } from '../../api-utils/account-utils';
import { getClient } from '../../api-utils/general-utils';
import { UpdateBankAccountDto } from '../../api-utils/generated-client';
import CompanyInfo from '../../pages/Application/CompanyInfo';
import { isNextButtonDisabledState } from '../../recoil-state/application-stage-states';
import checkIconWhite from '../../common-icons/checkIconWhite.png';
import {
  bankAccountsState,
  bankAccountToUpdateState,
  needsManualFormState,
  showHideClassNameModalManualFormState,
} from '../../recoil-state/request-funding-states';
import Loader from '../Loader';
import PayroButton from '../PayroButton';
import ManualBankForm from './ManualBankForm';

import './modal.scss';

const ManualBankModal = () => {
  let history = useHistory();

  const [bankAccountToUpdate, setBankAccountToUpdate] =
    useRecoilState<UpdateBankAccountDto>(bankAccountToUpdateState);
  const [
    showHideClassNameModalDisplay,
    setShowHideClassNameModalDisplay,
  ] = useRecoilState(showHideClassNameModalManualFormState);
  const [bankAccounts, setBankAccounts] =
    useRecoilState(bankAccountsState);

  const [isNextDisabled, setIsNextDisabled] = useRecoilState(
    isNextButtonDisabledState,
  );
  const [needsManualForm, setNeedsManualForm] = useRecoilState(
    needsManualFormState,
  );
  const [showLoader, setShowLoader] = useState(false);
  useEffect(() => {}, [showHideClassNameModalDisplay]);
  if (showLoader) {
    return <Loader message="Saving..." />;
  }

  const onSaveFunc = async () => {
    setShowLoader(true);
    const client = await getClient();
    if (!client) {
      return;
    } else {
      if (bankAccountToUpdate.uuid) {
        await client.bankAccountsControllerUpdate(
          bankAccountToUpdate.uuid,
          bankAccountToUpdate,
        );
      }

      const b = await client.bankAccountsControllerFindAll();
      await setBankAccounts(b.data);
      setNeedsManualForm(false);
      setShowHideClassNameModalDisplay('modal display-none');
      setShowLoader(false);
    }
  };

  return (
    <>
      <div id="myModal" className={showHideClassNameModalDisplay}>
        <div className="modal-content-manual">
          <span
            onClick={() => {
              setShowHideClassNameModalDisplay('modal display-none');
            }}
            className="close"
          >
            &times;
          </span>

          <ManualBankForm key={bankAccountToUpdate.uuid} />
          <div className="save-button-wrapper">
            <PayroButton
              disabled={isNextDisabled}
              endIcon={checkIconWhite}
              onClick={() => {
                onSaveFunc();
              }}
            >
              Save
            </PayroButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManualBankModal;
