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
      "User does not have balance account. please contact support",
    );
  }

  const settledBalanceTransaction =
    await accountsRepository.getLatestSettledAccountTransaction(account.id);
  const unsettledBalanceTransactions =
    await accountsRepository.getUnsettledAccountTransactions(account.id);

  const availableBalance = settledBalanceTransaction?.balance ?? "0";
  const pendingBalance = unsettledBalanceTransactions.reduce<string>(
    (acc, { credit, debit }) => {
      return new BigNumber(acc).plus(credit).minus(debit).toString();
    },
    "0",
  );

  return {
    ...account,
    availableBalance,
    pendingBalance,
  };
}
