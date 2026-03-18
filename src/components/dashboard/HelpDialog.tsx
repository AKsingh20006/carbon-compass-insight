import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle, BarChart3, Filter, FlaskConical, BookOpen, PlusCircle, Table2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const helpItems = [
  {
    icon: Filter,
    title: "Filters",
    description:
      "Use sector, location, and initiative type filters to narrow down case studies. Select 'All' to view everything.",
  },
  {
    icon: BarChart3,
    title: "KPI Cards",
    description:
      "Key performance indicators showing total CO₂ saved, average energy reduction, cost savings, and number of case studies.",
  },
  {
    icon: BarChart3,
    title: "Charts & Visualizations",
    description:
      "Interactive charts displaying CO₂ savings by sector, initiative distribution, cost vs. CO₂ comparison, and more.",
  },
  {
    icon: Table2,
    title: "Case Study Table",
    description:
      "Detailed table of all case studies with company, sector, energy, emissions, and cost data. You can download it as CSV.",
  },
  {
    icon: PlusCircle,
    title: "Add Case Study",
    description:
      "Add your own case studies manually or upload a CSV file with multiple entries at once.",
  },
  {
    icon: FlaskConical,
    title: "What-If Simulator",
    description:
      "Simulate potential CO₂ reductions by adjusting electricity, fuel, and waste parameters with custom emission factors.",
  },
  {
    icon: BookOpen,
    title: "Methodology & Sources",
    description:
      "Details on the CO₂ reduction formula, emission factors (CEA 2023, IPCC), and Tier 1 calculation methodology used.",
  },
];

const HelpDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <HelpCircle className="h-4 w-4 mr-1" />
          Help
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Dashboard Guide
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4">
            {helpItems.map((item) => (
              <div key={item.title} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                <item.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-foreground">{item.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default HelpDialog;
