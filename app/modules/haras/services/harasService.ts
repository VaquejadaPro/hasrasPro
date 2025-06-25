import { apiClient } from '../../../../services/api';

export interface Haras {
  id: string;
  name: string;
  ownerId: string;
  location?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

class HarasService {
  // Buscar todos os haras do usuário
  async getHarasByUser(): Promise<Haras[]> {
    try {
      const response = await apiClient.get('/haras-pro/haras');
      return response.data.data || [];
    } catch (error) {
      console.error('Erro ao buscar haras do usuário:', error);
      throw error;
    }
  }

  // Buscar um haras específico por ID
  async getHarasById(id: string): Promise<Haras> {
    try {
      const response = await apiClient.get(`/haras-pro/haras/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar haras:', error);
      throw error;
    }
  }

  // Buscar o primeiro haras disponível (haras padrão)
  async getDefaultHaras(): Promise<Haras | null> {
    try {
      const harasList = await this.getHarasByUser();
      return harasList.length > 0 ? harasList[0] : null;
    } catch (error) {
      console.error('Erro ao buscar haras padrão:', error);
      return null;
    }
  }
}

export const harasService = new HarasService();
