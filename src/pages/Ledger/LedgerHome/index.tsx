import { useEffect } from 'react';
import { getClient } from '../../../api-utils/general-utils';

import {
  GetAccountDto,
  GetAccountDtoFundingStatusEnum,
  GetRepaymentDto,
} from '../../../api-utils/generated-client';
import Loader from '../../../widgets/Loader';

import RepaymentWrapper from './Repayments/wrapper';
import LedgerHighlight from './LedgerHighlight';

import {
  useRecoilValue,
  useSetRecoilState,
  useRecoilState,
} from 'recoil';

import {
  accountRecordState,
  repaymentsState,
} from '../../../recoil-state/general-states';

const LedgerHome = () => {
  const [repayments, setRepayments] = useRecoilState<
    GetRepaymentDto[] | undefined
  >(repaymentsState);

  const [accountDetails, setAccountDetails] =
    useRecoilState<GetAccountDto>(accountRecordState);

  useEffect(() => {
    const getData = async () => {
      const client = await getClient();
      if (!client) {
        return;
      }

      if (!accountDetails) {
        const accountInfo =
          await client.accountsControllerGetMyInfo();
        setAccountDetails(accountInfo.data);
      }
    };

    getData();
  }, []);

  if (!accountDetails) {
    return <Loader />;
  }

  return (
    <>
      <>
        <div>
          <LedgerHighlight
            outstandingBalance={
              accountDetails?.total_outstanding_amount as number
            }
            remainingLineOfCredit={
              accountDetails?.credit_amount_available as number
            }
            originalCreditLimit={
              accountDetails?.approved_credit_amount as number
            }
            status={accountDetails?.payro_finance_status}
            hasLoanNotInNewStatus={
              repayments?.find((l) => l.status != 'New')
                ? true
                : false
            }
          />
        </div>{' '}
        {/* {accountDetails?.funding_status ==
          GetAccountDtoFundingStatusEnum.Yes && <RepaymentWrapper />} */}
        {<RepaymentWrapper />}
      </>
    </>
  );
};

export default LedgerHome;
