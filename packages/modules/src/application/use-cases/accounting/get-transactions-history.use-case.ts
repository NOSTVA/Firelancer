import { getInjection } from "../../../di/container.js";
import { AccountTransaction } from "../../../entities/models/account-transaction.js";

export async function getTransactionHistoryUseCase(input: { userId: string }) {
  const accountsRepository = getInjection("IAccountsRepository");

  const account = await accountsRepository.getAccountByUserId(input.userId);
  if (!account) {
    throw new Error("User does not have balance account. please contact support");
  }

  const transactions = await accountsRepository.getAccountTransactions(account.id);

  const transactionsHistory = transactions.reduce<{
    pendingTransactions: AccountTransaction[];
    settledTransactions: AccountTransaction[];
  }>(
    (acc, entry) => {
      if (entry.settledDate && entry.balance) {
        acc.settledTransactions.push(entry);
      } else {
        acc.pendingTransactions.push(entry);
      }
      return acc;
    },
    {
      pendingTransactions: [],
      settledTransactions: [],
    }
  );

  return transactionsHistory;
}
