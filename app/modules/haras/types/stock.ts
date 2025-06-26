export interface FeedStock {
  id: string;
  harasId: string;
  feedType: 'hay' | 'grain' | 'supplement' | 'concentrate' | 'pellets' | 'other';
  brand: string;
  name: string;
  description?: string;
  currentQuantity: number;
  minimumThreshold: number;
  maximumCapacity: number;
  unit: 'kg' | 'tons' | 'bags' | 'liters';
  costPerUnit: number;
  supplier?: string;
  lastRestockDate: string;
  expirationDate?: string;
  storageLocation?: string;
  notes?: string;
  isActive: boolean;
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
  createdBy: string;
  createdAt: string;
}

export interface StockAlert {
  id: string;
  stockId: string;
  type: 'low_stock' | 'expired' | 'near_expiry';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  isResolved: boolean;
  createdAt: string;
}

export interface CreateStockDTO {
  harasId: string;
  feedType: FeedStock['feedType'];
  brand: string;
  name: string;
  description?: string;
  currentQuantity: number;
  minimumThreshold: number;
  maximumCapacity: number;
  unit: FeedStock['unit'];
  costPerUnit: number;
  supplier?: string;
  expirationDate?: string;
  storageLocation?: string;
  notes?: string;
}

export interface UpdateStockDTO extends Partial<CreateStockDTO> {
  id: string;
}

export interface StockMovementDTO {
  stockId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  notes?: string;
}

export interface StockStats {
  totalItems: number;
  lowStockItems: number;
  expiredItems: number;
  totalValue: number;
  averageDaysToExpiry: number;
}
