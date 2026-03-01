import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EMISSION_FACTORS, EMISSION_FACTOR_SOURCES } from "@/data/caseStudies";
import { BookOpen } from "lucide-react";

const MethodologySection = () => {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          Calculation Methodology & Sources
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <h4 className="font-semibold text-foreground mb-2">CO₂ Reduction Formula</h4>
          <div className="bg-muted/50 rounded-lg p-3 font-mono text-xs">
            Total CO₂ Saved = (Elec_baseline − Elec_final) × EF_electricity<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ (Fuel_baseline − Fuel_final) × EF_fuel<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ Waste_diverted × EF_waste
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">Emission Factors Used</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Source</th>
                  <th className="text-right py-2 pr-4 font-medium text-muted-foreground">Factor</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Reference</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(EMISSION_FACTORS).map(([key, value]) => (
                  <tr key={key} className="border-b border-border/50">
                    <td className="py-2 pr-4 capitalize text-foreground">{key}</td>
                    <td className="py-2 pr-4 text-right font-mono text-foreground">
                      {value} kg CO₂/{key === "electricity" ? "kWh" : key === "waste" ? "kg" : "L"}
                    </td>
                    <td className="py-2 text-muted-foreground">
                      {EMISSION_FACTOR_SOURCES[key as keyof typeof EMISSION_FACTOR_SOURCES]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-xs text-muted-foreground">
          <strong className="text-foreground">Note:</strong> The electricity emission factor (0.716 kg CO₂/kWh) reflects the Indian grid's weighted average as per CEA 2023 data, which accounts for the country's coal-heavy generation mix. All fuel emission factors follow IPCC Tier 1 methodology. Waste emission factors use GWP₁₀₀ = 28 for methane avoidance.
        </div>
      </CardContent>
    </Card>
  );
};

export default MethodologySection;
