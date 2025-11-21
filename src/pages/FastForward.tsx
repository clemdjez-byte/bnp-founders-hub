import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Line, LineChart, CartesianGrid, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { formatCurrency } from "@/lib/mockData";

export default function FastForward() {
  const [annualReturn, setAnnualReturn] = useState(6);
  const [period, setPeriod] = useState(10);
  const startingNetWorth = 1680000;

  const generateProjection = () => {
    const data = [];
    for (let year = 0; year <= period; year++) {
      const value = startingNetWorth * Math.pow(1 + annualReturn / 100, year);
      data.push({
        year,
        value: Math.round(value),
      });
    }
    return data;
  };

  const projectionData = generateProjection();
  const finalValue = projectionData[projectionData.length - 1].value;
  const totalGain = finalValue - startingNetWorth;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Fast Forward</h1>
        <p className="text-muted-foreground">Project your wealth into the future based on expected returns</p>
      </div>

      {/* Controls */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium">Starting Net Worth</label>
              <span className="text-2xl font-bold text-secondary">{formatCurrency(startingNetWorth)}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium">Expected Annual Return</label>
              <span className="text-xl font-bold">{annualReturn}%</span>
            </div>
            <Slider
              value={[annualReturn]}
              onValueChange={(value) => setAnnualReturn(value[0])}
              min={0}
              max={15}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>0%</span>
              <span>15%</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-4 block">Projection Period</label>
            <div className="grid grid-cols-3 gap-3">
              {[5, 10, 20, 30].map((years) => (
                <Button
                  key={years}
                  variant={period === years ? "default" : "outline"}
                  onClick={() => setPeriod(years)}
                  className={period === years ? "bg-secondary hover:bg-secondary/90" : ""}
                >
                  {years} years
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Projection Chart */}
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Projected Net Worth</h2>
          <ChartContainer config={{}} className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="year"
                  stroke="hsl(var(--muted-foreground))"
                  label={{ value: "Years", position: "insideBottom", offset: -5 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card border border-border p-3 rounded-lg shadow-md">
                          <p className="text-sm font-medium">Year {payload[0].payload.year}</p>
                          <p className="text-lg font-bold text-secondary">
                            {formatCurrency(payload[0].value as number)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--chart-1))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </Card>

      {/* Summary */}
      <Card className="p-6 bg-secondary/5">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Projection Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Starting Value</p>
              <p className="text-2xl font-bold">{formatCurrency(startingNetWorth)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Projected Value ({period} years)</p>
              <p className="text-2xl font-bold text-secondary">{formatCurrency(finalValue)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Gain</p>
              <p className="text-2xl font-bold text-gain">+{formatCurrency(totalGain)}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground pt-4 border-t">
            This is a simple projection based on a constant annual return of {annualReturn}%. Actual results will vary
            based on market conditions, investment choices, and other factors. This is not investment advice.
          </p>
        </div>
      </Card>
    </div>
  );
}
