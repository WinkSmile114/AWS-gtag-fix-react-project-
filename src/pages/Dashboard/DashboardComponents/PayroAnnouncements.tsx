import { useEffect, useState } from 'react';
import icon from '../../../common-icons/payro-announcements-icon.svg';
import backArrow from '../../../common-icons/dashboard-back-arrow.svg';
import forwardArrow from '../../../common-icons/dashboard-forward-arrow.svg';
import '../index.scss';

const PayroAnnouncements = () => {
  return (
    <div>
      <div id="half-circle-thick"></div>
      <div id="half-circle-one"></div>
      <div id="half-circle-two"></div>
      <div id="half-circle-three"></div>
      <div id="half-circle-small-one"></div>
      <div id="half-circle-small-two"></div>
      <div className="payro-announcements-header-wrapper">
        <img src={icon} />
        <p className="payro-announcements-title">
          Payro Announcements:
        </p>
      </div>
      <div className="announcements-arrow-wrapper">
        <img className="arrow-wrapper" src={backArrow} />
        <p className="no-announcements-style">
          No current announcements. Check back soon.
        </p>
        <img className="arrow-wrapper" src={forwardArrow} />
      </div>
    </div>
  );
};

export default PayroAnnouncements;
