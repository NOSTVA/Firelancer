import { inject, injectable } from "inversify";
import { isBefore } from "date-fns";
import { randomUUID } from "crypto";
import { BigNumber } from "bignumber.js";
import { IAccountingService } from "../../application/services/accounting.service.interface.js";
import { DI_SYMBOLS } from "../../di/types.js";
import { getInjection } from "../../di/container.js";
import type { IAccountsRepository } from "../../application/repositories/accounts.repository.interface.js";
import {
  AccountTransaction,
  AccountTransactionType
} from "../../entities/models/account-transaction.js";
import { TransactionScope } from "../../application/repositories/transaction.interface.js";

@injectable()
export class AccountingService implements IAccountingService {
  constructor(
    @inject(DI_SYMBOLS.IAccountsRepository)
    private _accountsRepository: IAccountsRepository
  ) {}

  async initializeAccountTransaction(details: {
    userId: string;
    type: AccountTransactionType;
    credit: string;
    debit: string;
    reviewDueDate?: Date;
    meta?: Record<string, string>;
  }): Promise<AccountTransaction> {
    const transaction = getInjection("ITransaction");

    const createdTransaction = await transaction.create(async (tx) => {
      const account = await this._accountsRepository.getAccountByUserId(
        details.userId,
        tx
      );

      if (!account) {
        throw new Error(
          "user does not have a valid account. please contact devs"
        );
      }

      // perform some constraints checking
      // ...

      const transactionId = randomUUID();
      const transactionMeta = Object.entries(details.meta || {}).map(
        ([key, value]) => ({
          id: randomUUID(),
          accountTransactionId: transactionId,
          metaKey: key,
          metaValue: value
        })
      );

      const createdTransaction =
        await this._accountsRepository.createAccountTransaction(
          {
            id: transactionId,
            accountId: account.id,
            type: details.type,
            creationDate: new Date(),
            credit: details.credit,
            debit: details.debit,
            relatedTransactionId: null,
            reviewDueDate: null,
            settledDate: null,
            balance: null,
            prevBalance: null,
            prevSettledDate: null,
            meta: transactionMeta
          },
          tx
        );

      // immediatly settle the transaction of has no review due date
      if (!details.reviewDueDate) {
        await this.settleAccountTransaction(createdTransaction.id, tx);
      }

      return createdTransaction;
    });

    return createdTransaction;
  }
  async settleAccountTransaction(
    transactionId: string,
    tx: TransactionScope
  ): Promise<void> {
    const transaction =
      await this._accountsRepository.getAccountTransactionById(
        transactionId,
        tx
      );

    if (!transaction) {
      throw new Error(
        "Account transaction settlement: transaction does not exist"
      );
    }

    const isSettled = transaction.settledDate && transaction.balance;
    const isSettleable =
      !transaction.reviewDueDate ||
      isBefore(transaction.reviewDueDate, new Date());

    if (isSettled) {
      throw new Error(
        "Account transaction settlement: transaction already settled"
      );
    }

    if (!isSettleable) {
      throw new Error(
        "Account transaction settlement: transaction cannot be settled at the moment"
      );
    }

    // The entry is neither settled nor deferred (meaning it’s eligible for settlement)
    // perform settlement:
    const latestSettledtransaction =
      await this._accountsRepository.getLatestSettledAccountTransaction(
        transaction.accountId,
        tx
      );

    const prevSettledDate = latestSettledtransaction?.settledDate ?? null;
    const prevBalance = new BigNumber(latestSettledtransaction?.balance ?? 0);
    const credit = new BigNumber(transaction.credit);
    const debit = new BigNumber(transaction.debit);
    const balance = new BigNumber(prevBalance ?? "0").plus(credit).minus(debit);

    if (debit.isLessThan(0) || credit.isLessThan(0)) {
      throw new Error(
        "Account transaction settlement: debits and credits cannot be negative values."
      );
    }

    if (debit.isEqualTo(0) && credit.isEqualTo(0)) {
      throw new Error(
        "Account transaction settlement: debits and credits both cannot be 0"
      );
    }

    if (balance.isLessThan(0)) {
      throw new Error(
        "Account transaction settlement: balance caanot be negative."
      );
    }

    const settledTransaction =
      await this._accountsRepository.updateAccountTransactionById(
        transaction.id,
        {
          prevBalance: prevBalance.toString(),
          prevSettledDate: prevSettledDate,
          balance: balance.toString(),
          settledDate: new Date()
        },
        tx
      );

    if (!settledTransaction) {
      throw new Error(
        "Account transaction settlement: could not settle balance entry please try again"
      );
    }
  }
}
