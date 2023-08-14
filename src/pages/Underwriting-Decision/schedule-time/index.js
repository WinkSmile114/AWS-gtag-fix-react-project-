import './index.css';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import TitleSection from '../../../Header/title-section';
import PayroButton from '../../../widgets/PayroButton';
import { getClient } from '../../../api-utils/general-utils';

export default function () {
  const history = useHistory();

  const checkForMadeAppointmentAlready = async () => {
    const client = await getClient();
    if (!client) {
      return;
    }
    const accountRes = await client.accountsControllerGetMyInfo();
    const statusesPastSchedule = [
      'Approved - Not Active',
      'Pending Funding Decision',
      'Funding Declined',
    ];
    if (
      statusesPastSchedule.includes(
        accountRes.data.payro_finance_status,
      )
    ) {
      history.push('/application-status');
    } else {
      setTimeout(checkForMadeAppointmentAlready, 5000);
    }
  };

  useEffect(() => {
    checkForMadeAppointmentAlready();
  }, []);

  return (
    <>
      <TitleSection
        centered
        title="Application Submitted"
        subtitle="Your application was successfully submitted.  Please schedule a call with an underwriter so we can learn more about your business."
      />
      <iframe
        id="chilipiper-iframe"
        width="100%"
        height={500}
        name="scheduleframe"
        src="https://payrofinance.na.chilipiper.com/book/me/ben-cohen"
      />
    </>
  );
}
