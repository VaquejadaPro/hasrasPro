import { apiClient } from '../../../../services/api';

export interface Cavalo {
  id: string;
  name: string;
  breed: string;
  gender: 'male' | 'female' | 'gelding';
  age: number;
  color: string;
  weight?: number;
  height?: number;
  registration?: string;
  father?: {
    name: string;
    registration: string;
  };
  mother?: {
    name: string;
    registration: string;
  };
  harasId: string;
  stallId?: string;
  status: 'active' | 'inactive' | 'sold' | 'deceased';
  birthDate: string;
  acquisitionDate?: string;
  acquisitionValue?: number;
  currentValue?: number;
  notes?: string;
  photos: string[];
  microchip?: string;
  offspring?: {
    name: string;
    registration: string;
    birthDate: string;
  }[];
  achievements?: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface CavaloStats {
  total: number;
  active: number;
  inactive: number;
  withStall: number;
  withoutStall: number;
  byGender: {
    male: number;
    female: number;
    gelding: number;
  };
}

export interface CreateCavaloRequest {
  name: string;
  breed: string;
  gender: 'male' | 'female' | 'gelding';
  age: number;
  color: string;
  weight?: number;
  height?: number;
  registration?: string;
  father?: {
    name: string;
    registration: string;
  };
  mother?: {
    name: string;
    registration: string;
  };
  harasId: string;
  birthDate: string;
  acquisitionDate?: string;
  acquisitionValue?: number;
  currentValue?: number;
  notes?: string;
  photos?: string[];
  microchip?: string;
}

export interface UpdateCavaloRequest extends Partial<CreateCavaloRequest> {
  id: string;
}

class CavaloService {
  // Listar todos os cavalos do haras
  async getCavalosByHaras(harasId: string): Promise<Cavalo[]> {
    try {
      const response = await apiClient.get(`/haras-pro/horses/haras/${harasId}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Erro ao buscar cavalos:', error);
      throw error;
    }
  }

  // Listar cavalos disponíveis (sem baia)
  async getCavalosDisponiveis(harasId: string): Promise<Cavalo[]> {
    try {
      const response = await apiClient.get(`/haras-pro/horses/haras/${harasId}/available`);
      return response.data.data || [];
    } catch (error) {
      console.error('Erro ao buscar cavalos disponíveis:', error);
      throw error;
    }
  }

  // Obter estatísticas dos cavalos
  async getCavaloStats(harasId: string): Promise<CavaloStats> {
    try {
      const response = await apiClient.get(`/haras-pro/horses/haras/${harasId}/stats`);
      return response.data.data || {
        total: 0,
        active: 0,
        inactive: 0,
        withStall: 0,
        withoutStall: 0,
        byGender: {
          male: 0,
          female: 0,
          gelding: 0
        }
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  }

  // Buscar cavalo por ID
  async getCavaloById(id: string): Promise<Cavalo> {
    try {
      const response = await apiClient.get(`/haras-pro/horses/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar cavalo:', error);
      throw error;
    }
  }

  // Criar novo cavalo
  async createCavalo(cavaloData: CreateCavaloRequest): Promise<Cavalo> {
    try {
      const response = await apiClient.post('/haras-pro/horses', cavaloData);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao criar cavalo:', error);
      throw error;
    }
  }

  // Atualizar cavalo
  async updateCavalo(id: string, cavaloData: Partial<UpdateCavaloRequest>): Promise<Cavalo> {
    try {
      const response = await apiClient.put(`/haras-pro/horses/${id}`, cavaloData);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao atualizar cavalo:', error);
      throw error;
    }
  }

  // Excluir cavalo
  async deleteCavalo(id: string): Promise<void> {
    try {
      await apiClient.delete(`/haras-pro/horses/${id}`);
    } catch (error) {
      console.error('Erro ao excluir cavalo:', error);
      throw error;
    }
  }

  // Atribuir cavalo a uma baia
  async assignCavaloToBaia(horseId: string, stallId: string): Promise<Cavalo> {
    try {
      const response = await apiClient.put(`/haras-pro/horses/${horseId}/assign-stall`, {
        stallId
      });
      return response.data.data;
    } catch (error) {
      console.error('Erro ao atribuir cavalo à baia:', error);
      throw error;
    }
  }

  // Remover cavalo da baia
  async removeCavaloFromBaia(horseId: string): Promise<Cavalo> {
    try {
      const response = await apiClient.put(`/haras-pro/horses/${horseId}/remove-stall`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao remover cavalo da baia:', error);
      throw error;
    }
  }
}

export const cavaloService = new CavaloService();
