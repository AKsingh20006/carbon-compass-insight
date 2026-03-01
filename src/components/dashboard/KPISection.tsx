import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CaseStudy, co2Saved } from "@/data/caseStudies";
import { Leaf, IndianRupee, Building2, TrendingDown } from "lucide-react";

interface KPISectionProps {
  studies: CaseStudy[];
}

const KPISection = ({ studies }: KPISectionProps) => {
  const stats = useMemo(() => {
    const totalCO2 = studies.reduce((sum, cs) => sum + co2Saved(cs), 0);
    const totalSavings = studies.reduce((sum, cs) => sum + cs.annualCostSavings, 0);
    const sectors = new Set(studies.map((cs) => cs.sector)).size;
    const totalEnergySaved = studies.reduce(
      (sum, cs) => sum + (cs.baselineEnergy - cs.finalEnergy),
      0
    );
    return { totalCO2, totalSavings, count: studies.length, sectors, totalEnergySaved };
  }, [studies]);

  const kpis = [
    {
      label: "Total CO₂ Reduced",
      value: `${(stats.totalCO2 / 1000).toFixed(1)} tons`,
      icon: Leaf,
      desc: "Annual CO₂ equivalent",
    },
    {
      label: "Total Cost Savings",
      value: `₹${(stats.totalSavings / 1000).toFixed(0)}K`,
      icon: IndianRupee,
      desc: "Annual savings",
    },
    {
      label: "Case Studies",
      value: stats.count,
      icon: Building2,
      desc: `Across ${stats.sectors} sectors`,
    },
    {
      label: "Energy Saved",
      value: `${(stats.totalEnergySaved / 1000).toFixed(0)} MWh`,
      icon: TrendingDown,
      desc: "Annual energy reduction",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <Card key={kpi.label} className="border-border/60">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
                <p className="text-2xl font-bold mt-1 text-foreground">{kpi.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{kpi.desc}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-2.5">
                <kpi.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default KPISection;
