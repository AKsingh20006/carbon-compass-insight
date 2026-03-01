// Emission Factors (Indian context)
export const EMISSION_FACTORS = {
  electricity: 0.82, // kg CO₂ per kWh (Indian grid average)
  petrol: 2.31,      // kg CO₂ per liter
  diesel: 2.68,      // kg CO₂ per liter
  waste: 0.5,        // kg CO₂ per kg waste avoided (landfill methane)
};

export interface CaseStudy {
  id: number;
  name: string;
  sector: string;
  locationType: "Urban" | "Semi-urban" | "Rural";
  initiative: string;
  initiativeType: string;
  baselineEnergy: number; // kWh/year
  finalEnergy: number;
  baselineFuel: number; // liters/year
  finalFuel: number;
  fuelType: "petrol" | "diesel" | "none";
  wasteReduction: number; // kg/year
  investment: number; // ₹
  annualCostSavings: number; // ₹
}

// Derived calculation functions
export function energySaved(cs: CaseStudy) {
  return cs.baselineEnergy - cs.finalEnergy;
}

export function fuelSaved(cs: CaseStudy) {
  return cs.baselineFuel - cs.finalFuel;
}

export function co2Saved(cs: CaseStudy): number {
  const elecCO2 = energySaved(cs) * EMISSION_FACTORS.electricity;
  const fuelFactor = cs.fuelType === "petrol" ? EMISSION_FACTORS.petrol
    : cs.fuelType === "diesel" ? EMISSION_FACTORS.diesel : 0;
  const fuelCO2 = fuelSaved(cs) * fuelFactor;
  const wasteCO2 = cs.wasteReduction * EMISSION_FACTORS.waste;
  return Math.round(elecCO2 + fuelCO2 + wasteCO2);
}

export function paybackYears(cs: CaseStudy): number | null {
  if (cs.investment === 0 || cs.annualCostSavings === 0) return null;
  return Math.round((cs.investment / cs.annualCostSavings) * 10) / 10;
}

export const caseStudies: CaseStudy[] = [
  {
    id: 1,
    name: "Sharma Residence",
    sector: "Household",
    locationType: "Urban",
    initiative: "Rooftop solar panels (3 kW) + LED lighting",
    initiativeType: "Renewable Energy",
    baselineEnergy: 4800,
    finalEnergy: 1800,
    baselineFuel: 0,
    finalFuel: 0,
    fuelType: "none",
    wasteReduction: 120,
    investment: 210000,
    annualCostSavings: 24000,
  },
  {
    id: 2,
    name: "Patel Family Home",
    sector: "Household",
    locationType: "Rural",
    initiative: "Biogas plant + efficient cookstove",
    initiativeType: "Fuel Switching",
    baselineEnergy: 2400,
    finalEnergy: 1800,
    baselineFuel: 600,
    finalFuel: 100,
    fuelType: "diesel",
    wasteReduction: 800,
    investment: 45000,
    annualCostSavings: 18000,
  },
  {
    id: 3,
    name: "GreenTech Solutions Office",
    sector: "Office",
    locationType: "Urban",
    initiative: "Smart HVAC + motion-sensor lighting",
    initiativeType: "Energy Efficiency",
    baselineEnergy: 32000,
    finalEnergy: 20000,
    baselineFuel: 0,
    finalFuel: 0,
    fuelType: "none",
    wasteReduction: 300,
    investment: 480000,
    annualCostSavings: 96000,
  },
  {
    id: 4,
    name: "Apex Consulting Office",
    sector: "Office",
    locationType: "Semi-urban",
    initiative: "Work-from-home policy + energy audit retrofits",
    initiativeType: "Behavioral Change",
    baselineEnergy: 18000,
    finalEnergy: 11000,
    baselineFuel: 1200,
    finalFuel: 400,
    fuelType: "petrol",
    wasteReduction: 200,
    investment: 120000,
    annualCostSavings: 72000,
  },
  {
    id: 5,
    name: "DAV Public School",
    sector: "School/College",
    locationType: "Semi-urban",
    initiative: "Solar water heaters + rainwater harvesting + composting",
    initiativeType: "Renewable Energy",
    baselineEnergy: 25000,
    finalEnergy: 16000,
    baselineFuel: 0,
    finalFuel: 0,
    fuelType: "none",
    wasteReduction: 1500,
    investment: 350000,
    annualCostSavings: 65000,
  },
  {
    id: 6,
    name: "QuickMart Retail Store",
    sector: "Retail",
    locationType: "Urban",
    initiative: "Inverter refrigeration + plastic-free packaging",
    initiativeType: "Energy Efficiency",
    baselineEnergy: 15000,
    finalEnergy: 9500,
    baselineFuel: 0,
    finalFuel: 0,
    fuelType: "none",
    wasteReduction: 600,
    investment: 200000,
    annualCostSavings: 45000,
  },
  {
    id: 7,
    name: "Anand Textiles Unit",
    sector: "Small Industry",
    locationType: "Semi-urban",
    initiative: "Waste heat recovery + efficient motors",
    initiativeType: "Energy Efficiency",
    baselineEnergy: 80000,
    finalEnergy: 55000,
    baselineFuel: 2000,
    finalFuel: 1200,
    fuelType: "diesel",
    wasteReduction: 400,
    investment: 750000,
    annualCostSavings: 195000,
  },
  {
    id: 8,
    name: "Himalaya Eco Resort",
    sector: "Tourism",
    locationType: "Rural",
    initiative: "Off-grid solar + EV shuttle + zero-waste kitchen",
    initiativeType: "Renewable Energy",
    baselineEnergy: 20000,
    finalEnergy: 8000,
    baselineFuel: 800,
    finalFuel: 200,
    fuelType: "diesel",
    wasteReduction: 1200,
    investment: 600000,
    annualCostSavings: 110000,
  },
];
