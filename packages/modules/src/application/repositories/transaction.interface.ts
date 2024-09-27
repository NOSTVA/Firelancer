export type TransactionScope = unknown;

export interface ITransaction {
  create<T>(transaction: (tx: TransactionScope) => Promise<T>): Promise<T>;
}
