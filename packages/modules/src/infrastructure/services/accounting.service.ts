import { inject, injectable } from "inversify";
import { IAccountingService } from "../../application/services/accounting.service.interface.js";
import { DI_SYMBOLS } from "../../di/types.js";
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
    senderId: string | null;
    recipientId: string | null;
    amount: number;
    orderId: string | null;
  }): Promise<void> {
    if (!details.senderId && !details.recipientId) {
      throw new Error("Invalid transaction details");
    }

    // create transaction
    // create balance entries

    throw new Error("Method not implemented.");
  }
  async settleAccountBalance(balanceEntryId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
