import { useEffect, useState } from 'react';
import { getClient } from '../../api-utils/general-utils';
import './index.scss';
import Loader from '../../widgets/Loader'

const WireInfo = () => {
  const [payroBankInfo, setPayroBankInfo] = useState<string[]>();

  useEffect(() => {
    const getSendToPayroInfo = async () => {
      const client = await getClient();
      if (!client) {
        return;
      }
      const sendToPayroInfo =
        await client.bankAccountsControllerGetSendToPayroInfo();
      setPayroBankInfo(sendToPayroInfo.data);
    };
    getSendToPayroInfo().then(() => {});
  }, []);
  if (!payroBankInfo) {
    return <Loader />
  }
  const bankInfoDisplay = payroBankInfo.map((bankLine, idx) => {
    return <p key={"bankLine"+idx}>{bankLine}</p>
  })

  return <div id="wire-info-page">
  <h3 id="wire-info-title">How to Wire Money to Payro</h3>
  <div id="wire-info">{bankInfoDisplay}</div>
  </div>;
};

export default WireInfo;
