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
  isActive: boolean;
}

export interface Horse {
  id: string;
  name: string;
  breed: string;
  color: string;
  age: number;
  gender: 'male' | 'female' | 'gelding';
  weight?: number;
  height?: number;
  ownerId: string;
  harasId: string;
  stallId?: string;
  notes?: string;
  photos?: string[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Diet {
  id: string;
  horseId: string;
  type: DietType;
  hayAmount?: number; // kg por dia
  grainAmount?: number; // kg por dia
  supplementAmount?: number; // kg por dia
  feedingTimes: string[]; // ['07:00', '12:00', '18:00']
  specialInstructions?: string;
  startDate: Date;
  endDate?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Medication {
  id: string;
  horseId: string;
  name: string;
  dosage: string;
  frequency: MedicationFrequency;
  route: string; // oral, injectable, topical
  startDate: Date;
  endDate?: Date;
  prescribedBy: string; // veterinarian ID
  instructions: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface MedicationRecord {
  id: string;
  medicationId: string;
  administeredBy: string; // user ID
  administeredAt: Date;
  dosageGiven: string;
  notes?: string;
  createdAt: Date;
}

export interface Stall {
  id: string;
  harasId: string;
  number: string;
  name?: string;
  status: StallStatus;
  horse?: Horse; // Horse completo quando ocupada
  dimensions?: string;
  description?: string;
  lastCleaning?: Date;
  lastCleanedBy?: string; // user ID
  lastMaintenance?: Date;
  nextCleaningDue?: Date;
  nextMaintenanceDue?: Date;
  cleaningNotes?: string;
  maintenanceNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface CleaningRecord {
  id: string;
  stallId: string;
  cleanedBy: string; // user ID
  cleanedAt: Date;
  type: 'routine' | 'deep' | 'maintenance';
  notes?: string;
  photoBefore?: string;
  photoAfter?: string;
  timeSpent?: number; // minutes
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  harasId?: string;
  phone?: string;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export interface CreateHarasDTO {
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone?: string;
  email?: string;
  totalStalls: number;
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
  isActive?: boolean;
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
  totalStalls: number;
}
  horseId?: string;
  horseName?: string;
  dimensions?: string;
  description?: string;
  lastCleaning?: Date;
  lastMaintenance?: Date;
  nextCleaningDue?: Date;
  nextMaintenanceDue?: Date;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface CreateStallDTO {
  haras_id: string;
  number: string;
  name?: string;
  dimensions?: string;
  description?: string;
}

export interface StallStats {
  total: number;
  empty: number;
  occupied: number;
  maintenance: number;
  cleaning: number;
}

export interface ApiResponse<T> {
  status: string;
  message?: string;
  data: T;
}

// Serviços da API
export const harasProService = {
  // Haras
  async createHaras(data: CreateHarasDTO): Promise<ApiResponse<Haras>> {
    const response = await apiClient.post<ApiResponse<Haras>>('/haras-pro/haras', data);
    return response.data;
  },

  async getMyHaras(): Promise<ApiResponse<Haras[]>> {
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

  // Baias (Stalls)
  async createStall(data: CreateStallDTO): Promise<ApiResponse<Stall>> {
    const response = await apiClient.post<ApiResponse<Stall>>('/haras-pro/stalls', data);
    return response.data;
  },

  async getStallsByHaras(harasId: string): Promise<ApiResponse<Stall[]>> {
    const response = await apiClient.get<ApiResponse<Stall[]>>(`/haras-pro/haras/${harasId}/stalls`);
    return response.data;
  },

  async getStallStats(harasId: string): Promise<ApiResponse<StallStats>> {
    const response = await apiClient.get<ApiResponse<StallStats>>(`/haras-pro/haras/${harasId}/stalls/stats`);
    return response.data;
  },

  async deleteStall(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(`/haras-pro/stalls/${id}`);
    return response.data;
  },

  async manageStallOccupation(stallId: string, action: 'occupy' | 'vacate', horseData?: { horseId?: string; horseName?: string; notes?: string }): Promise<ApiResponse<Stall>> {
    const response = await apiClient.post<ApiResponse<Stall>>(`/haras-pro/stalls/${stallId}/occupation`, {
      action,
      ...horseData
    });
    return response.data;
  },

  async recordMaintenance(stallId: string, type: 'cleaning' | 'maintenance', notes?: string, nextDue?: Date): Promise<ApiResponse<Stall>> {
    const response = await apiClient.post<ApiResponse<Stall>>(`/haras-pro/stalls/${stallId}/maintenance`, {
      type,
      notes,
      nextDue
    });
    return response.data;
  }
}; 
