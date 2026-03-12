import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CaseStudy, co2Saved, energySaved, fuelSaved, paybackYears } from "@/data/caseStudies";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Download } from "lucide-react";

interface Props {
  studies: CaseStudy[];
  onRemove?: (id: number) => void;
}

const CaseStudyTable = ({ studies, onRemove }: Props) => {
  const handleDownloadCSV = () => {
    const headers = ["ID","Name","Sector","Location Type","Initiative","Initiative Type","Baseline Energy (kWh)","Final Energy (kWh)","Energy Saved (kWh)","Baseline Fuel (L)","Final Fuel (L)","Fuel Saved (L)","Fuel Type","Waste Reduction (kg)","CO2 Saved (kg)","Investment (₹)","Annual Cost Savings (₹)","Payback (years)"];
    const rows = studies.map(cs => [
      cs.id, `"${cs.name}"`, `"${cs.sector}"`, cs.locationType, `"${cs.initiative}"`, `"${cs.initiativeType}"`,
      cs.baselineEnergy, cs.finalEnergy, energySaved(cs),
      cs.baselineFuel, cs.finalFuel, fuelSaved(cs), cs.fuelType,
      cs.wasteReduction, co2Saved(cs), cs.investment, cs.annualCostSavings, paybackYears(cs) ?? "N/A"
    ].join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "case_studies.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base">Case Study Details</CardTitle>
        <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
          <Download className="h-4 w-4 mr-1" />
          Download CSV
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Initiative</TableHead>
                <TableHead className="text-right">Energy Saved (kWh)</TableHead>
                <TableHead className="text-right">CO₂ Saved (kg)</TableHead>
                <TableHead className="text-right">Cost Saved (₹)</TableHead>
                <TableHead className="text-right">Payback (yrs)</TableHead>
                {onRemove && <TableHead className="w-12" />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {studies.map((cs) => (
                <TableRow key={cs.id}>
                  <TableCell className="font-medium">{cs.name}</TableCell>
                  <TableCell>{cs.sector}</TableCell>
                  <TableCell>{cs.locationType}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{cs.initiative}</TableCell>
                  <TableCell className="text-right">{energySaved(cs).toLocaleString()}</TableCell>
                  <TableCell className="text-right">{co2Saved(cs).toLocaleString()}</TableCell>
                  <TableCell className="text-right">₹{cs.annualCostSavings.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{paybackYears(cs) ?? "—"}</TableCell>
                  {onRemove && (
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => onRemove(cs.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseStudyTable;
