import { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import './index.scss';
import ProgressCircle from './ProgressCircle.svg';
import ProgressCircleLock from './ProgressCircleLock.svg';
import InProgress from './InProgress.svg';
import { applicationStageSectionNames } from '../../../constants';

export type SectionMarkerSection =
  | 'CompanyInfo'
  | 'PayrollInfo'
  | 'BankStatements'
  | 'SignAgreements';

interface SectionMarkerProps {
  currentSection: SectionMarkerSection;
  furthestSection?: SectionMarkerSection;
}

const SectionMarker = (props: SectionMarkerProps) => {
  let allSections: Array<any> = [];

  let indexOfSelectedSection = applicationStageSectionNames.findIndex(
    (x) => x.apiRef == props.currentSection,
  );

  let indexOfFurthestSection = applicationStageSectionNames.findIndex(
    (x) => x.apiRef == props.furthestSection,
  );
  if (!indexOfFurthestSection || indexOfFurthestSection == -1)
    indexOfFurthestSection = 0;
  if (!indexOfSelectedSection || indexOfSelectedSection == -1)
    indexOfSelectedSection = 0;

  for (let i = 0; i < applicationStageSectionNames.length; i++) {
    allSections.push(
      <div
        key={'section-marker-' + i}
        className={
          'section-marker' +
          (indexOfFurthestSection > i ? ' checked' : '') +
          (props.currentSection ==
          applicationStageSectionNames[i].apiRef
            ? ' selected'
            : '')
        }
      >
        <div className="section-marker-text">
          <p className="section-marker-title">
            {applicationStageSectionNames[i].title}
          </p>
          <p className="section-marker-subtitle">
            {applicationStageSectionNames[i].subtitle}
          </p>
        </div>

        {
          <img
            src={
              indexOfFurthestSection > i
                ? ProgressCircle
                : indexOfFurthestSection == i
                ? InProgress
                : ProgressCircleLock
            }
          ></img>
        }
      </div>,
    );
  }

  return (
    <>
      <div id="section-marker-container">{allSections}</div>
      <div id="need-help-container">
        <p className="need-help-text">Need Help?</p>
        <p className="phone-number">1-833-271-4499</p>
        <p className="monday-fri">Monday-Fri 9am EST-5pm EST</p>
      </div>
      <div id="data-encrypted-container">
        <img
          className="lock-icon"
          src={ProgressCircleLock}
          alt="image"
        />
        <p className="data-encrypted-text"> End-to-end encryption.</p>
      </div>
    </>
  );
};

export default SectionMarker;
