import React from 'react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';

import {
  newCreditRequestState,
  showHideClassNameModalDisplayState,
  uploadedFilesState,
} from '../../../recoil-state/request-funding-states';

import './index.scss';

const ManageBankAccounts = () => {
  let history = useHistory();
  const [
    showHideClassNameModalDisplay,
    setShowHideClassNameModalDisplay,
  ] = useRecoilState(showHideClassNameModalDisplayState);

  return (
    <>
      <div id="myModal" className={showHideClassNameModalDisplay}>
        <div className="modal-content">
          <span
            onClick={() => {
              setShowHideClassNameModalDisplay('modal display-none');
            }}
            className="close"
          >
            &times;
          </span>
          <p className="modal-header ">Coming Soon...</p>
        </div>
      </div>
    </>
  );
};

export default ManageBankAccounts;
