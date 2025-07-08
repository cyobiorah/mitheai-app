import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ArrowDownToLine } from "lucide-react"; // Modern download icon
import { format } from "date-fns";

interface Invoice {
  _id: string;
  createdAt: string;
  amountPaid: number;
  status: string;
  invoicePdf: string;
}

interface InvoiceTableProps {
  invoices: Invoice[];
}

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  if (!invoices || invoices.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        No invoices found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {invoices.map((invoice) => (
        <div
          key={invoice._id}
          className="flex flex-col md:flex-row md:items-center md:justify-between rounded-xl border border-border bg-background shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="p-4 space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              Invoice ID
            </div>
            <div className="font-semibold text-primary break-all">
              {invoice._id}
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-3">
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">
                  Date
                </div>
                <div className="font-medium">
                  {format(new Date(invoice.createdAt), "PPP")}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">
                  Amount
                </div>
                <div className="font-medium">${invoice.amountPaid}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">
                  Status
                </div>
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
              </div>
            </div>
          </div>

          <div className="p-4 md:border-l border-border md:min-w-[150px] md:flex md:justify-center">
            <Button asChild variant="outline" size="sm" className="rounded-md">
              <a
                href={invoice.invoicePdf}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ArrowDownToLine className="mr-2 h-4 w-4" />
                Download
              </a>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
