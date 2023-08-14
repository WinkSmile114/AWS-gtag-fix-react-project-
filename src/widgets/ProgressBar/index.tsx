import { useState } from 'react';
import './index.css';
import { formatNumberAsDollars } from '../../utils';
import checkIcon from './CheckIcon.svg';

interface ProgressBarProps {
  percentComplete: number;
  sectionName?:
    | 'Application Underwriting'
    | 'Onboarding'
    | 'LedgerHome';
}

export default ({
  percentComplete,
  sectionName,
}: ProgressBarProps) => {
  if (sectionName === 'Application Underwriting') {
    return (
      <>
        <div
          id="progress-bar-wrapper-application"
          className="header-pg-bar-wrapper"
        >
          {sectionName && (
            <div className="section-name-flex-wrapper">
              <p id="pg-bar-section-name">{sectionName}</p>
            </div>
          )}
          <div id="pg-bar-content">
            <div id="progress-bar-container-v1">
              <div
                className={'width-' + percentComplete + '-percent'}
                id="part-completed"
              ></div>
              <div
                className={
                  'width-' + (100 - percentComplete) + '-percent'
                }
              ></div>
            </div>
            <div id="percent-complete-text-right-side">
              <img src={checkIcon}></img>
              {percentComplete == 1 ? 0 : percentComplete}%
            </div>
          </div>
        </div>
      </>
    );
  }

  if (sectionName == 'LedgerHome') {
    return (
      <>
        <div id="progress-bar-container-v3">
          <div
            className={'width-' + percentComplete + '-percent'}
            id="green-completed"
          ></div>
          <div
            className={
              'width-' + (100 - percentComplete) + '-percent'
            }
          ></div>
        </div>
      </>
    );
  }

  return (
    <>
      {sectionName && <p id="pg-bar-section-name">{sectionName}</p>}
      <div id="progress-bar-container">
        <div
          className={'width-' + percentComplete + '-percent'}
          id="part-completed"
        ></div>
        <div id="percent-complete-text">{percentComplete}%</div>
        <div
          className={'width-' + (100 - percentComplete) + '-percent'}
        ></div>
      </div>
    </>
  );
};
