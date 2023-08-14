import { getClient } from '../../../api-utils/general-utils';
import {
  BankAccount,
  CreateBankAccountDto,
} from '../../../api-utils/generated-client';

export const persistAllBankInfo = async (
  dealRecord: any,
  setDealRecord: Function,
  bankAccounts: Array<BankAccount>,
) => {
  const client = await getClient();
  if (!client) {
    return;
  }

  //find deposit bank and withdrawal bank and update those
  const depositBankAccount = bankAccounts.find(
    (bankAccount) =>
      bankAccount.uuid == dealRecord.deposit_bank_account,
  );
  let withdrawalBankAccount;
  if (
    dealRecord.withdrawal_bank_account !=
    dealRecord.deposit_bank_account
  ) {
    withdrawalBankAccount = bankAccounts.find(
      (bankAccount) =>
        bankAccount.uuid == dealRecord.withdrawal_bank_account,
    );
  }

  if (depositBankAccount) {
    let depositBankCopy: CreateBankAccountDto = {
      uuid: depositBankAccount.uuid as string,
      bank_name: depositBankAccount.bank_name as string,
      bank_account_number:
        depositBankAccount.bank_account_number as string,
      bank_routing_number:
        depositBankAccount.bank_routing_number as string,
    };
    //  await client.bankAccountsControllerUpsert(depositBankCopy);
  }

  if (withdrawalBankAccount) {
    let withdrawalBankCopy: CreateBankAccountDto = {
      uuid: withdrawalBankAccount.uuid as string,
      bank_name: withdrawalBankAccount.bank_name as string,
      bank_account_number:
        withdrawalBankAccount.bank_account_number as string,
      bank_routing_number:
        withdrawalBankAccount.bank_routing_number as string,
    };
    // await client.bankAccountsControllerUpsert(withdrawalBankCopy);
  }
  // if (!depositBank || !depositBank.uuid || !depositBank.bank_account_number || !depositBank.bank_name || !depositBank.bank_routing_number) {
  //     return
  // }

  await client.dealsControllerUpdate({
    deposit_bank_account: dealRecord.deposit_bank_account,
    withdrawal_bank_account: dealRecord.withdrawal_bank_account,
  });

  await client.bankAccountsControllerSelectForDeposit(true, {
    uuid: dealRecord.deposit_bank_account,
  });
  await client.bankAccountsControllerSelectForWithdrawal(true, {
    uuid: dealRecord.withdrawal_bank_account,
  });
};
