import { apiClient } from '../../../../services/api';
import { ApiResponse } from '../../../../services/harasProService';

// Interfaces para medicamentos
export interface Medicine {
  id: string;
  name: string;
  activeIngredient: string;
  type: 'antibiotic' | 'anti-inflammatory' | 'vaccine' | 'supplement' | 'other';
  manufacturer: string;
  description?: string;
  dosageForm: 'oral' | 'injectable' | 'topical' | 'other';
  concentration?: string;
  prescriptionRequired: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VeterinaryStock {
  id: string;
  harasId: string;
  medicineId: string;
  medicine: Medicine;
  batchNumber: string;
  currentQuantity: number;
  minimumThreshold: number;
  maximumCapacity: number;
  unitCost: number;
  totalValue: number;
  expirationDate: string;
  purchaseDate: string;
  supplier: string;
  storageLocation: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VeterinaryAlert {
  id: string;
  harasId: string;
  stockId: string;
  type: 'low_stock' | 'expiring_soon' | 'expired';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isResolved: boolean;
  createdAt: string;
}

export interface HorseTreatment {
  id: string;
  harasId: string;
  horseId: string;
  horseName: string;
  veterinarian: string;
  diagnosis: string;
  treatmentType: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'suspended';
  notes?: string;
  medicines: TreatmentMedicine[];
  totalCost: number;
  createdAt: string;
  updatedAt: string;
}

export interface TreatmentMedicine {
  id: string;
  medicineId: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  applicationDates: string[];
}

export interface CreateMedicineDTO {
  name: string;
  activeIngredient: string;
  type: 'antibiotic' | 'anti-inflammatory' | 'vaccine' | 'supplement' | 'other';
  manufacturer: string;
  description?: string;
  dosageForm: 'oral' | 'injectable' | 'topical' | 'other';
  concentration?: string;
  prescriptionRequired: boolean;
}

export interface CreateVeterinaryStockDTO {
  medicineId: string;
  batchNumber: string;
  quantity: number;
  minimumThreshold: number;
  maximumCapacity: number;
  unitCost: number;
  expirationDate: string;
  purchaseDate: string;
  supplier: string;
  storageLocation: string;
  notes?: string;
}

export interface CreateTreatmentDTO {
  horseId: string;
  veterinarian: string;
  diagnosis: string;
  treatmentType: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  medicines: {
    medicineId: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
  }[];
}

export interface StockMovementDTO {
  stockId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  reference?: string;
  notes?: string;
}

class VeterinaryService {
  private baseUrl = '/haras-pro/veterinary';

  // ========== MEDICAMENTOS ==========
  async createMedicine(data: CreateMedicineDTO): Promise<Medicine> {
    try {
      console.log('💊 Criando medicamento:', data);
      const response = await apiClient.post<ApiResponse<Medicine>>(`${this.baseUrl}/medicines`, data);
      console.log('✅ Medicamento criado:', response.data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error('Erro ao criar medicamento');
    } catch (error) {
      console.error('❌ Erro ao criar medicamento:', error);
      throw error;
    }
  }

  async getMedicinesByHaras(harasId: string): Promise<Medicine[]> {
    try {
      console.log('💊 Buscando medicamentos para haras:', harasId);
      const response = await apiClient.get<ApiResponse<Medicine[]>>(`${this.baseUrl}/haras/${harasId}/medicines`);
      console.log('💊 Resposta da API de medicamentos:', response.data);
      
      if (response.data.success && response.data.data) {
        console.log('✅ Medicamentos carregados:', response.data.data.length, 'itens');
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('❌ Erro ao buscar medicamentos:', error);
      return [];
    }
  }

  async updateMedicine(id: string, data: Partial<CreateMedicineDTO>): Promise<Medicine> {
    try {
      const response = await apiClient.put<ApiResponse<Medicine>>(`${this.baseUrl}/medicines/${id}`, data);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error('Erro ao atualizar medicamento');
    } catch (error) {
      console.error('❌ Erro ao atualizar medicamento:', error);
      throw error;
    }
  }

  // ========== ESTOQUE VETERINÁRIO ==========
  async createVeterinaryStock(harasId: string, data: CreateVeterinaryStockDTO): Promise<VeterinaryStock> {
    try {
      console.log('📦 Criando estoque veterinário:', data);
      const response = await apiClient.post<ApiResponse<VeterinaryStock>>(`${this.baseUrl}/stocks`, { ...data, harasId });
      console.log('✅ Estoque veterinário criado:', response.data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error('Erro ao criar estoque veterinário');
    } catch (error) {
      console.error('❌ Erro ao criar estoque veterinário:', error);
      throw error;
    }
  }

  async getVeterinaryStocksByHaras(harasId: string): Promise<VeterinaryStock[]> {
    try {
      console.log('📦 Buscando estoque veterinário para haras:', harasId);
      const response = await apiClient.get<ApiResponse<VeterinaryStock[]>>(`${this.baseUrl}/haras/${harasId}/stocks`);
      console.log('📦 Resposta da API de estoque veterinário:', response.data);
      
      if (response.data.success && response.data.data) {
        console.log('✅ Estoque veterinário carregado:', response.data.data.length, 'itens');
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('❌ Erro ao buscar estoque veterinário:', error);
      return [];
    }
  }

  async createStockMovement(data: StockMovementDTO): Promise<void> {
    try {
      console.log('📋 Criando movimentação de estoque:', data);
      const response = await apiClient.post<ApiResponse<void>>(`${this.baseUrl}/stock-movements`, data);
      
      if (!response.data.success) {
        throw new Error('Erro ao criar movimentação');
      }
    } catch (error) {
      console.error('❌ Erro ao criar movimentação:', error);
      throw error;
    }
  }

  // ========== TRATAMENTOS ==========
  async createHorseTreatment(harasId: string, data: CreateTreatmentDTO): Promise<HorseTreatment> {
    try {
      console.log('🩺 Criando tratamento:', data);
      const response = await apiClient.post<ApiResponse<HorseTreatment>>(`${this.baseUrl}/treatments`, { ...data, harasId });
      console.log('✅ Tratamento criado:', response.data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error('Erro ao criar tratamento');
    } catch (error) {
      console.error('❌ Erro ao criar tratamento:', error);
      throw error;
    }
  }

  async getTreatmentsByHaras(harasId: string): Promise<HorseTreatment[]> {
    try {
      console.log('🩺 Buscando tratamentos para haras:', harasId);
      const response = await apiClient.get<ApiResponse<HorseTreatment[]>>(`${this.baseUrl}/haras/${harasId}/treatments`);
      console.log('🩺 Resposta da API de tratamentos:', response.data);
      
      if (response.data.success && response.data.data) {
        console.log('✅ Tratamentos carregados:', response.data.data.length, 'itens');
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('❌ Erro ao buscar tratamentos:', error);
      return [];
    }
  }

  async applyTreatmentMedicine(treatmentId: string, medicineData: { medicineId: string; applicationDate: string; notes?: string }): Promise<void> {
    try {
      console.log('💉 Aplicando medicamento no tratamento:', treatmentId, medicineData);
      const response = await apiClient.post<ApiResponse<void>>(`${this.baseUrl}/treatments/${treatmentId}/apply`, medicineData);
      
      if (!response.data.success) {
        throw new Error('Erro ao aplicar medicamento');
      }
    } catch (error) {
      console.error('❌ Erro ao aplicar medicamento:', error);
      throw error;
    }
  }

  // ========== ALERTAS E RELATÓRIOS ==========
  async getLowStockAlerts(harasId: string): Promise<VeterinaryAlert[]> {
    try {
      console.log('🚨 Buscando alertas de estoque baixo para haras:', harasId);
      const response = await apiClient.get<ApiResponse<VeterinaryAlert[]>>(`${this.baseUrl}/haras/${harasId}/alerts/low-stock`);
      console.log('🚨 Resposta da API de alertas veterinários:', response.data);
      
      if (response.data.success && response.data.data) {
        console.log('✅ Alertas veterinários carregados:', response.data.data.length, 'alertas');
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('❌ Erro ao buscar alertas veterinários:', error);
      return [];
    }
  }

  async getVeterinaryCosts(harasId: string): Promise<any> {
    try {
      console.log('💰 Calculando custos veterinários para haras:', harasId);
      const response = await apiClient.get<ApiResponse<any>>(`${this.baseUrl}/haras/${harasId}/costs`);
      console.log('💰 Resposta da API de custos veterinários:', response.data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('❌ Erro ao calcular custos veterinários:', error);
      return null;
    }
  }
}

export const veterinaryService = new VeterinaryService();
