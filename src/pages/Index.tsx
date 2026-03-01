import { useState, useMemo, useCallback } from "react";
import { defaultCaseStudies, CaseStudy } from "@/data/caseStudies";
import KPISection from "@/components/dashboard/KPISection";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import CaseStudyTable from "@/components/dashboard/CaseStudyTable";
import WhatIfSection from "@/components/dashboard/WhatIfSection";
import FilterBar from "@/components/dashboard/FilterBar";
import AddCaseStudy from "@/components/dashboard/AddCaseStudy";
import MethodologySection from "@/components/dashboard/MethodologySection";
import { Leaf } from "lucide-react";

const Index = () => {
  const [studies, setStudies] = useState<CaseStudy[]>(defaultCaseStudies);
  const [selectedSector, setSelectedSector] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedInitiative, setSelectedInitiative] = useState("All");

  const sectors = useMemo(() => [...new Set(studies.map((c) => c.sector))], [studies]);
  const locations = useMemo(() => [...new Set(studies.map((c) => c.locationType))], [studies]);
  const initiatives = useMemo(() => [...new Set(studies.map((c) => c.initiativeType))], [studies]);

  const filtered = useMemo(() => {
    return studies.filter((cs) => {
      if (selectedSector !== "All" && cs.sector !== selectedSector) return false;
      if (selectedLocation !== "All" && cs.locationType !== selectedLocation) return false;
      if (selectedInitiative !== "All" && cs.initiativeType !== selectedInitiative) return false;
      return true;
    });
  }, [studies, selectedSector, selectedLocation, selectedInitiative]);

  const nextId = useMemo(() => Math.max(...studies.map((s) => s.id), 0) + 1, [studies]);

  const handleAddStudies = useCallback((newStudies: CaseStudy[]) => {
    setStudies((prev) => [...prev, ...newStudies]);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-card">
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center gap-3">
          <div className="rounded-lg bg-primary p-2">
            <Leaf className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Low-Carbon Case Study Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Sustainability Capstone · {studies.length} Case Studies across India
            </p>
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
        <AddCaseStudy onAdd={handleAddStudies} nextId={nextId} />
        <WhatIfSection />
        <MethodologySection />
      </main>

      <footer className="border-t border-border/60 bg-card mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-xs text-muted-foreground">
          Emission factors sourced from CEA v19.0 (2023) & IPCC 2006 Guidelines · All calculations use Tier 1 methodology
        </div>
      </footer>
    </div>
  );
};

export default Index;
