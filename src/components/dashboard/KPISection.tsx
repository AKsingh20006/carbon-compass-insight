import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CaseStudy, co2Saved } from "@/data/caseStudies";
import { Leaf, IndianRupee, Building2, TrendingDown, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface KPISectionProps {
  studies: CaseStudy[];
}

function dataCompleteness(cs: CaseStudy): number {
  const fields = [
    cs.name,
    cs.sector,
    cs.locationType,
    cs.initiative,
    cs.initiativeType,
    cs.baselineEnergy,
    cs.finalEnergy,
    cs.investment,
    cs.annualCostSavings,
  ];
  // These are always expected. Fuel & waste are optional depending on context.
  const optionalFilled = [
    cs.fuelType !== "none" ? (cs.baselineFuel > 0 ? 1 : 0) : 1, // if no fuel type, count as complete
    cs.fuelType !== "none" ? (cs.finalFuel >= 0 ? 1 : 0) : 1,
    cs.wasteReduction >= 0 ? 1 : 0,
  ];
  const requiredFilled = fields.filter((f) => f !== undefined && f !== null && f !== "" && f !== 0).length;
  const total = fields.length + optionalFilled.length;
  const filled = requiredFilled + optionalFilled.reduce((a, b) => a + b, 0);
  return (filled / total) * 100;
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
    const avgCompleteness =
      studies.length > 0
        ? studies.reduce((sum, cs) => sum + dataCompleteness(cs), 0) / studies.length
        : 0;
    return { totalCO2, totalSavings, count: studies.length, sectors, totalEnergySaved, avgCompleteness };
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
    <div className="space-y-4">
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

      {/* Data Accuracy / Completeness Card */}
      <Card className="border-border/60">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-foreground">Data Accuracy Rate</p>
                <span className="text-lg font-bold text-foreground">
                  {stats.avgCompleteness.toFixed(1)}%
                </span>
              </div>
              <Progress value={stats.avgCompleteness} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1.5">
                Average data completeness across {studies.length} case studies — based on filled fields per study
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KPISection;
