import { AssetCard } from "@/components/AssetCard";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, CreditCard, Link as LinkIcon, DollarSign } from "lucide-react";
import { mockDebts, formatCurrency } from "@/lib/mockData";

const debtModules = [
  {
    title: "Loans & Mortgages",
    subtitle: "Real estate and business loans",
    icon: FileText,
    size: "large" as const,
  },
  { title: "Credit Cards", subtitle: "Credit lines and cards", icon: CreditCard, size: "large" as const },
  { title: "Link Portfolio", subtitle: "Connect another portfolio", icon: LinkIcon, size: "small" as const },
  { title: "AI Import", subtitle: "Files & Screenshots", icon: FileText, size: "small" as const },
  { title: "Enter Manually", subtitle: "Add debt manually", icon: DollarSign, size: "small" as const },
];

export default function Debts() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">All the money you owe</h1>
        <p className="text-muted-foreground">
          View loans, mortgages, credit lines and credit cards at a glance.
        </p>
      </div>

      {/* Debt Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {debtModules.map((module) => (
          <AssetCard
            key={module.title}
            title={module.title}
            subtitle={module.subtitle}
            icon={module.icon}
            onClick={() => {}}
          />
        ))}
      </div>

      {/* Debts Table */}
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Debts</h2>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Lender</TableHead>
                  <TableHead className="text-right">Remaining Balance</TableHead>
                  <TableHead>Interest Rate</TableHead>
                  <TableHead>Maturity Date</TableHead>
                  <TableHead>Entity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDebts.map((debt) => (
                  <TableRow key={debt.id}>
                    <TableCell className="font-medium">{debt.type}</TableCell>
                    <TableCell>{debt.lender}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(debt.balance)}
                    </TableCell>
                    <TableCell>{debt.rate}</TableCell>
                    <TableCell>{debt.maturity}</TableCell>
                    <TableCell>{debt.entity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
}
