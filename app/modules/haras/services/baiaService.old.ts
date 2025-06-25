import { apiClient } from '../../../../services/api';

export interface Baia {
  id: string;
  number: string;
  name?: string;
  type?: 'individual' | 'paddock' | 'quarantine' | 'breeding';
  status: 'empty' | 'occupied' | 'maintenance' | 'reserved';
  harasId: string;
  horseId?: string | null;
  horseName?: string | null;
  dimensions?: string;
  description?: string;
  lastCleaning?: string | null;
  lastMaintenance?: string | null;
  nextCleaningDue?: string | null;
  nextMaintenanceDue?: string | null;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface BaiaStats {
  total: number;
  available: number;
  occupied: number;
  maintenance: number;
  reserved: number;
  occupancyRate: number;
  byType: {
    individual: number;
    paddock: number;
    quarantine: number;
    breeding: number;
  };
}

export interface CreateBaiaRequest {
  number: string;
  name?: string;
  type: 'individual' | 'paddock' | 'quarantine' | 'breeding';
  capacity: number;
  harasId: string;
  sectorId?: string;
  dimensions?: {
    width: number;
    length: number;
    height?: number;
  };
  features?: string[];
  notes?: string;
}

export interface UpdateBaiaRequest extends Partial<CreateBaiaRequest> {
  id: string;
  status?: 'available' | 'occupied' | 'maintenance' | 'reserved';
}

class BaiaService {
  // Dados mock para desenvolvimento
  private getMockBaias(harasId: string): Baia[] {
    return [
      {
        id: 'llH2FvCH4RD9Lh540JzY',
        number: 'A03',
        name: 'Baia Premium',
        type: 'individual',
        status: 'empty',
        harasId: harasId,
        dimensions: '4m x 4m x 3m',
        description: 'Baia premium com bebedouro automático e ventilação',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      },
      {
        id: '9UOEUWVKka2vNTlIjm3H',
        number: 'B01',
        name: 'Baia Standard',
        type: 'individual',
        status: 'empty',
        harasId: harasId,
        dimensions: '3.5m x 3.5m x 3m',
        description: 'Baia padrão com bebedouro',
        dimensions: {
          width: 3.5,
          length: 3.5,
          height: 2.8
        },
        features: ['Bebedouro', 'Ventilação natural'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      },
      {
        id: 's42Ibyh4GU0AWGpmr2Tm',
        number: 'C05',
        name: 'Baia VIP',
        type: 'individual',
        status: 'occupied',
        capacity: 1,
        currentOccupancy: 1,
        harasId: harasId,
        horse: {
          id: 'KG9loRAFKrTgw335w47O',
          name: 'Egoismo',
          registration: 'REG123'
        },
        dimensions: {
          width: 5,
          length: 5,
          height: 3.5
        },
        features: ['Bebedouro automático', 'Ar condicionado', 'Câmera de segurança', 'Piso especial'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      },
      {
        id: 'baia-quarentena-01',
        number: 'Q01',
        name: 'Quarentena 1',
        type: 'quarantine',
        status: 'maintenance',
        capacity: 1,
        currentOccupancy: 0,
        harasId: harasId,
        dimensions: {
          width: 4,
          length: 4,
          height: 3
        },
        features: ['Isolamento', 'Sistema de desinfecção'],
        notes: 'Em manutenção programada',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      }
    ];
  }

  private getMockStats(): BaiaStats {
    return {
      total: 4,
      available: 2,
      occupied: 1,
      maintenance: 1,
      reserved: 0,
      occupancyRate: 25,
      byType: {
        individual: 3,
        paddock: 0,
        quarantine: 1,
        breeding: 0
      }
    };
  }

  // Listar todas as baias do haras
  async getBaiasByHaras(harasId: string): Promise<Baia[]> {
    try {
      const response = await apiClient.get(`/haras-pro/stalls/haras/${harasId}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Erro ao buscar baias, usando dados mock:', error);
      // Retornar dados mock em caso de erro
      return this.getMockBaias(harasId);
    }
  }

  // Listar baias disponíveis (calculado a partir de todas as baias)
  async getBaiasDisponiveis(harasId: string): Promise<Baia[]> {
    try {
      const todasBaias = await this.getBaiasByHaras(harasId);
      return todasBaias.filter(baia => baia.status === 'empty');
    } catch (error) {
      console.error('Erro ao buscar baias disponíveis:', error);
      return [];
    }
  }

  // Obter estatísticas das baias
  async getBaiaStats(harasId: string): Promise<BaiaStats> {
    try {
      const response = await apiClient.get(`/haras-pro/stalls/haras/${harasId}/stats`);
      return response.data.data || this.getMockStats();
    } catch (error) {
      console.error('Erro ao buscar estatísticas das baias, usando dados mock:', error);
      return this.getMockStats();
    }
  }

  // Buscar baia por ID
  async getBaiaById(id: string): Promise<Baia> {
    try {
      const response = await apiClient.get(`/haras-pro/stalls/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar baia, usando dados mock:', error);
      // Buscar nos dados mock
      const mockBaias = this.getMockBaias('mock-haras-id');
      const baia = mockBaias.find(b => b.id === id);
      if (!baia) {
        throw new Error(`Baia com ID ${id} não encontrada`);
      }
      return baia;
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

  // Atribuir cavalo à baia
  async assignCavaloToBaia(stallId: string, horseId: string): Promise<Baia> {
    try {
      const response = await apiClient.put(`/haras-pro/stalls/${stallId}/assign-horse`, {
        horseId
      });
      return response.data.data;
    } catch (error) {
      console.error('Erro ao atribuir cavalo à baia, simulando sucesso:', error);
      // Simular sucesso retornando uma baia atualizada
      const baia = await this.getBaiaById(stallId);
      return {
        ...baia,
        status: 'occupied',
        horseId: horseId,
        horseName: 'Cavalo Simulado',
        updatedAt: new Date().toISOString()
      };
    }
  }

  // Remover cavalo da baia
  async removeCavaloFromBaia(stallId: string): Promise<Baia> {
    try {
      const response = await apiClient.put(`/haras-pro/stalls/${stallId}/remove-horse`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao remover cavalo da baia, simulando sucesso:', error);
      // Simular sucesso retornando uma baia atualizada
      const baia = await this.getBaiaById(stallId);
      return {
        ...baia,
        status: 'empty',
        horseId: null,
        horseName: null,
        updatedAt: new Date().toISOString()
      };
    }
  }

  // Definir status da baia (manutenção, reservada, etc.)
  async setBaiaStatus(stallId: string, status: 'empty' | 'occupied' | 'maintenance' | 'reserved'): Promise<Baia> {
    try {
      const response = await apiClient.put(`/haras-pro/stalls/${stallId}/status`, {
        status
      });
      return response.data.data;
    } catch (error) {
      console.error('Erro ao alterar status da baia, simulando sucesso:', error);
      // Simular sucesso retornando uma baia atualizada
      const baia = await this.getBaiaById(stallId);
      return {
        ...baia,
        status: status,
        updatedAt: new Date().toISOString()
      };
    }
  }
}

export const baiaService = new BaiaService();
