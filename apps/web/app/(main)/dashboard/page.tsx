import { getSession } from "@/lib/auth";
import { accounting } from "@firelancer/modules/controllers";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function Page() {
  const { user } = await getSession();

  if (!user) {
    redirect("/");
  }

  const account = await accounting.getAccount({ userId: user.id });
  const transactionsHistory = await accounting.getTransactionHistory({
    userId: user.id,
  });

  return (
    <>
      <div className="container mx-auto px-4 md:px-6 flex flex-col">
        <div className="my-6">
          <div className="flex flex-col space-y-4">
            <div>
              <h1>Hi, {user.username}!</h1>
              <p>Your ID is {user.id}.</p>
            </div>
            <div>
              <span className="font-bold">Balance Account Details</span>
              <div>
                Status: <span>{account?.status}</span>
              </div>
              <div>
                Balance: <span>{account?.availableBalance}</span>
              </div>
              <div>
                Pending Balance: <span>{account?.pendingBalance}</span>
              </div>
            </div>
          </div>

          <Table className="mt-10 border">
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Ref-ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Credit</TableHead>
                <TableHead>Debit</TableHead>
                <TableHead>Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactionsHistory.pendingTransactions.map((entry) => (
                <TableRow className="bg-accent" key={entry.id}>
                  <TableCell>{entry.creationDate.toISOString()}</TableCell>
                  <TableCell>{entry.id}</TableCell>
                  <TableCell>{entry.type}</TableCell>
                  <TableCell>{entry.credit}$</TableCell>
                  <TableCell>{entry.debit}$</TableCell>
                  <TableCell className="italic text-muted-foreground">
                    Pending
                  </TableCell>
                </TableRow>
              ))}

              {transactionsHistory.settledTransactions.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.creationDate.toISOString()}</TableCell>
                  <TableCell>{entry.id}</TableCell>
                  <TableCell>{entry.type}</TableCell>
                  <TableCell>{entry.credit}$</TableCell>
                  <TableCell>{entry.debit}$</TableCell>
                  <TableCell>{entry.balance}$</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
