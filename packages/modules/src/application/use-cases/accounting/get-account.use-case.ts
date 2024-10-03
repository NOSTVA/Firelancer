import { BigNumber } from "bignumber.js";
import { getInjection } from "../../../di/container.js";
import { Account } from "../../../entities/models/account.js";

export async function getAccountUseCase(input: {
  userId: string;
}): Promise<
  (Account & { availableBalance: string; pendingBalance: string }) | undefined
> {
  const accountsRepository = getInjection("IAccountsRepository");

  const account = await accountsRepository.getAccountByUserId(input.userId);
  if (!account) {
    throw new Error(
      "User does not have balance account. please contact support"
    );
  }

  const settledTransaction =
    await accountsRepository.getLatestSettledAccountTransaction(account.id);
  const unsettledTransactions =
    await accountsRepository.getUnsettledAccountTransactions(account.id);

  const availableBalance = settledTransaction?.balance ?? "0";
  const pendingBalance = unsettledTransactions.reduce<string>(
    (acc, { credit, debit }) => {
      return new BigNumber(acc).plus(credit).minus(debit).toString();
    },
    "0"
  );

  return {
    ...account,
    availableBalance,
    pendingBalance
  };
}
