export interface Medicine {
  id: string;
  name: string;
  description?: string;
  manufacturer: string;
  activeIngredient: string;
  concentration: string;
  dosageForm: 'tablet' | 'liquid' | 'injection' | 'powder' | 'gel' | 'paste';
  prescriptionRequired: boolean;
  storageInstructions?: string;
  sideEffects?: string;
  withdrawalPeriod?: number; // days
  harasId: string;
  createdAt: string;
  updatedAt: string;
}

export interface VeterinaryStock {
  id: string;
  medicineId: string;
  medicine?: Medicine;
  quantity: number;
  unit: 'ml' | 'mg' | 'tablets' | 'doses' | 'bottles' | 'syringes';
  lotNumber: string;
  expirationDate: string;
  costPerUnit: number;
  supplier?: string;
  minimumQuantity: number;
  location?: string; // storage location
  harasId: string;
  createdAt: string;
  updatedAt: string;
}

export interface VeterinaryAlert {
  id: string;
  type: 'low_stock' | 'expired' | 'near_expiry';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  stockId?: string;
  medicineId?: string;
  quantity?: number;
  expirationDate?: string;
  harasId: string;
  acknowledged: boolean;
  createdAt: string;
}

export interface Treatment {
  id: string;
  horseId: string;
  horseName?: string;
  veterinarianName: string;
  diagnosis: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'suspended';
  instructions: string;
  harasId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TreatmentMedicine {
  id: string;
  treatmentId: string;
  medicineId: string;
  medicine?: Medicine;
  dosage: string;
  frequency: string;
  duration: number; // days
  totalQuantityNeeded: number;
  administeredQuantity: number;
  route: 'oral' | 'injection' | 'topical' | 'intravenous';
  instructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  stockId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  notes?: string;
  performedBy: string;
  createdAt: string;
}

export interface VeterinaryCost {
  period: string;
  totalCost: number;
  medicinesCost: number;
  treatmentsCost: number;
  breakdown: {
    medicineId: string;
    medicineName: string;
    quantity: number;
    cost: number;
  }[];
}
