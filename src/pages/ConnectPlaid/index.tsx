import PlaidConnector from '../../widgets/PlaidConnector';
import './index.scss';

const ConnectPlaid = () => {
  return (
    <div id="connect-plaid-page-wrapper">
      <h1 id="connect-your-bank-title">Connect your Bank</h1>
      <PlaidConnector justShowConnected={true} />
    </div>
  );
};

export default ConnectPlaid;
