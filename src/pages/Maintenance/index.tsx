import './index.css';
import maintenance from '../../common-icons/maintenance.svg';

export default () => {
  return (
    <div id="maintenance-wrapper">
      {/* <img src="https://media.payrofinance.com/maintenance.png" alt="maintenance" /> */}
      <img src={maintenance} alt="maintenance" />
      <h1 id="maintenance-title">Under Construction. Coming Soon!</h1>
      <p id="maintenance-message">
        In the meantime, please email processing@payrofinance.com or
        call us at 1-833-271-4499. Thanks for waiting! Check back in a
        few days.
      </p>
    </div>
  );
};
