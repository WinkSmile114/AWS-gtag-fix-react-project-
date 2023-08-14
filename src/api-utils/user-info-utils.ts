import axios, { AxiosResponse } from 'axios';
import { addBearerHeader } from './general-utils';

interface UserInfoResponse extends AxiosResponse {
  current_screen: string;
}

const getUserInfo = async (
  idToken: string,
): Promise<UserInfoResponse | null> => {
  const headers = addBearerHeader(idToken, {});
  const res = await axios.get(
    `${process.env.REACT_APP_API}/user-info`,
    { headers },
  );

  if (!res.data) {
    return null;
  }

  return res.data as UserInfoResponse;
};

const updateUserInfo = async (
  idToken: string,
  propertyKey: string,
  propertyValue: string,
) => {
  const headers = addBearerHeader(idToken, {});
  const res = await axios.post(
    `${process.env.REACT_APP_API}/user-info/`,
    {
      propertyKey,
      propertyValue,
    },
    { headers },
  );
  return res;
};

export { getUserInfo, updateUserInfo };
