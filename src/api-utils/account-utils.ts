import 'axios';
import axios from 'axios';
import { components } from './swagger-schema';
import { addBearerHeader } from './general-utils';

type UpdateAccountInfo = components['schemas']['UpdateAccountDto'];

const createAccount = async (idToken: string) => {
  const headers = addBearerHeader(idToken, {});
  const res = await axios.post(
    `${process.env.REACT_APP_API}/accounts/create-from-id-token`,
    {},
    { headers },
  );
  return res.data;
};

const updateAccount = async (
  idToken: string,
  updateAccountInfo: UpdateAccountInfo,
) => {
  const headers = addBearerHeader(idToken, {});
  const res = await axios.patch(
    `${process.env.REACT_APP_API}/accounts/`,
    updateAccountInfo,
    { headers },
  );
  return res.data;
};

const getAccountDetails = async (idToken: string) => {
  const headers = addBearerHeader(idToken, {});
  const res = await axios.get(
    `${process.env.REACT_APP_API}/accounts/`,
    {
      headers,
    },
  );

  return res.data;
};

export { createAccount, getAccountDetails, updateAccount };
