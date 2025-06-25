import { apiClient } from '../../../../services/api';

export interface Baia {
  id: string;
  number: string;
  harasId: string;
  size: string;
  status: 'empty' | 'occupied' | 'maintenance' | 'cleaning';
  currentHorseId?: string;
  currentHorse?: {
    id: string;
    name: string;
    breed: string;
    gender: 'male' | 'female' | 'gelding';
    age: number;
    color: string;
  };
  lastCleaning?: string;
  cleaningFrequency: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BaiaStats {
  total: number;
  occupied: number;
  empty: number;
  maintenance: number;
  cleaning: number;
}

export interface CreateBaiaRequest {
  number: string;
  harasId: string;
  size: string;
  cleaningFrequency?: number;
  notes?: string;
}

export interface UpdateBaiaRequest extends Partial<CreateBaiaRequest> {
  id: string;
  status?: 'empty' | 'occupied' | 'maintenance' | 'cleaning';
}

class BaiaService {
  // Listar todas as baias do haras
  async getBaiasByHaras(harasId: string): Promise<Baia[]> {
    try {
      const response = await apiClient.get(`/haras-pro/stalls/haras/${harasId}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Erro ao buscar baias:', error);
      throw error;
    }
  }

  // Obter estatísticas das baias
  async getBaiaStats(harasId: string): Promise<BaiaStats> {
    try {
      const response = await apiClient.get(`/haras-pro/stalls/haras/${harasId}/stats`);
      return response.data.data || {
        total: 0,
        occupied: 0,
        empty: 0,
        maintenance: 0,
        cleaning: 0
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas das baias:', error);
      throw error;
    }
  }

  // Buscar baia por ID
  async getBaiaById(id: string): Promise<Baia> {
    try {
      const response = await apiClient.get(`/haras-pro/stalls/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar baia:', error);
      throw error;
    }
  }

  // Criar nova baia
  async createBaia(baiaData: CreateBaiaRequest): Promise<Baia> {
    try {
      const response = await apiClient.post('/haras-pro/stalls', baiaData);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao criar baia:', error);
      throw error;
    }
  }

  // Atualizar baia
  async updateBaia(id: string, baiaData: Partial<UpdateBaiaRequest>): Promise<Baia> {
    try {
      const response = await apiClient.put(`/haras-pro/stalls/${id}`, baiaData);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao atualizar baia:', error);
      throw error;
    }
  }

  // Excluir baia
  async deleteBaia(id: string): Promise<void> {
    try {
      await apiClient.delete(`/haras-pro/stalls/${id}`);
    } catch (error) {
      console.error('Erro ao excluir baia:', error);
      throw error;
    }
  }

  // Gerenciar ocupação da baia
  async manageOccupation(stallId: string, data: { action: 'occupy' | 'vacate'; horseId?: string }): Promise<Baia> {
    try {
      const response = await apiClient.post(`/haras-pro/stalls/${stallId}/occupation`, data);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao gerenciar ocupação da baia:', error);
      throw error;
    }
  }

  // Registrar manutenção
  async recordMaintenance(stallId: string, data: { type: string; description?: string; cost?: number }): Promise<void> {
    try {
      await apiClient.post(`/haras-pro/stalls/${stallId}/maintenance`, data);
    } catch (error) {
      console.error('Erro ao registrar manutenção:', error);
      throw error;
    }
  }

  // Definir status de manutenção
  async setMaintenanceStatus(stallId: string, status: string): Promise<Baia> {
    try {
      const response = await apiClient.put(`/haras-pro/stalls/${stallId}/maintenance-status`, { status });
      return response.data.data;
    } catch (error) {
      console.error('Erro ao definir status de manutenção:', error);
      throw error;
    }
  }

  // Obter baias que precisam de manutenção
  async getMaintenanceDue(harasId: string): Promise<Baia[]> {
    try {
      const response = await apiClient.get(`/haras-pro/stalls/haras/${harasId}/maintenance-due`);
      return response.data.data || [];
    } catch (error) {
      console.error('Erro ao buscar baias para manutenção:', error);
      return [];
    }
  }
}

export const baiaService = new BaiaService();
