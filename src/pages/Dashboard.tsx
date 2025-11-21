import { KPICard } from "@/components/KPICard";
import { Card } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { mockNetWorthData, mockAllocationByClass, mockAllocationByProfile, formatCurrency } from "@/lib/mockData";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function Dashboard() {
  const currentNetWorth = 9017000;
  const totalAssets = 9655000;
  const totalDebts = 638000;
  const cashOnHand = 6000000;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Net Worth</h1>
        <p className="text-muted-foreground">Your complete wealth overview</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <KPICard
          title="Net Worth"
          value={formatCurrency(currentNetWorth)}
          change="+€1,097,000"
          changePercent="+14%"
          isPositive={true}
          subtitle="Total wealth"
        />
        <KPICard
          title="Assets"
          value={formatCurrency(totalAssets)}
          change="+€1,235,000"
          changePercent="+15%"
          isPositive={true}
        />
        <KPICard
          title="Debts"
          value={formatCurrency(totalDebts)}
          change="-€138,000"
          changePercent="-18%"
          isPositive={true}
        />
        <KPICard
          title="Cash on Hand"
          value={formatCurrency(cashOnHand)}
          change="+€1,580,000"
          changePercent="+36%"
          isPositive={true}
        />
      </div>

      {/* Net Worth Chart */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Net Worth Evolution</h2>
            <div className="flex gap-2">
              {["1M", "3M", "1Y", "5Y", "Max"].map((period) => (
                <button
                  key={period}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    period === "1Y"
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-secondary/20"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <ChartContainer config={{}} className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockNetWorthData}>
                <defs>
                  <linearGradient id="netWorth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card border border-border p-3 rounded-lg shadow-md">
                          <p className="text-sm font-medium">{payload[0].payload.date}</p>
                          <p className="text-lg font-bold text-secondary">
                            {formatCurrency(payload[0].value as number)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  fill="url(#netWorth)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </Card>

      {/* Allocations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Allocation by Asset Class</h2>
          <ChartContainer config={{}} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockAllocationByClass}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {mockAllocationByClass.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card border border-border p-3 rounded-lg shadow-md">
                          <p className="text-sm font-medium">{payload[0].name}</p>
                          <p className="text-lg font-bold">{formatCurrency(payload[0].value as number)}</p>
                          <p className="text-sm text-muted-foreground">{payload[0].payload.percentage}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry: any) => (
                    <span className="text-sm text-foreground">
                      {value} ({entry.payload.percentage}%)
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Pro vs Personal</h2>
          <ChartContainer config={{}} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockAllocationByProfile}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockAllocationByProfile.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card border border-border p-3 rounded-lg shadow-md">
                          <p className="text-sm font-medium">{payload[0].name}</p>
                          <p className="text-lg font-bold">{formatCurrency(payload[0].value as number)}</p>
                          <p className="text-sm text-muted-foreground">{payload[0].payload.percentage}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry: any) => (
                    <span className="text-sm text-foreground">
                      {value} ({entry.payload.percentage}%)
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>
      </div>
    </div>
  );
}
