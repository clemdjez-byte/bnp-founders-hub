import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface AssetCardProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export function AssetCard({ title, subtitle, icon: Icon, onClick }: AssetCardProps) {
  return (
    <Card
      className="p-8 hover:shadow-lg hover:border-secondary transition-all cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex flex-col items-start gap-4">
        <div className="p-3 rounded-lg bg-muted group-hover:bg-secondary/10 transition-colors">
          <Icon className="h-8 w-8 text-foreground group-hover:text-secondary transition-colors" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-secondary transition-colors">
            {title}
          </h3>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
    </Card>
  );
}
