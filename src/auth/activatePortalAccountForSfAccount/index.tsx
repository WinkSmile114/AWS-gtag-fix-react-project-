import './index.css';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { getClient } from '../../api-utils/general-utils';

export default function ActivatePortalAccountForPreexistingSfAccount() {
  const location = useLocation();
  useEffect(() => {
    async function activateAccount() {
      let searchString = location.search;
      let searchParams = new URLSearchParams(searchString);
      const email = searchParams.get('contactEmail');
      if (!email) return;

      const client = await getClient(true);

      if (!client) return;

      await client.accountsControllerCreateCognitoUserForExistingSalesforceAccountByContactEmail(
        {
          contactEmail: email,
        },
      );
      window.location.href = '/login?flow=temporarypassword';
    }
    activateAccount().then(() => console.log('imdone'));
  }, []);

  return (
    <div className="main-body">
      You will now receive your temporary password via email
    </div>
  );
}
