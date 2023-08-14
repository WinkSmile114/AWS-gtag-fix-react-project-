import Amplify, { Auth } from 'aws-amplify';

interface ChallengeParam {
  CODE_DELIVERY_DELIVERY_MEDIUM: string;
  CODE_DELIVERY_DESTINATION: string;
}

export interface CognitoUserInfo {
  challengeName: string;
  challengeParam: ChallengeParam;
}

async function signUp(
  firstName: string,
  lastName: string,
  username: string,
  password: string,
  phone_number: string,
  companyName: string,
  payrollCompany: string,
  payrollAmount: number,
  referralSource?: string | null,
) {
  const attributes: any = {
    given_name: firstName,
    family_name: lastName,
    email: cleanUsername(username), // optional
    phone_number: `+1${phone_number}`,
    'custom:companyNameNew': companyName,
  };
  if (referralSource) {
    attributes['custom:referralSource'] = referralSource;
  }
  const trimmedPassword = password.trim();

  const { user } = await Auth.signUp({
    username: cleanUsername(username),
    password: trimmedPassword,
    attributes,
  });
}

function cleanUsername(username: string) {
  return username.toLowerCase().trim();
}

async function confirmSignUp(username: string, code: string) {
  await Auth.confirmSignUp(cleanUsername(username), code);
}

async function enterMfa(user: any, code: string) {
  await Auth.confirmSignIn(user, code, 'SMS_MFA');
}

async function resendConfirmationCode(username: string) {
  await Auth.resendSignUp(cleanUsername(username));
}

async function signIn(
  username: string,
  password: string,
): Promise<any | null> {
  const trimmedPassword = password.trim();
  const user = await Auth.signIn(
    cleanUsername(username),
    trimmedPassword,
  );

  return user;
}

async function resendMfa() {}

async function signOut() {
  try {
    await Auth.signOut({ global: true });
  } catch (error) {}
}

async function isSignedIn(): Promise<any> {
  return getCurrentAuthUser()
}

async function getCurrentAuthUser(): Promise<any> {
  return Auth.currentAuthenticatedUser();
}

async function getJwt(): Promise<string | null> {
  let currentSession;
  try {
    currentSession = await Auth.currentSession();
  } catch (err) {
    return null;
  }
  return currentSession?.getIdToken().getJwtToken();
}

async function forgotPassword(email: string) {
  let res = await Auth.forgotPassword(cleanUsername(email));
  return res;
}
// Collect confirmation code and new password, then
async function forgotPasswordSubmit(
  username: string,
  code: string,
  new_password: string,
) {
  const newPasswordTrimmed = new_password.trim();
  let res = await Auth.forgotPasswordSubmit(
    cleanUsername(username),
    code,
    newPasswordTrimmed,
  );
}
async function createPassword(
  user: any,
  new_password: string,
  firstName: string,
  lastName: string,
) {
  const attributes: any = {
    given_name: firstName,
    family_name: lastName,
  };
  await Auth.completeNewPassword(user, new_password, attributes).then(
    (user) => {},
  );
}
async function updateEmail(
  email: string,
): Promise<any> {
  const user = await Auth.currentAuthenticatedUser();
  if(email){
    return await Auth.updateUserAttributes(user, { email: email });
  }
  return;
}
async function updatePhone(
  phone: string,
): Promise<any> {
  const user = await Auth.currentAuthenticatedUser();
  if(phone){
    return await Auth.updateUserAttributes(user, { phone_number: phone });
  }
  return;
}



export {
  signUp,
  confirmSignUp,
  resendConfirmationCode,
  signIn,
  signOut,
  enterMfa,
  isSignedIn,
  getCurrentAuthUser,
  getJwt,
  forgotPassword,
  forgotPasswordSubmit,
  createPassword,
  updateEmail,
  updatePhone
};
