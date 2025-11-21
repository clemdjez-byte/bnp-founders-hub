import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  change?: string;
  changePercent?: string;
  isPositive?: boolean;
  subtitle?: string;
}

export function KPICard({ title, value, change, changePercent, isPositive, subtitle }: KPICardProps) {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="space-y-1">
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          {change && (
            <div className={`flex items-center gap-1.5 text-sm font-medium ${isPositive ? 'text-gain' : 'text-loss'}`}>
              {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span>{change}</span>
              {changePercent && <span>({changePercent})</span>}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
