import { KPICard } from "@/components/KPICard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { formatCurrency } from "@/lib/mockData";
import { toast } from "sonner";

export default function Recap() {
  const handleDownload = () => {
    toast.success("PDF export coming soon", {
      description: "Your wealth recap will be ready shortly.",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Wealth Recap</h1>
          <p className="text-muted-foreground">A comprehensive summary of your financial situation</p>
        </div>
        <Button onClick={handleDownload} className="bg-secondary hover:bg-secondary/90">
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard title="Net Worth" value={formatCurrency(1680000)} />
        <KPICard title="Total Assets" value={formatCurrency(1920000)} />
        <KPICard title="Total Debts" value={formatCurrency(240000)} />
      </div>

      {/* Entity Breakdown */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Breakdown by Entity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <h3 className="font-semibold">Personal</h3>
              <p className="text-sm text-muted-foreground">Individual wealth and investments</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">{formatCurrency(920000)}</p>
              <p className="text-sm text-muted-foreground">55% of total</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <h3 className="font-semibold">Company</h3>
              <p className="text-sm text-muted-foreground">Business assets and holdings</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">{formatCurrency(580000)}</p>
              <p className="text-sm text-muted-foreground">35% of total</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <h3 className="font-semibold">Holding</h3>
              <p className="text-sm text-muted-foreground">Real estate and long-term investments</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">{formatCurrency(180000)}</p>
              <p className="text-sm text-muted-foreground">10% of total</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Key Insights */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Key Insights</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            • Your portfolio is well diversified across asset classes with a balanced allocation between personal and
            professional wealth.
          </p>
          <p>
            • Cash position of {formatCurrency(330000)} provides excellent liquidity for new investment opportunities.
          </p>
          <p>
            • Your debt-to-asset ratio of 12.5% is conservative and leaves room for strategic leverage if needed.
          </p>
          <p>
            • Consider rebalancing towards more growth-oriented assets given your long investment horizon as a young
            entrepreneur.
          </p>
        </div>
      </Card>
    </div>
  );
}
