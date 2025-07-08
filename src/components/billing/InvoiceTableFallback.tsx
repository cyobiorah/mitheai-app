import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ArrowDownToLine } from "lucide-react";
import { format } from "date-fns";

interface Invoice {
  _id: string;
  createdAt: string;
  amountPaid: number;
  status: string;
  invoicePdf: string;
}

interface InvoiceTableFallbackProps {
  invoices: Invoice[];
}

export function InvoiceTableFallback({ invoices }: InvoiceTableFallbackProps) {
  if (!invoices || invoices.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        No invoices found.
      </div>
    );
  }

  return (
    <div className="overflow-auto rounded-xl border border-border shadow-sm">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Invoice ID
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Date
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Amount
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Status
            </th>
            <th className="px-6 py-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {invoices.map((invoice) => (
            <tr key={invoice._id} className="hover:bg-muted/20">
              <td className="px-6 py-4 text-sm font-medium text-primary">
                {invoice._id}
              </td>
              <td className="px-6 py-4 text-sm">
                {format(new Date(invoice.createdAt), "PPP")}
              </td>
              <td className="px-6 py-4 text-sm">${invoice.amountPaid}</td>
              <td className="px-6 py-4 text-sm">
                <Badge
                  variant="outline"
                  className={`${
                    invoice.status === "paid"
                      ? "border-green-500 text-green-600"
                      : "border-yellow-500 text-yellow-600"
                  }`}
                >
                  {invoice.status}
                </Badge>
              </td>
              <td className="px-6 py-4 text-right">
                <Button asChild variant="ghost" size="sm">
                  <a
                    href={invoice.invoicePdf}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ArrowDownToLine className="mr-2 h-4 w-4" />
                    Download
                  </a>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
