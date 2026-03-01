import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CaseStudy } from "@/data/caseStudies";
import { Upload, Plus, FileSpreadsheet, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  onAdd: (studies: CaseStudy[]) => void;
  nextId: number;
}

const CSV_TEMPLATE = `name,sector,locationType,initiative,initiativeType,baselineEnergy,finalEnergy,baselineFuel,finalFuel,fuelType,wasteReduction,investment,annualCostSavings
Example Home,Household,Urban,Solar panels,Renewable Energy,5000,2000,0,0,none,100,200000,25000`;

function parseCSV(text: string, startId: number): { studies: CaseStudy[]; errors: string[] } {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return { studies: [], errors: ["CSV must have a header row and at least one data row."] };

  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const requiredCols = ["name", "sector", "locationtype", "baselineenergy", "finalenergy"];
  const missing = requiredCols.filter((c) => !header.includes(c));
  if (missing.length) return { studies: [], errors: [`Missing columns: ${missing.join(", ")}`] };

  const studies: CaseStudy[] = [];
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const vals = lines[i].split(",").map((v) => v.trim());
    if (vals.length < header.length) {
      errors.push(`Row ${i + 1}: not enough columns`);
      continue;
    }

    const get = (col: string) => vals[header.indexOf(col)] || "";
    const getNum = (col: string) => {
      const v = parseFloat(get(col));
      return isNaN(v) ? 0 : v;
    };

    const name = get("name");
    if (!name || name.length > 100) {
      errors.push(`Row ${i + 1}: invalid name`);
      continue;
    }

    const locationType = get("locationtype") as "Urban" | "Semi-urban" | "Rural";
    if (!["Urban", "Semi-urban", "Rural"].includes(locationType)) {
      errors.push(`Row ${i + 1}: locationType must be Urban, Semi-urban, or Rural`);
      continue;
    }

    const fuelType = (get("fueltype") || "none") as "petrol" | "diesel" | "lpg" | "none";
    if (!["petrol", "diesel", "lpg", "none"].includes(fuelType)) {
      errors.push(`Row ${i + 1}: fuelType must be petrol, diesel, lpg, or none`);
      continue;
    }

    studies.push({
      id: startId + studies.length,
      name: name.slice(0, 100),
      sector: (get("sector") || "Other").slice(0, 50),
      locationType,
      initiative: (get("initiative") || "Not specified").slice(0, 200),
      initiativeType: (get("initiativetype") || "Other").slice(0, 50),
      baselineEnergy: Math.max(0, getNum("baselineenergy")),
      finalEnergy: Math.max(0, getNum("finalenergy")),
      baselineFuel: Math.max(0, getNum("baselinefuel")),
      finalFuel: Math.max(0, getNum("finalfuel")),
      fuelType,
      wasteReduction: Math.max(0, getNum("wastereduction")),
      investment: Math.max(0, getNum("investment")),
      annualCostSavings: Math.max(0, getNum("annualcostsavings")),
    });
  }

  return { studies, errors };
}

const AddCaseStudy = ({ onAdd, nextId }: Props) => {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [csvErrors, setCsvErrors] = useState<string[]>([]);

  // Manual form state
  const [form, setForm] = useState({
    name: "", sector: "Household", locationType: "Urban" as const,
    initiative: "", initiativeType: "Renewable Energy",
    baselineEnergy: "", finalEnergy: "", baselineFuel: "", finalFuel: "",
    fuelType: "none" as const, wasteReduction: "", investment: "", annualCostSavings: "",
  });

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvErrors([]);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const { studies, errors } = parseCSV(text, nextId);
      if (errors.length) setCsvErrors(errors);
      if (studies.length) {
        onAdd(studies);
        toast({ title: `${studies.length} case ${studies.length === 1 ? "study" : "studies"} imported`, description: errors.length ? `${errors.length} rows skipped due to errors` : undefined });
      } else if (!errors.length) {
        setCsvErrors(["No valid data rows found."]);
      }
    };
    reader.readAsText(file);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleManualAdd = () => {
    if (!form.name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    const cs: CaseStudy = {
      id: nextId,
      name: form.name.trim().slice(0, 100),
      sector: form.sector,
      locationType: form.locationType,
      initiative: form.initiative.trim().slice(0, 200) || "Not specified",
      initiativeType: form.initiativeType,
      baselineEnergy: Math.max(0, parseFloat(form.baselineEnergy) || 0),
      finalEnergy: Math.max(0, parseFloat(form.finalEnergy) || 0),
      baselineFuel: Math.max(0, parseFloat(form.baselineFuel) || 0),
      finalFuel: Math.max(0, parseFloat(form.finalFuel) || 0),
      fuelType: form.fuelType,
      wasteReduction: Math.max(0, parseFloat(form.wasteReduction) || 0),
      investment: Math.max(0, parseFloat(form.investment) || 0),
      annualCostSavings: Math.max(0, parseFloat(form.annualCostSavings) || 0),
    };
    onAdd([cs]);
    setForm({ name: "", sector: "Household", locationType: "Urban", initiative: "", initiativeType: "Renewable Energy", baselineEnergy: "", finalEnergy: "", baselineFuel: "", finalFuel: "", fuelType: "none", wasteReduction: "", investment: "", annualCostSavings: "" });
    toast({ title: "Case study added" });
  };

  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "case_study_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Plus className="h-4 w-4 text-primary" />
          Add Case Studies
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload">
          <TabsList className="mb-4">
            <TabsTrigger value="upload" className="gap-1.5"><Upload className="h-3.5 w-3.5" /> Upload CSV</TabsTrigger>
            <TabsTrigger value="manual" className="gap-1.5"><Plus className="h-3.5 w-3.5" /> Manual Entry</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center space-y-3">
              <FileSpreadsheet className="h-10 w-10 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Upload a CSV file with case study data</p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" size="sm" onClick={downloadTemplate}>Download Template</Button>
                <Button size="sm" onClick={() => fileRef.current?.click()}>
                  <Upload className="h-3.5 w-3.5 mr-1" /> Choose File
                </Button>
              </div>
              <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleCSVUpload} />
            </div>
            {csvErrors.length > 0 && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 space-y-1">
                <p className="text-sm font-medium text-destructive flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4" /> Import Errors
                </p>
                {csvErrors.map((err, i) => (
                  <p key={i} className="text-xs text-destructive/80">• {err}</p>
                ))}
              </div>
            )}
            <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
              <strong>Required columns:</strong> name, sector, locationType, baselineEnergy, finalEnergy
              <br />
              <strong>Optional:</strong> initiative, initiativeType, baselineFuel, finalFuel, fuelType (petrol/diesel/lpg/none), wasteReduction, investment, annualCostSavings
            </div>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Name *</Label>
                <Input placeholder="e.g. Green Home" value={form.name} onChange={(e) => set("name", e.target.value)} maxLength={100} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Sector</Label>
                <Select value={form.sector} onValueChange={(v) => set("sector", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Household", "Office", "School/College", "Retail", "Small Industry", "Tourism", "Other"].map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Location Type</Label>
                <Select value={form.locationType} onValueChange={(v) => set("locationType", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Urban", "Semi-urban", "Rural"].map((l) => (
                      <SelectItem key={l} value={l}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs">Initiative</Label>
                <Input placeholder="e.g. Solar panels + LED lighting" value={form.initiative} onChange={(e) => set("initiative", e.target.value)} maxLength={200} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Initiative Type</Label>
                <Select value={form.initiativeType} onValueChange={(v) => set("initiativeType", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Renewable Energy", "Energy Efficiency", "Fuel Switching", "Behavioral Change", "Other"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Baseline Energy (kWh/yr)</Label>
                <Input type="number" min="0" placeholder="0" value={form.baselineEnergy} onChange={(e) => set("baselineEnergy", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Final Energy (kWh/yr)</Label>
                <Input type="number" min="0" placeholder="0" value={form.finalEnergy} onChange={(e) => set("finalEnergy", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Fuel Type</Label>
                <Select value={form.fuelType} onValueChange={(v) => set("fuelType", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["none", "petrol", "diesel", "lpg"].map((f) => (
                      <SelectItem key={f} value={f}>{f === "none" ? "None" : f.charAt(0).toUpperCase() + f.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Baseline Fuel (L/yr)</Label>
                <Input type="number" min="0" placeholder="0" value={form.baselineFuel} onChange={(e) => set("baselineFuel", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Final Fuel (L/yr)</Label>
                <Input type="number" min="0" placeholder="0" value={form.finalFuel} onChange={(e) => set("finalFuel", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Waste Reduction (kg/yr)</Label>
                <Input type="number" min="0" placeholder="0" value={form.wasteReduction} onChange={(e) => set("wasteReduction", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Investment (₹)</Label>
                <Input type="number" min="0" placeholder="0" value={form.investment} onChange={(e) => set("investment", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Annual Cost Savings (₹)</Label>
                <Input type="number" min="0" placeholder="0" value={form.annualCostSavings} onChange={(e) => set("annualCostSavings", e.target.value)} />
              </div>
            </div>
            <Button onClick={handleManualAdd} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-1" /> Add Case Study
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AddCaseStudy;
