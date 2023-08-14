import { DefaultApi } from './generated-client/api';
import { Configuration } from './generated-client/configuration';
import { getJwt } from '../auth/utils/auth-utils';

const addBearerHeader = (
  token: string,
  headersObject: { [key: string]: any },
) => {
  headersObject['Authorization'] = `Bearer ${token}`;
  return headersObject;
};

const getClient = async (ignoreToken?: boolean) => {
  let apiService;
  if (ignoreToken) {
    apiService = new DefaultApi(
      new Configuration({
        basePath: process.env.REACT_APP_API,
      }),
    );
  } else {
    const token = await getJwt();
    if (!token) {
      //    alert('It seems your session expired.  Refresh your page and try again')
      return;
    }
    apiService = new DefaultApi(
      new Configuration({
        accessToken: token,
        basePath: process.env.REACT_APP_API,
      }),
    );
  }
  return apiService;
};

export { addBearerHeader, getClient };
