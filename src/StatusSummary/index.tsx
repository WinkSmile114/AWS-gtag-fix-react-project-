import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';

export const StatusSummary = () => {
  const [authInfo, setAuthInfo] = useState(null);

  useEffect(() => {
    Auth.currentAuthenticatedUser().then((res) => setAuthInfo(res));
  }, [authInfo]);

  return <div>authInfo</div>;
};
