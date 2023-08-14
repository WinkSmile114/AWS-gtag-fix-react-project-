import 'axios';
import axios from 'axios';
import { components } from './swagger-schema';
import { addBearerHeader } from './general-utils';

type ExchangeTokenRequest =
  components['schemas']['ExchangeTokenRequest'];

const exchangeToken = async (
  idToken: string,
  exchangeTokenRequst: ExchangeTokenRequest,
) => {
  const headers = addBearerHeader(idToken, {});
  const res = await axios.post(
    `${process.env.REACT_APP_API}/payroll/exchange`,
    exchangeTokenRequst,
    { headers },
  );
  return res.data;
};

export { exchangeToken };
