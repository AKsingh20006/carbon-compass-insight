import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CaseStudy, co2Saved, energySaved, paybackYears } from "@/data/caseStudies";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

interface Props {
  studies: CaseStudy[];
}

const CaseStudyTable = ({ studies }: Props) => {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Case Study Details</CardTitle>
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
