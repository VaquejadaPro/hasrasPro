import { apiClient } from './api';

// Enums
export enum StallStatus {
  EMPTY = 'empty',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
  CLEANING = 'cleaning'
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  CARETAKER = 'caretaker', // Tratador
  VETERINARIAN = 'veterinarian'
}

export enum MedicationFrequency {
  ONCE = 'once',
  DAILY = 'daily',
  TWICE_DAILY = 'twice_daily',
  THREE_TIMES_DAILY = 'three_times_daily',
  WEEKLY = 'weekly',
  AS_NEEDED = 'as_needed'
}

export enum DietType {
  HAY_ONLY = 'hay_only',
  HAY_AND_GRAIN = 'hay_and_grain',
  PASTURE = 'pasture',
  MIXED = 'mixed',
  SPECIAL = 'special'
}

// Interfaces principais
export interface Haras {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone?: string;
  email?: string;
  ownerId: string;
  totalStalls: number;
  occupiedStalls: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Stall {
  id: string;
  number: string;
  harasId: string;
  size: string;
  status: StallStatus;
  currentHorseId?: string;
  currentHorse?: Horse;
  lastCleaning?: Date;
  cleaningFrequency: number; // days
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Horse {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender: 'male' | 'female';
  color: string;
  weight?: number;
  height?: number;
  harasId: string;
  stallId?: string;
  stall?: Stall;
  ownerId: string;
  birthDate: Date;
  registrationNumber?: string;
  microchipNumber?: string;
  notes?: string;
  photo?: string;
  status: 'active' | 'inactive' | 'sold' | 'deceased';
  createdAt: Date;
  updatedAt: Date;
}

export interface Diet {
  id: string;
  horseId: string;
  type: DietType;
  feedBrand?: string;
  feedAmount: number; // kg per day
  feedTimes: number; // times per day
  hayAmount?: number; // kg per day
  supplements?: string[];
  restrictions?: string[];
  notes?: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Medication {
  id: string;
  horseId: string;
  name: string;
  type: 'antibiotic' | 'anti_inflammatory' | 'vitamin' | 'vaccine' | 'dewormer' | 'other';
  dosage: string;
  frequency: MedicationFrequency;
  startDate: Date;
  endDate?: Date;
  prescribedBy?: string; // Veterinário
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicationRecord {
  id: string;
  medicationId: string;
  administeredAt: Date;
  administeredBy: string; // User ID
  dosageGiven: string;
  notes?: string;
  createdAt: Date;
}

export interface CleaningRecord {
  id: string;
  stallId: string;
  cleanedAt: Date;
  cleanedBy: string; // User ID
  type: 'routine' | 'deep' | 'maintenance';
  timeSpent?: number; // minutes
  notes?: string;
  photoBefore?: string;
  photoAfter?: string;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  harasId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StallStats {
  total: number;
  occupied: number;
  empty: number;
  maintenance: number;
  cleaning: number;
}

// DTOs
export interface CreateHarasDTO {
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone?: string;
  email?: string;
  totalStalls?: number;
}

export interface UpdateHarasDTO {
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  totalStalls?: number;
}

export interface CreateStallDTO {
  number: string;
  harasId: string;
  size: string;
  cleaningFrequency?: number;
  notes?: string;
}

export interface CreateHorseDTO {
  name: string;
  breed: string;
  age: number;
  gender: 'male' | 'female';
  color: string;
  weight?: number;
  height?: number;
  harasId: string;
  ownerId: string;
  birthDate: Date;
  registrationNumber?: string;
  microchipNumber?: string;
  notes?: string;
  photo?: string;
}

export interface UpdateHorseDTO {
  name?: string;
  breed?: string;
  age?: number;
  gender?: 'male' | 'female';
  color?: string;
  weight?: number;
  height?: number;
  stallId?: string;
  registrationNumber?: string;
  microchipNumber?: string;
  notes?: string;
  photo?: string;
  status?: 'active' | 'inactive' | 'sold' | 'deceased';
}

export interface CreateDietDTO {
  horseId: string;
  type: DietType;
  feedBrand?: string;
  feedAmount: number;
  feedTimes: number;
  hayAmount?: number;
  supplements?: string[];
  restrictions?: string[];
  notes?: string;
  startDate: Date;
  endDate?: Date;
}

export interface UpdateDietDTO {
  type?: DietType;
  feedBrand?: string;
  feedAmount?: number;
  feedTimes?: number;
  hayAmount?: number;
  supplements?: string[];
  restrictions?: string[];
  notes?: string;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
}

export interface CreateMedicationDTO {
  horseId: string;
  name: string;
  type: 'antibiotic' | 'anti_inflammatory' | 'vitamin' | 'vaccine' | 'dewormer' | 'other';
  dosage: string;
  frequency: MedicationFrequency;
  startDate: Date;
  endDate?: Date;
  prescribedBy?: string;
  notes?: string;
}

// Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Service principal
export const harasProService = {
  // Haras - Usando as rotas corretas do backend
  async createHaras(data: CreateHarasDTO): Promise<ApiResponse<Haras>> {
    const response = await apiClient.post<ApiResponse<Haras>>('/haras-pro/haras', data);
    return response.data;
  },

  async getMyHaras(): Promise<ApiResponse<Haras[]>> {
    const response = await apiClient.get<ApiResponse<Haras[]>>('/haras-pro/haras');
    return response.data;
  },

  async getHaras(): Promise<ApiResponse<Haras[]>> {
    const response = await apiClient.get<ApiResponse<Haras[]>>('/haras-pro/haras');
    return response.data;
  },

  async getHarasById(id: string): Promise<ApiResponse<Haras>> {
    const response = await apiClient.get<ApiResponse<Haras>>(`/haras-pro/haras/${id}`);
    return response.data;
  },

  async updateHaras(id: string, data: UpdateHarasDTO): Promise<ApiResponse<Haras>> {
    const response = await apiClient.put<ApiResponse<Haras>>(`/haras-pro/haras/${id}`, data);
    return response.data;
  },

  async deleteHaras(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(`/haras-pro/haras/${id}`);
    return response.data;
  },

  // Baias - Correção: usar as rotas corretas do backend
  async createStall(data: CreateStallDTO): Promise<ApiResponse<Stall>> {
    const response = await apiClient.post<ApiResponse<Stall>>('/haras-pro/stalls', data);
    return response.data;
  },

  async getStallsByHaras(harasId: string): Promise<ApiResponse<Stall[]>> {
    const response = await apiClient.get<ApiResponse<Stall[]>>(`/haras-pro/stalls/haras/${harasId}`);
    return response.data;
  },

  async getStallStats(harasId: string): Promise<ApiResponse<StallStats>> {
    const response = await apiClient.get<ApiResponse<StallStats>>(`/haras-pro/stalls/haras/${harasId}/stats`);
    return response.data;
  },

  async deleteStall(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(`/haras-pro/stalls/${id}`);
    return response.data;
  },

  async occupyStall(stallId: string, horseId: string): Promise<ApiResponse<Stall>> {
    const response = await apiClient.post<ApiResponse<Stall>>(`/haras-pro/stalls/${stallId}/occupation`, {
      horseId
    });
    return response.data;
  },

  async setStallMaintenance(stallId: string, inMaintenance: boolean, notes?: string): Promise<ApiResponse<Stall>> {
    const response = await apiClient.post<ApiResponse<Stall>>(`/haras-pro/stalls/${stallId}/maintenance`, {
      inMaintenance,
      notes
    });
    return response.data;
  },

  async setMaintenanceStatus(stallId: string, status: string): Promise<ApiResponse<Stall>> {
    const response = await apiClient.put<ApiResponse<Stall>>(`/haras-pro/stalls/${stallId}/maintenance-status`, {
      status
    });
    return response.data;
  },

  async getStallsDueForMaintenance(harasId: string): Promise<ApiResponse<Stall[]>> {
    const response = await apiClient.get<ApiResponse<Stall[]>>(`/haras-pro/stalls/haras/${harasId}/maintenance-due`);
    return response.data;
  },

  // Cavalos - Correção: usar as rotas corretas do backend
  async createHorse(data: CreateHorseDTO): Promise<ApiResponse<Horse>> {
    const response = await apiClient.post<ApiResponse<Horse>>('/haras-pro/horses', data);
    return response.data;
  },

  async getHorsesByHaras(harasId: string): Promise<ApiResponse<Horse[]>> {
    const response = await apiClient.get<ApiResponse<Horse[]>>(`/haras-pro/horses/haras/${harasId}`);
    return response.data;
  },

  async getHorseById(id: string): Promise<ApiResponse<Horse>> {
    const response = await apiClient.get<ApiResponse<Horse>>(`/haras-pro/horses/${id}`);
    return response.data;
  },

  async updateHorse(id: string, data: UpdateHorseDTO): Promise<ApiResponse<Horse>> {
    const response = await apiClient.put<ApiResponse<Horse>>(`/haras-pro/horses/${id}`, data);
    return response.data;
  },

  async deleteHorse(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(`/haras-pro/horses/${id}`);
    return response.data;
  },

  async getAvailableHorses(harasId: string): Promise<ApiResponse<Horse[]>> {
    const response = await apiClient.get<ApiResponse<Horse[]>>(`/haras-pro/horses/haras/${harasId}/available`);
    return response.data;
  },

  async assignHorseToStall(horseId: string, stallId: string): Promise<ApiResponse<Horse>> {
    const response = await apiClient.put<ApiResponse<Horse>>(`/haras-pro/horses/${horseId}/assign-stall`, {
      stallId
    });
    return response.data;
  },

  async removeHorseFromStallDirect(horseId: string): Promise<ApiResponse<Horse>> {
    const response = await apiClient.put<ApiResponse<Horse>>(`/haras-pro/horses/${horseId}/remove-stall`);
    return response.data;
  },

  async searchHorses(harasId: string, query: string): Promise<ApiResponse<Horse[]>> {
    const response = await apiClient.get<ApiResponse<Horse[]>>(`/haras-pro/horses/haras/${harasId}/search`, {
      params: { q: query }
    });
    return response.data;
  },

  async getHorseStats(harasId: string): Promise<ApiResponse<any>> {
    const response = await apiClient.get<ApiResponse<any>>(`/haras-pro/horses/haras/${harasId}/stats`);
    return response.data;
  },

  // Dietas de Cavalos - Usar rotas corretas do backend
  async createDiet(data: CreateDietDTO): Promise<ApiResponse<Diet>> {
    const response = await apiClient.post<ApiResponse<Diet>>('/haras-pro/horse-diets', data);
    return response.data;
  },

  async getDietsByHaras(harasId: string): Promise<ApiResponse<Diet[]>> {
    const response = await apiClient.get<ApiResponse<Diet[]>>(`/haras-pro/horse-diets/haras/${harasId}`);
    return response.data;
  },

  async updateDiet(id: string, data: UpdateDietDTO): Promise<ApiResponse<Diet>> {
    const response = await apiClient.put<ApiResponse<Diet>>(`/haras-pro/horse-diets/${id}`, data);
    return response.data;
  },

  // Medicações Veterinárias - Usar rotas corretas do backend
  async createMedicine(data: any): Promise<ApiResponse<any>> {
    const response = await apiClient.post<ApiResponse<any>>('/haras-pro/veterinary/medicines', data);
    return response.data;
  },

  async getMedicinesByHaras(harasId: string): Promise<ApiResponse<any[]>> {
    const response = await apiClient.get<ApiResponse<any[]>>(`/haras-pro/veterinary/haras/${harasId}/medicines`);
    return response.data;
  },

  async createVeterinaryStock(data: any): Promise<ApiResponse<any>> {
    const response = await apiClient.post<ApiResponse<any>>('/haras-pro/veterinary/stocks', data);
    return response.data;
  },

  async getVeterinaryStocksByHaras(harasId: string): Promise<ApiResponse<any[]>> {
    const response = await apiClient.get<ApiResponse<any[]>>(`/haras-pro/veterinary/haras/${harasId}/stocks`);
    return response.data;
  },

  async createTreatment(data: any): Promise<ApiResponse<any>> {
    const response = await apiClient.post<ApiResponse<any>>('/haras-pro/veterinary/treatments', data);
    return response.data;
  },

  async getTreatmentsByHaras(harasId: string): Promise<ApiResponse<any[]>> {
    const response = await apiClient.get<ApiResponse<any[]>>(`/haras-pro/veterinary/haras/${harasId}/treatments`);
    return response.data;
  },

  async getVeterinaryCosts(harasId: string): Promise<ApiResponse<any>> {
    const response = await apiClient.get<ApiResponse<any>>(`/haras-pro/veterinary/haras/${harasId}/costs`);
    return response.data;
  },

  // Embriões - Usar rotas corretas do backend
  async createEmbryo(data: any): Promise<ApiResponse<any>> {
    const response = await apiClient.post<ApiResponse<any>>('/haras-pro/embryos', data);
    return response.data;
  },

  async getEmbryosByHaras(harasId: string): Promise<ApiResponse<any[]>> {
    const response = await apiClient.get<ApiResponse<any[]>>(`/haras-pro/embryos/haras/${harasId}`);
    return response.data;
  },

  async getEmbryoById(id: string): Promise<ApiResponse<any>> {
    const response = await apiClient.get<ApiResponse<any>>(`/haras-pro/embryos/${id}`);
    return response.data;
  },

  async updateEmbryo(id: string, data: any): Promise<ApiResponse<any>> {
    const response = await apiClient.put<ApiResponse<any>>(`/haras-pro/embryos/${id}`, data);
    return response.data;
  },

  async deleteEmbryo(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(`/haras-pro/embryos/${id}`);
    return response.data;
  },

  // Movimentação de Cavalos - Usar rotas corretas do backend
  async moveHorseToStall(horseId: string, stallId: string): Promise<ApiResponse<any>> {
    const response = await apiClient.put<ApiResponse<any>>(`/haras-pro/horse-movements/${horseId}/move-to-stall/${stallId}`);
    return response.data;
  },

  async removeHorseFromStall(horseId: string): Promise<ApiResponse<any>> {
    const response = await apiClient.put<ApiResponse<any>>(`/haras-pro/horse-movements/${horseId}/remove-from-stall`);
    return response.data;
  },

  async getHorseMovementHistory(horseId: string): Promise<ApiResponse<any[]>> {
    const response = await apiClient.get<ApiResponse<any[]>>(`/haras-pro/horse-movements/${horseId}/history`);
    return response.data;
  },

  async getRecentMovements(harasId: string): Promise<ApiResponse<any[]>> {
    const response = await apiClient.get<ApiResponse<any[]>>(`/haras-pro/horse-movements/recent/${harasId}`);
    return response.data;
  },

  // Relatórios Financeiros - Usar rotas corretas do backend
  async generateMonthlyReport(data: any): Promise<ApiResponse<any>> {
    const response = await apiClient.post<ApiResponse<any>>('/haras-pro/financial-reports/monthly', data);
    return response.data;
  },

  async generateAnnualReport(data: any): Promise<ApiResponse<any>> {
    const response = await apiClient.post<ApiResponse<any>>('/haras-pro/financial-reports/annual', data);
    return response.data;
  },

  async getReportsByHaras(harasId: string): Promise<ApiResponse<any[]>> {
    const response = await apiClient.get<ApiResponse<any[]>>(`/haras-pro/financial-reports/haras/${harasId}`);
    return response.data;
  },

  async getFinancialDashboard(harasId: string): Promise<ApiResponse<any>> {
    const response = await apiClient.get<ApiResponse<any>>(`/haras-pro/financial-reports/haras/${harasId}/dashboard`);
    return response.data;
  },

  async calculateHorseCosts(harasId: string): Promise<ApiResponse<any>> {
    const response = await apiClient.get<ApiResponse<any>>(`/haras-pro/financial-reports/haras/${harasId}/horse-costs`);
    return response.data;
  }
};
