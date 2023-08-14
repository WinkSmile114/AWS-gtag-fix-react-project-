import { useContext, useEffect, useState } from 'react';
import { useFinchConnect } from 'react-finch-connect';
import { getClient } from '../../api-utils/general-utils';
import finchLogo from './finch-logo.png';
import rightArrow from './right-arrow.png';
import checkCircle from './check-circle.png';
import connectIcon from '../../common-icons/connect-icon.png';
import './index.css';
import PayroButton from '../PayroButton';
import { MessageContext } from '../../context';
import { PayrollInfo } from '../../api-utils/generated-client';

import {
  useRecoilValue,
  useSetRecoilState,
  useRecoilState,
} from 'recoil';
import {
  finchPayrollInfoState,
  isThereFutureFinchPayroll,
  isFinchConnectedState,
  payrollCompanyState,
  payrollAmountState,
  numOfEmployeesState,
  payrollFrequencyState,
} from '../../recoil-state/finch-states';
import { uploadedFilesState } from '../../recoil-state/request-funding-states';
import { DateTime, Interval } from 'luxon';

interface FinchConnectorProps {
  isConnectedCallback: Function;
  isDisconnectedCallback?: Function;
  onDisconnect?: Function;
  associatedPhase: string;
  refresh: string;
  level?: any;
  message?: string;
}

export default (props: FinchConnectorProps) => {
  const [code, setCode] = useState<string>();
  // const [isConnected, setIsConnected] = useState(false)//check recoil state 'yes| no | undefined-check '
  const [isConnected, setIsConnected] = useRecoilState(
    isFinchConnectedState,
  );
  const [finchPayrollInfo, setFinchPayrollInfo] = useRecoilState(
    finchPayrollInfoState,
  );
  const [isThereFuturePayroll, setIsThereFuturePayroll] =
    useRecoilState(isThereFutureFinchPayroll);
  const [uploadedFiles, setUploadedFiles] = useRecoilState(
    uploadedFilesState,
  );

  const [payrollCompany, setPayrollCompany] = useRecoilState<any>(
    payrollCompanyState,
  );
  const [payrollAmount, setPayrollAmount] = useRecoilState<any>(
    payrollAmountState,
  );
  const [numOfEmployees, setNumOfEmployees] = useRecoilState<any>(
    numOfEmployeesState,
  );
  const [payrollFrequency, setPayrollFrequency] = useRecoilState<any>(
    payrollFrequencyState,
  );

  const disconnect = () => {
    getClient().then((client) => {
      if (!client) return;
      client.payrollControllerDisconnect().then(() => {
        setIsConnected(false);
        if (props.onDisconnect) {
          props.onDisconnect();
        }
      });
    });
  };

  // const getFinchConnected = async () => {
  //     if (isConnected) {
  //         return isConnected
  //     } else {
  //         const client = await getClient()
  //         if (!client) {
  //             return
  //         }
  //         const res = await client.payrollControllerCheckIfConnectedToFinch()
  //         // console.log('happy days')
  //         // // console.log('finchPayrollInfo: ', finchPayrollInfoFromApi)
  //         return res.data.connected
  //     }

  // }
  const getFinchPayrollInfo =
    async (): Promise<PayrollInfo | void> => {
      if (finchPayrollInfo) {
        return finchPayrollInfo;
      } else {
        const apiClient = await getClient();
        if (!apiClient) {
          return;
        }

        const finchPayrollInfoFromApi =
          await apiClient.payrollControllerGetPayrollInfo(
            props.associatedPhase,
            props.refresh,
          );

        console.log(finchPayrollInfoFromApi.data);

        return finchPayrollInfoFromApi.data;
      }
    };
  const messageContext = useContext(MessageContext);

  const checkIfTheresFuturePayroll = async (data: any) => {
    console.log(data); //shld never be undefined
    if (data == undefined) {
      return;
    }
    if (data != undefined && data.length > 1) {
      const todaysDate = await getTodaysDate();
      for (let i = 0; i < data.length; i++) {
        let date = data[i].pay_date;
        if (
          new Date(date).getTime() / 1000 <
          new Date(todaysDate).getTime() / 1000
        ) {
          setIsThereFuturePayroll('no');
        } else {
          setIsThereFuturePayroll('yes');
        }
      }
    }
  };

  const getTodaysDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    var todaysDate = yyyy + '-' + mm + '-' + dd;
    return todaysDate;
  };
  const setPayrollAndEmployeeInfo = async (data: any) => {
    const payrollFrequency = getPayrollIntervalFromDates(
      data.payment[0].debit_date,
      data.payment[1].debit_date,
    );
    setPayrollFrequency(payrollFrequency);

    const employeeCount = data.payment[0].individual_ids.length;
    const employeeCountString =
      getNumOfEmployeesFromNumber(employeeCount);
    setNumOfEmployees(employeeCountString);

    const payrollCompany = data.introspection.payroll_provider_id;
    setPayrollCompany(payrollCompany);
    const payrollAmount = getAveragePayrollAmountFromNumber(
      (data.payment[0].net_pay.amount +
        data.payment[1].net_pay.amount) /
        2,
    );
    setPayrollAmount(payrollAmount);
  };

  useEffect(() => {
    getClient().then((client) => {
      if (!client) {
        return;
      }
      client
        .payrollControllerCheckIfConnectedToFinch()
        .then((res) => {
          setIsConnected(res.data.connected);
          if (res.data.connected) {
            getFinchPayrollInfo().then((data) => {
              if (data) {
                setFinchPayrollInfo(data);
                checkIfTheresFuturePayroll(data.payment);
                if (props.associatedPhase == 'opportunity') {
                  setPayrollAndEmployeeInfo(data);
                }
              } else {
                messageContext.addMessage({
                  level: 'resent',
                  message:
                    "You're connected to your payroll company. The latest info can't be accessed at this time. Please upload your payroll statements manually.",
                });
              }
              props.isConnectedCallback();
            });
          } else {
            if (props.isDisconnectedCallback) {
              props.isDisconnectedCallback();
            }
          }
          // broadcastPayrollAndCompanyInfo(client)
        });
    });
  }, [isConnected]);

  const onSuccess = ({ code }: { code: string }) => {
    getClient().then((client) => {
      if (!client) {
        return;
      }
      setCode(code);
      client
        .payrollControllerExchange({
          code: code,
        })
        .then((res) => {
          setIsConnected(true);
        });
    });
    // Axios.get(`${process.env.REACT_APP_SERVER}/exchange?code=${code}`)
    // .then(_ => Axios.get(`${process.env.REACT_APP_SERVER}/company`))
    // .then(res => setPayrollInfo(res.data))
  };

  const onError = ({ errorMessage }: { errorMessage: string }) =>
    console.error(errorMessage);
  const onClose = () => console.log('User exited Finch Connect');

  let FinchConfigs: any = {
    clientId: process.env.REACT_APP_FINCH_CLIENT_ID,
    // payrollProvider: '<payroll-provider-id>',
    products: ['company', 'directory', 'payment', 'pay_statement'],
    onSuccess,
    onError,
    onClose,
  };

  if (process.env.REACT_APP_USE_REAL_FINCH !== 'yes') {
    FinchConfigs.sandbox = true;
  }

  const { open } = useFinchConnect(FinchConfigs);

  const wrapperClassName = isConnected
    ? 'finch-wrapper'
    : 'purple-background-color finch-wrapper';

  return (
    <div className={wrapperClassName}>
      {!isConnected && (
        <>
          <div>
            <p className="finch-connect-text">
              Connect Payroll Software
            </p>
            <p className="finch-subtitle">
              Save time and populate automatically all your HCM
              information - safe and secure
            </p>
          </div>
          <PayroButton
            endIcon={connectIcon}
            onClick={() => {
              open();
            }}
          >
            Connect
          </PayroButton>
        </>
      )}

      {isConnected && (
        <>
          <img
            className="finch-logo"
            src={finchLogo}
            alt="HTML5 Icon"
            width="17.54"
            height="24"
          ></img>
          <span className="finch-api-words">Finch api</span>
          <img
            className="finch-right-arrow"
            src={rightArrow}
            alt="HTML5 Icon"
          ></img>
          <img
            className="finch-check-circle"
            src={checkCircle}
            alt="HTML5 Icon"
          ></img>
          <span className="finch-connected-words">Connected</span>
          <span className="disconnect" onClick={() => disconnect()}>
            Disconnect
          </span>
        </>
      )}
    </div>
  );
};
const getNumOfEmployeesFromNumber = (actualNumber: number) => {
  //"1-5" | "5-20" | "21-50" | "51-100" | "101-200" | "moreThan200"
  if (actualNumber > 0 && actualNumber < 6) {
    return '1-5';
  } else if (actualNumber < 21) {
    return '6-20';
  } else if (actualNumber < 51) {
    return '21-50';
  } else if (actualNumber < 101) {
    return '51-100';
  } else if (actualNumber < 201) {
    return '101-200';
  } else {
    return 'moreThan200';
  }
};

const getAveragePayrollAmountFromNumber = (actualNumber: number) => {
  //"1-5" | "5-20" | "21-50" | "51-100" | "101-200" | "moreThan200"

  if (actualNumber > 0 && actualNumber < 5001) {
    return 'less than 5k';
  } else if (actualNumber <= 20000) {
    return '5 - 20k';
  } else if (actualNumber <= 50000) {
    return '21 - 50k';
  } else {
    return '51 - 500k';
  }
};

const getPayrollIntervalFromDates = (
  date1: string,
  date2: string,
): 'monthly' | 'bimonthly' | 'weekly' | 'biweekly' => {
  const a = DateTime.fromISO(date1);
  const b = DateTime.fromISO(date2);
  const interval = Interval.fromDateTimes(b, a);
  const intervalDays = interval.length('days');

  switch (intervalDays) {
    case 30:
      return 'monthly';
    case 31:
      return 'monthly';
    case 14:
      return 'biweekly';
    case 15:
      return 'bimonthly';
    case 16:
      return 'bimonthly';
    case 7:
      return 'weekly';
    case 6:
      return 'weekly';
  }

  return 'monthly';
};
