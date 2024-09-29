import { inject, injectable } from "inversify";
import { isAfter } from "date-fns";
import { randomUUID } from "crypto";
import { BigNumber } from "bignumber.js";
import { IAccountingService } from "../../application/services/accounting.service.interface.js";
import { DI_SYMBOLS } from "../../di/types.js";
import { getInjection } from "../../di/container.js";
import { Account } from "../../entities/models/account.js";
import { Transaction } from "../../entities/models/transaction.js";
import { TransactionScope } from "../../application/repositories/transaction.interface.js";
import type { IAccountsRepository } from "../../application/repositories/accounts.repository.interface.js";
import type { ITransactionsRepository } from "../../application/repositories/transactions.repository.interface.js";

@injectable()
export class AccountingService implements IAccountingService {
  constructor(
    @inject(DI_SYMBOLS.IAccountsRepository)
    private _accountsRepository: IAccountsRepository,
    @inject(DI_SYMBOLS.ITransactionsRepository)
    private _transactionsRepository: ITransactionsRepository,
  ) {}

  async initializeTransaction(details: {
    sender?: {
      accountId: string;
    };
    recipient?: {
      accountId: string;
    };
    amount: string;
    dueDate?: Date;
    orderId?: string;
  }): Promise<Transaction> {
    const transaction = getInjection("ITransaction");

    return transaction.create(async (tx) => {
      let senderAccount: Account | undefined;
      let recipientAccount: Account | undefined;

      if (details.sender?.accountId) {
        senderAccount = await this._accountsRepository.getAccountById(
          details.sender.accountId,
          tx,
        );
      }

      if (details.recipient?.accountId) {
        recipientAccount = await this._accountsRepository.getAccountById(
          details.recipient.accountId,
          tx,
        );
      }

      console.log({ senderAccount, recipientAccount });

      if (!senderAccount && !recipientAccount) {
        throw new Error(
          "At least one of sender or recipient must have a valid account.",
        );
      }

      // perform some accounts constraints checking
      // ...

      // create accounting transaction
      const createdTransaction =
        await this._transactionsRepository.createTransaction(
          {
            id: randomUUID(),
            amount: details.amount,
            senderAccountId: senderAccount?.id ?? null,
            recipientAccountId: recipientAccount?.id ?? null,
            creationDate: new Date(),
            orderId: details.orderId ?? null,
          },
          tx,
        );

      // create unsetteled balance entires
      if (senderAccount) {
        const balanceEntry = await this._accountsRepository.createBalanceEntry(
          {
            id: randomUUID(),
            accountId: senderAccount.id,
            creationDate: new Date(),
            credit: "0",
            debit: createdTransaction.amount,
            relatedTransactionId: createdTransaction.id,
            relatedBalanceEntryId: null,
            dueDate: null,
            settledDate: null,
            balance: null,
            prevBalance: null,
            prevSettledDate: null,
          },
          tx,
        );

        await this.settleAccountBalance(balanceEntry.id, tx);
      }

      if (recipientAccount) {
        const balanceEntry = await this._accountsRepository.createBalanceEntry(
          {
            id: randomUUID(),
            accountId: recipientAccount.id,
            creationDate: new Date(),
            credit: createdTransaction.amount,
            debit: "0",
            relatedTransactionId: createdTransaction.id,
            relatedBalanceEntryId: null,
            dueDate: details.dueDate ?? null,
            settledDate: null,
            balance: null,
            prevBalance: null,
            prevSettledDate: null,
          },
          tx,
        );

        await this.settleAccountBalance(balanceEntry.id, tx);
      }

      return createdTransaction;
    });
  }
  async settleAccountBalance(
    balanceEntryId: string,
    ptx?: TransactionScope,
  ): Promise<void> {
    const transaction = getInjection("ITransaction");

    transaction.create(async (tx) => {
      tx = ptx ?? tx;

      const balanceEntry = await this._accountsRepository.getBalanceEntryById(
        balanceEntryId,
        tx,
      );

      if (!balanceEntry) {
        throw new Error("Balance Entry Settlement: Entry does not exist");
      }

      const isSettled = balanceEntry.settledDate && balanceEntry.balance;
      const isDeferred =
        balanceEntry.dueDate && isAfter(balanceEntry.dueDate, new Date());

      if (isSettled) {
        throw new Error("Balance Entry Settlement: Balance already settled");
      }

      if (isDeferred) {
        throw new Error(
          "Balance Entry Settlement: Balance cannot be settled at the moment",
        );
      }

      // The entry is neither settled nor deferred (meaning it’s eligible for settlement)
      // perform settlement:
      const latestSettledEntry =
        await this._accountsRepository.getLatestSettledBalanceEntry(
          balanceEntry.accountId,
          tx,
        );

      const prevSettledDate = latestSettledEntry?.settledDate ?? null;
      const prevBalance = new BigNumber(latestSettledEntry?.balance ?? "0");
      const credit = new BigNumber(balanceEntry.credit);
      const debit = new BigNumber(balanceEntry.debit);
      const balance = new BigNumber(prevBalance ?? "0")
        .plus(credit)
        .minus(debit);

      if (debit.isLessThan(0) || credit.isLessThan(0)) {
        throw new Error("Debits and credits cannot be negative values.");
      }

      if (debit.isEqualTo(0) && credit.isEqualTo(0)) {
        throw new Error("Debits and credits both cannot be 0");
      }

      if (balance.isLessThan(0)) {
        throw new Error("Balance caanot be negative.");
      }

      const settledEntry =
        await this._accountsRepository.updateBalanceEntryById(
          balanceEntry.id,
          {
            prevBalance: prevBalance.toString(),
            prevSettledDate: prevSettledDate,
            balance: balance.toString(),
            settledDate: new Date(),
          },
          tx,
        );

      if (!settledEntry) {
        throw new Error(
          "Balance Entry Settlement: Could not settle balance entry please try again",
        );
      }
    });
  }
}
