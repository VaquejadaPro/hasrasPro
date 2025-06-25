import { apiClient as api } from '../../../../services/api';

export interface Embryo {
  id: string;
  harasId: string;
  code: string;
  fatherName: string;
  fatherRegistration: string;
  fatherId: string;
  motherName: string;
  motherRegistration: string;
  motherId: string;
  creationDate: string;
  freezingDate?: string;
  veterinarian: string;
  clinic: string;
  technique: string;
  notes?: string;
  status: 'frozen' | 'activated' | 'transferred' | 'failed';
  isActive: boolean;
  recipientId?: string;
  recipientName?: string;
  recipientRegistration?: string;
  activationDate?: string;
  expectedBirthDate?: string;
  daysPregnant?: number;
  daysRemaining?: number;
  pregnancyStatus?: 'confirmed' | 'pending' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface EmbryoActivation {
  recipientId: string;
  recipientName: string;
  recipientRegistration: string;
  activationDate: string;
  veterinarian: string;
  clinic: string;
  notes?: string;
}

export interface CreateEmbryoData {
  haras_id: string;
  code: string;
  fatherName: string;
  fatherRegistration: string;
  fatherId: string;
  motherName: string;
  motherRegistration: string;
  motherId: string;
  creationDate: string;
  veterinarian: string;
  clinic: string;
  technique: string;
  notes?: string;
}

class EmbryoService {
  private baseUrl = '/haras-pro';

  // Listar embriões do haras
  async getEmbryosByHaras(harasId: string): Promise<Embryo[]> {
    const response = await api.get(`${this.baseUrl}/embryos/haras/${harasId}`);
    console.log('✅ Dados carregados da API real:', response.data.data?.length || 0, 'embriões');
    return response.data.data || response.data.embryos || [];
  }

  // Buscar embrião por ID
  async getEmbryoById(embryoId: string): Promise<Embryo> {
    const response = await api.get(`${this.baseUrl}/embryos/${embryoId}`);
    return response.data.data || response.data;
  }

  // Criar novo embrião
  async createEmbryo(data: CreateEmbryoData): Promise<Embryo> {
    try {
      const response = await api.post(`${this.baseUrl}/embryos`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar embrião:', error);
      throw error;
    }
  }

  // Ativar embrião (transferir para receptora)
  async activateEmbryo(embryoId: string, data: EmbryoActivation): Promise<Embryo> {
    try {
      const response = await api.post(`${this.baseUrl}/embryos/${embryoId}/activate`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao ativar embrião:', error);
      throw error;
    }
  }

  // Calcular período de gestação
  calculateGestationInfo(activationDate: string, daysPregnant?: number) {
    const activation = new Date(activationDate);
    const today = new Date();
    const gestationPeriod = 340; // dias de gestação para cavalos
    
    const gestationDays = daysPregnant || Math.floor((today.getTime() - activation.getTime()) / (1000 * 60 * 60 * 24));
    const remainingDays = gestationPeriod - gestationDays;
    const expectedBirthDate = new Date(activation.getTime() + (gestationPeriod * 24 * 60 * 60 * 1000));
    
    return {
      gestationDays,
      remainingDays,
      expectedBirthDate,
      gestationPercent: Math.min((gestationDays / gestationPeriod) * 100, 100),
    };
  }

  // Obter status do embrião
  getEmbryoStatus(embryo: Embryo) {
    switch (embryo.status) {
      case 'frozen':
        return { label: 'Congelado', color: '#3B82F6' };
      case 'activated':
        return { label: 'Ativado', color: '#10B981' };
      case 'transferred':
        return { label: 'Transferido', color: '#F59E0B' };
      case 'failed':
        return { label: 'Falhou', color: '#EF4444' };
      default:
        return { label: 'Desconhecido', color: '#6B7280' };
    }
  }
}

export const embryoService = new EmbryoService();
