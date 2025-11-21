import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Line, LineChart, CartesianGrid, XAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { formatCurrency } from "@/lib/mockData";

type Scenario = "pessimistic" | "moderate" | "optimistic";

export default function FastForward() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>("moderate");
  const [period, setPeriod] = useState(10);
  const startingNetWorth = 9017000;

  const scenarios = {
    pessimistic: { return: 2, label: "Pessimiste", color: "hsl(var(--chart-3))" },
    moderate: { return: 6, label: "Moyen", color: "hsl(var(--chart-1))" },
    optimistic: { return: 10, label: "Optimiste", color: "hsl(var(--chart-2))" },
  };

  const generateProjections = () => {
    const data = [];
    for (let year = 0; year <= period; year++) {
      const pessimistic = startingNetWorth * Math.pow(1 + scenarios.pessimistic.return / 100, year);
      const moderate = startingNetWorth * Math.pow(1 + scenarios.moderate.return / 100, year);
      const optimistic = startingNetWorth * Math.pow(1 + scenarios.optimistic.return / 100, year);
      
      data.push({
        year,
        pessimistic: Math.round(pessimistic),
        moderate: Math.round(moderate),
        optimistic: Math.round(optimistic),
      });
    }
    return data;
  };

  const projectionData = generateProjections();
  const currentScenario = scenarios[selectedScenario];
  const finalValue = projectionData[projectionData.length - 1][selectedScenario];
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
            <label className="text-sm font-medium mb-4 block">Scenario</label>
            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(scenarios) as Scenario[]).map((scenario) => (
                <Button
                  key={scenario}
                  variant={selectedScenario === scenario ? "default" : "outline"}
                  onClick={() => setSelectedScenario(scenario)}
                >
                  {scenarios[scenario].label}
                  <span className="ml-2 text-xs opacity-70">
                    {scenarios[scenario].return}%
                  </span>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-4 block">Projection Period</label>
            <div className="grid grid-cols-4 gap-3">
              {[5, 10, 20, 30].map((years) => (
                <Button
                  key={years}
                  variant={period === years ? "default" : "outline"}
                  onClick={() => setPeriod(years)}
                >
                  {years} ans
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Projection Chart */}
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Projection du Patrimoine</h2>
          <ChartContainer config={{}} className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="year"
                  stroke="hsl(var(--muted-foreground))"
                  label={{ value: "Années", position: "insideBottom", offset: -5 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card border border-border p-3 rounded-lg shadow-md">
                          <p className="text-sm font-medium mb-2">Année {payload[0].payload.year}</p>
                          {payload.map((entry: any, index: number) => (
                            <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
                              {entry.name === "pessimistic" ? "Pessimiste" : 
                               entry.name === "moderate" ? "Moyen" : "Optimiste"}: {formatCurrency(entry.value)}
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  formatter={(value) => 
                    value === "pessimistic" ? "Pessimiste (2%)" : 
                    value === "moderate" ? "Moyen (6%)" : "Optimiste (10%)"
                  }
                />
                <Line
                  type="monotone"
                  dataKey="pessimistic"
                  stroke={scenarios.pessimistic.color}
                  strokeWidth={selectedScenario === "pessimistic" ? 3 : 2}
                  opacity={selectedScenario === "pessimistic" ? 1 : 0.3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="moderate"
                  stroke={scenarios.moderate.color}
                  strokeWidth={selectedScenario === "moderate" ? 3 : 2}
                  opacity={selectedScenario === "moderate" ? 1 : 0.3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="optimistic"
                  stroke={scenarios.optimistic.color}
                  strokeWidth={selectedScenario === "optimistic" ? 3 : 2}
                  opacity={selectedScenario === "optimistic" ? 1 : 0.3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </Card>

      {/* Summary */}
      <Card className="p-6 bg-secondary/5">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Résumé - Scénario {currentScenario.label}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Valeur Actuelle</p>
              <p className="text-2xl font-bold">{formatCurrency(startingNetWorth)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valeur Projetée ({period} ans)</p>
              <p className="text-2xl font-bold text-secondary">{formatCurrency(finalValue)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gain Total</p>
              <p className="text-2xl font-bold text-gain">+{formatCurrency(totalGain)}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground pt-4 border-t">
            Projection basée sur un rendement annuel constant de {currentScenario.return}%. Les résultats réels varieront selon les conditions du marché et vos choix d'investissement.
          </p>
        </div>
      </Card>
    </div>
  );
}
