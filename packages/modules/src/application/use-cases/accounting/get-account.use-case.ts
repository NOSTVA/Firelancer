import { BigNumber } from "bignumber.js";
import { getInjection } from "../../../di/container.js";
import { Account } from "../../../entities/models/account.js";

export async function getAccountUseCase(input: {
  userId: string;
}): Promise<
  (Account & { availableBalance: string; pendingBalance: string }) | undefined
> {
  const accountsRepository = getInjection("IAccountsRepository");

  const existingAccount = await accountsRepository.getAccountByUserId(
    input.userId,
  );

  if (!existingAccount) {
    return undefined;
  }

  const settledBalanceEntry =
    await accountsRepository.getLatestSettledBalanceEntry(existingAccount.id);
  const unsettledBalanceEntries =
    await accountsRepository.getUnsettledBalanceEntries(existingAccount.id);

  const availableBalance = settledBalanceEntry?.balance ?? "0";
  const pendingBalance = unsettledBalanceEntries.reduce<string>(
    (acc, { credit, debit }) => {
      return new BigNumber(acc).plus(credit).minus(debit).toString();
    },
    "0",
  );

  return {
    ...existingAccount,
    availableBalance,
    pendingBalance,
  };
}
