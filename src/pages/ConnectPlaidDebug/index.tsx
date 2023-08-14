import PlaidConnector from '../../widgets/PlaidConnector';
import './index.scss';
import React, {
  useEffect,
  useContext,
  useState,
  useCallback,
} from 'react';

import { getClient } from '../../api-utils/general-utils';

const ConnectPlaidDebug = () => {

  useEffect(() => {
    const checkConnectedStatus = async () => {

      const client = await getClient();
      if (!client) {
        return;
      }

      let apps = await client.plaidControllerGetItem();
      console.log('apps============>',apps)
    }
    checkConnectedStatus().then(() => {});
  }, []);

  return (
    <div id="connect-plaid-page-wrapper">
      <h1 id="connect-your-bank-title">Connect your Bank</h1>
      <PlaidConnector justShowConnected={true} />
    </div>
  );
};

export default ConnectPlaidDebug;