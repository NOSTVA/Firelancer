export interface IAccountingService {
  initializeTransaction(transaction: {
    senderId: string | null;
    recipientId: string | null;
    amount: number;
    orderId: string | null;
  }): Promise<void>;
  settleAccountBalance(balanceEntryId: string): Promise<void>;
}
