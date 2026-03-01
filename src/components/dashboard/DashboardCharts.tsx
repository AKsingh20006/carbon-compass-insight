import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CaseStudy, co2Saved } from "@/data/caseStudies";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  ScatterChart, Scatter, ZAxis,
} from "recharts";

interface ChartsProps {
  studies: CaseStudy[];
}

const COLORS = [
  "hsl(152, 55%, 40%)",
  "hsl(80, 60%, 45%)",
  "hsl(175, 50%, 40%)",
  "hsl(160, 60%, 35%)",
  "hsl(130, 25%, 55%)",
  "hsl(40, 70%, 50%)",
];

const DashboardCharts = ({ studies }: ChartsProps) => {
  const sectorData = useMemo(() => {
    const map = new Map<string, number>();
    studies.forEach((cs) => {
      map.set(cs.sector, (map.get(cs.sector) || 0) + co2Saved(cs));
    });
    return Array.from(map, ([sector, co2]) => ({ sector, co2: Math.round(co2 / 1000 * 10) / 10 }));
  }, [studies]);

  const initiativeData = useMemo(() => {
    const map = new Map<string, number>();
    studies.forEach((cs) => {
      map.set(cs.initiativeType, (map.get(cs.initiativeType) || 0) + 1);
    });
    return Array.from(map, ([name, value]) => ({ name, value }));
  }, [studies]);

  const comparisonData = useMemo(() => {
    return studies.map((cs) => ({
      name: cs.name.split(" ")[0],
      baseline: cs.baselineEnergy,
      final: cs.finalEnergy,
    }));
  }, [studies]);

  const scatterData = useMemo(() => {
    return studies.map((cs) => ({
      name: cs.name,
      cost: cs.annualCostSavings / 1000,
      co2: co2Saved(cs) / 1000,
      sector: cs.sector,
    }));
  }, [studies]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Bar chart: CO₂ by sector */}
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">CO₂ Reduction by Sector (tons/yr)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(140,15%,85%)" />
                <XAxis dataKey="sector" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="co2" fill="hsl(152, 55%, 40%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Pie chart: Initiative types */}
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Initiative Types Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={initiativeData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                  {initiativeData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Before vs After */}
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Baseline vs Final Energy (kWh/yr)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(140,15%,85%)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="baseline" fill="hsl(0, 40%, 60%)" name="Baseline" radius={[4, 4, 0, 0]} />
                <Bar dataKey="final" fill="hsl(152, 55%, 40%)" name="After Initiative" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Scatter: Cost vs CO₂ */}
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Cost Savings vs CO₂ Reduction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(140,15%,85%)" />
                <XAxis dataKey="cost" name="Cost Saved (₹K)" tick={{ fontSize: 11 }} />
                <YAxis dataKey="co2" name="CO₂ Saved (tons)" tick={{ fontSize: 11 }} />
                <ZAxis range={[80, 80]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(value: number, name: string) => [`${value}`, name]} />
                <Scatter data={scatterData} fill="hsl(80, 60%, 45%)" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;
