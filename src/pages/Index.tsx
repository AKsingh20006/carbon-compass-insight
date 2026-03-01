import { useState, useMemo } from "react";
import { caseStudies } from "@/data/caseStudies";
import KPISection from "@/components/dashboard/KPISection";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import CaseStudyTable from "@/components/dashboard/CaseStudyTable";
import WhatIfSection from "@/components/dashboard/WhatIfSection";
import FilterBar from "@/components/dashboard/FilterBar";
import { Leaf } from "lucide-react";

const Index = () => {
  const [selectedSector, setSelectedSector] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedInitiative, setSelectedInitiative] = useState("All");

  const sectors = useMemo(() => [...new Set(caseStudies.map((c) => c.sector))], []);
  const locations = useMemo(() => [...new Set(caseStudies.map((c) => c.locationType))], []);
  const initiatives = useMemo(() => [...new Set(caseStudies.map((c) => c.initiativeType))], []);

  const filtered = useMemo(() => {
    return caseStudies.filter((cs) => {
      if (selectedSector !== "All" && cs.sector !== selectedSector) return false;
      if (selectedLocation !== "All" && cs.locationType !== selectedLocation) return false;
      if (selectedInitiative !== "All" && cs.initiativeType !== selectedInitiative) return false;
      return true;
    });
  }, [selectedSector, selectedLocation, selectedInitiative]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-card">
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center gap-3">
          <div className="rounded-lg bg-primary p-2">
            <Leaf className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Low-Carbon Case Study Dashboard</h1>
            <p className="text-sm text-muted-foreground">Sustainability Capstone · 8 Case Studies across India</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <FilterBar
          sectors={sectors}
          locations={locations}
          initiatives={initiatives}
          selectedSector={selectedSector}
          selectedLocation={selectedLocation}
          selectedInitiative={selectedInitiative}
          onSectorChange={setSelectedSector}
          onLocationChange={setSelectedLocation}
          onInitiativeChange={setSelectedInitiative}
        />

        <KPISection studies={filtered} />
        <DashboardCharts studies={filtered} />
        <CaseStudyTable studies={filtered} />
        <WhatIfSection />
      </main>

      <footer className="border-t border-border/60 bg-card mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-xs text-muted-foreground">
          Emission Factors: Electricity 0.82 kg CO₂/kWh (Indian Grid) · Petrol 2.31 kg CO₂/L · Diesel 2.68 kg CO₂/L · Waste 0.5 kg CO₂/kg
        </div>
      </footer>
    </div>
  );
};

export default Index;
