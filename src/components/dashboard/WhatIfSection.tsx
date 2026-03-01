import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EMISSION_FACTORS } from "@/data/caseStudies";
import { Leaf } from "lucide-react";

const scenarios = [
  { id: "solar", label: "Households adopt solar panels", baselineSave: 3000, costPerUnit: 210000, savingsPerUnit: 24000 },
  { id: "ev", label: "Offices switch to EV fleet", baselineSave: 0, fuelSave: 800, fuelType: "petrol" as const, costPerUnit: 500000, savingsPerUnit: 60000 },
  { id: "led", label: "Retail shops switch to LED + inverter", baselineSave: 5500, costPerUnit: 200000, savingsPerUnit: 45000 },
  { id: "biogas", label: "Rural homes install biogas", baselineSave: 600, fuelSave: 500, fuelType: "diesel" as const, wasteSave: 800, costPerUnit: 45000, savingsPerUnit: 18000 },
];

const WhatIfSection = () => {
  const [scenarioId, setScenarioId] = useState("solar");
  const [count, setCount] = useState([50]);

  const scenario = scenarios.find((s) => s.id === scenarioId)!;
  const n = count[0];

  const results = useMemo(() => {
    let co2 = scenario.baselineSave * EMISSION_FACTORS.electricity * n;
    if ("fuelSave" in scenario && scenario.fuelSave) {
      const factor = scenario.fuelType === "petrol" ? EMISSION_FACTORS.petrol : EMISSION_FACTORS.diesel;
      co2 += scenario.fuelSave * factor * n;
    }
    if ("wasteSave" in scenario && scenario.wasteSave) {
      co2 += scenario.wasteSave * EMISSION_FACTORS.waste * n;
    }
    const totalCost = scenario.costPerUnit * n;
    const totalSavings = scenario.savingsPerUnit * n;
    return { co2Tons: (co2 / 1000).toFixed(1), totalCost, totalSavings };
  }, [scenario, n]);

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Leaf className="h-4 w-4 text-primary" />
          What-If Scenario Simulator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Scenario</label>
            <Select value={scenarioId} onValueChange={setScenarioId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {scenarios.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Number of adopters: <span className="text-primary font-bold">{n}</span>
            </label>
            <Slider value={count} onValueChange={setCount} min={1} max={500} step={1} className="mt-3" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="rounded-lg bg-primary/10 p-4 text-center">
            <p className="text-2xl font-bold text-primary">{results.co2Tons}</p>
            <p className="text-xs text-muted-foreground mt-1">Tons CO₂ reduced/yr</p>
          </div>
          <div className="rounded-lg bg-secondary p-4 text-center">
            <p className="text-2xl font-bold text-secondary-foreground">₹{(results.totalSavings / 100000).toFixed(1)}L</p>
            <p className="text-xs text-muted-foreground mt-1">Annual savings</p>
          </div>
          <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-2xl font-bold text-foreground">₹{(results.totalCost / 10000000).toFixed(1)}Cr</p>
            <p className="text-xs text-muted-foreground mt-1">Total investment</p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
          <strong>Formula:</strong> CO₂ Reduction = (Baseline − Final) × Emission Factor × Number of Adopters
          <br />
          <strong>Factors:</strong> Electricity: {EMISSION_FACTORS.electricity} kg CO₂/kWh · Petrol: {EMISSION_FACTORS.petrol} kg CO₂/L · Diesel: {EMISSION_FACTORS.diesel} kg CO₂/L · Waste: {EMISSION_FACTORS.waste} kg CO₂/kg
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatIfSection;
