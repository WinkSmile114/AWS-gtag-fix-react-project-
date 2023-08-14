import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Amplify from 'aws-amplify';
import * as FullStory from '@fullstory/browser';
import { RecoilRoot } from 'recoil';

FullStory.init({ orgId: '15WC9X' });

const REACT_APP_COGNITO_REGION = process.env.REACT_APP_COGNITO_REGION;
const REACT_APP_COGNITO_USER_POOL_ID = process.env.REACT_APP_COGNITO_USER_POOL_ID;
const REACT_APP_COGNITO_APP_CLIENT_ID = process.env.REACT_APP_COGNITO_APP_CLIENT_ID;

Amplify.configure({
  aws_cognito_region: REACT_APP_COGNITO_REGION,
  aws_user_pools_id: REACT_APP_COGNITO_USER_POOL_ID,
  aws_user_pools_web_client_id: REACT_APP_COGNITO_APP_CLIENT_ID,
});

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
