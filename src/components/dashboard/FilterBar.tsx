import { Badge } from "@/components/ui/badge";

interface FilterBarProps {
  sectors: string[];
  locations: string[];
  initiatives: string[];
  selectedSector: string;
  selectedLocation: string;
  selectedInitiative: string;
  onSectorChange: (v: string) => void;
  onLocationChange: (v: string) => void;
  onInitiativeChange: (v: string) => void;
}

const FilterChip = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <Badge
    variant={active ? "default" : "outline"}
    className="cursor-pointer select-none transition-colors"
    onClick={onClick}
  >
    {label}
  </Badge>
);

const FilterBar = ({
  sectors, locations, initiatives,
  selectedSector, selectedLocation, selectedInitiative,
  onSectorChange, onLocationChange, onInitiativeChange,
}: FilterBarProps) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground w-16">Sector</span>
        <FilterChip label="All" active={selectedSector === "All"} onClick={() => onSectorChange("All")} />
        {sectors.map((s) => (
          <FilterChip key={s} label={s} active={selectedSector === s} onClick={() => onSectorChange(s)} />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground w-16">Location</span>
        <FilterChip label="All" active={selectedLocation === "All"} onClick={() => onLocationChange("All")} />
        {locations.map((l) => (
          <FilterChip key={l} label={l} active={selectedLocation === l} onClick={() => onLocationChange(l)} />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground w-16">Initiative</span>
        <FilterChip label="All" active={selectedInitiative === "All"} onClick={() => onInitiativeChange("All")} />
        {initiatives.map((i) => (
          <FilterChip key={i} label={i} active={selectedInitiative === i} onClick={() => onInitiativeChange(i)} />
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
