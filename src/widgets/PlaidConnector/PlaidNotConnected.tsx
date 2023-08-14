import PayroButton from '../PayroButton';
import connectIcon from '../../common-icons/connect-icon.png';
import { usePlaidLink } from 'react-plaid-link';
import React, { useEffect, useState } from 'react';
import { getClient } from '../../api-utils/general-utils';
import { useRecoilState } from 'recoil';
import { isPlaidConnectedState } from '../../recoil-state/general-states';
import { bankAccountsState } from '../../recoil-state/request-funding-states';
import Loader from '../Loader';

interface PlaidProps {
  stage?: string;
}

const PlaidNotConnected = (props: PlaidProps) => {
  const [isPlaidConnected, setIsPlaidConnected] = useRecoilState(
    isPlaidConnectedState,
  );
  const [linkToken, setLinkToken] = useState<string>();
  const [showLoader, setShowLoader] = useState(false);
  const [bankAccounts, setBankAccounts] =
    useRecoilState(bankAccountsState);

  const onSuccess = React.useCallback((public_token: string) => {
    // send public_token to server
    const setToken = async () => {
      const client = await getClient();
      if (!client) return;
      setShowLoader(true);

      const response = await client.plaidControllerSetAccessToken({
        access_token: public_token,
      });

      const banksIncludingPlaid =
        await client.bankAccountsControllerFindAll();
      setBankAccounts(banksIncludingPlaid.data);

      setIsPlaidConnected('yes');

      setShowLoader(false);
    };
    setToken();
  }, []);

  let isOauth = false;
  const config: Parameters<typeof usePlaidLink>[0] = {
    token: linkToken!,
    onSuccess,
  };

  if (window.location.href.includes('?oauth_state_id=')) {
    // TODO: figure out how to delete this ts-ignore
    // @ts-ignore
    config.receivedRedirectUri = window.location.href;
    isOauth = true;
  }

  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    if (isOauth && ready) {
      open();
    }
  }, [ready, open, isOauth]);

  useEffect(() => {
    const getToken = async () => {
      const client = await getClient();

      if (!client) {
        return;
      }

      const linkResponse: any =
        await client.plaidControllerCreateLinkToken();
      setShowLoader(true);
      setLinkToken(linkResponse.data.link_token);
      setShowLoader(false);
      return linkResponse.data.link_token;
    };
    getToken();
  }, []);
  if (showLoader) {
    return <Loader />;
  }

  return (
    <div>
      <div>
        {props.stage != 'repeat-funding' ? (
          <div className="finicity-wrapper purple-background-color">
            <p className="finicity-connect-text">Connect Your Bank</p>

            <p className="finicity-subtitle">
              Save time and connect your bank account. <br /> Payro
              only has permission to view statements.
            </p>
            <div className="button-wrapper">
              <PayroButton
                buttonSize="small"
                endIcon={connectIcon}
                onClick={() => open()}
              >
                Connect
              </PayroButton>
            </div>
          </div>
        ) : (
          <div className="dashboard-no-connected-bank-wrapper">
            <span className="connected-bank-name bank-balance-title">
              Bank Balance:
            </span>
            <div className="button-wrapper">
              <PayroButton
                buttonSize="medium"
                variant="white"
                onClick={() => open()}
              >
                Connect Bank Account
              </PayroButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaidNotConnected;
