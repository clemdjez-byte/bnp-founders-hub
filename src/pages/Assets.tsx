import { AssetCard } from "@/components/AssetCard";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Landmark,
  TrendingUp,
  Bitcoin,
  Home,
  Car,
  Coins,
  Globe,
  FileText,
  Hash,
  DollarSign,
  Link as LinkIcon,
} from "lucide-react";
import { mockAssets, formatCurrency } from "@/lib/mockData";

const assetModules = [
  { title: "Connect BNP Accounts", subtitle: "Link your BNP portfolios", icon: Landmark },
  { title: "Connect Banks & Brokerages", subtitle: "Sync external accounts", icon: Landmark },
  { title: "Stock Tickers", subtitle: "Add individual stocks", icon: TrendingUp },
  { title: "Crypto Exchanges & Wallets", subtitle: "Track crypto holdings", icon: Bitcoin },
  { title: "Homes / Real Estate", subtitle: "Manage property portfolio", icon: Home },
  { title: "Cars & Valuables", subtitle: "Track physical assets", icon: Car },
  { title: "Precious Metals", subtitle: "Gold, silver, and more", icon: Coins },
  { title: "Domains & Digital Assets", subtitle: "Online properties", icon: Globe },
  { title: "AI Import", subtitle: "Files & Screenshots", icon: FileText },
  { title: "Enter Quantity & Price", subtitle: "Manual entry", icon: Hash },
  { title: "Enter Value Manually", subtitle: "Simple value input", icon: DollarSign },
  { title: "Link Portfolio", subtitle: "Connect another portfolio", icon: LinkIcon },
];

export default function Assets() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">All your assets in one place</h1>
        <p className="text-muted-foreground">
          BNP Private Founders centralizes all your wealth: personal accounts, company assets, crypto, real estate and more.
        </p>
      </div>

      {/* Assets Table */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Assets</h2>
            <div className="flex gap-2">
              <select className="px-3 py-2 rounded-md border border-input bg-background text-sm">
                <option>All Entities</option>
                <option>Personal</option>
                <option>Company</option>
                <option>Holding</option>
              </select>
              <select className="px-3 py-2 rounded-md border border-input bg-background text-sm">
                <option>All Asset Classes</option>
                <option>Stocks</option>
                <option>Funds</option>
                <option>Cash</option>
                <option>Crypto</option>
                <option>Real Estate</option>
              </select>
            </div>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead className="text-right">Current Value</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead className="text-right">Allocation %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAssets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">{asset.type}</TableCell>
                    <TableCell>{asset.label}</TableCell>
                    <TableCell>{asset.entity}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(asset.value, asset.currency)}
                    </TableCell>
                    <TableCell>{asset.currency}</TableCell>
                    <TableCell>
                      <span className={asset.isPositive ? "text-gain" : "text-loss"}>
                        {asset.performance}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{asset.allocation.toFixed(1)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>

      {/* Asset Modules Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {assetModules.map((module) => (
          <AssetCard
            key={module.title}
            title={module.title}
            subtitle={module.subtitle}
            icon={module.icon}
            onClick={() => {}}
          />
        ))}
      </div>
    </div>
  );
}
