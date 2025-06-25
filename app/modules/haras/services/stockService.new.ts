import { apiClient } from '../../../../services/api';
import { ApiResponse } from '../../../../services/harasProService';
import { 
  FeedStock, 
  StockAlert, 
  StockMovement, 
  CreateStockDTO, 
  UpdateStockDTO, 
  StockMovementDTO 
} from '../types/stock';

class StockService {
  // Listar estoques por haras
  async listarEstoque(harasId: string): Promise<FeedStock[]> {
    try {
      const response = await apiClient.get<ApiResponse<FeedStock[]>>(`/haras-pro/feed-stocks/haras/${harasId}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error('Erro ao carregar estoque');
    } catch (error) {
      console.error('Erro ao listar estoque:', error);
      throw error;
    }
  }

  // Obter estoque por ID
  async obterEstoquePorId(harasId: string, stockId: string): Promise<FeedStock> {
    try {
      const response = await apiClient.get<ApiResponse<FeedStock>>(`/haras-pro/feed-stocks/haras/${harasId}/${stockId}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error('Estoque não encontrado');
    } catch (error) {
      console.error('Erro ao obter estoque:', error);
      throw error;
    }
  }

  // Criar novo estoque
  async criarEstoque(harasId: string, data: CreateStockDTO): Promise<FeedStock> {
    try {
      const response = await apiClient.post<ApiResponse<{ stockId: string }>>(`/haras-pro/feed-stocks/haras/${harasId}`, data);
      if (response.data.success && response.data.data?.stockId) {
        // Buscar o estoque criado
        return await this.obterEstoquePorId(harasId, response.data.data.stockId);
      }
      throw new Error('Erro ao criar estoque');
    } catch (error) {
      console.error('Erro ao criar estoque:', error);
      throw error;
    }
  }

  // Atualizar estoque
  async atualizarEstoque(harasId: string, stockId: string, data: UpdateStockDTO): Promise<FeedStock> {
    try {
      const response = await apiClient.put<ApiResponse<void>>(`/haras-pro/feed-stocks/haras/${harasId}/${stockId}`, data);
      if (response.data.success) {
        // Buscar o estoque atualizado
        return await this.obterEstoquePorId(harasId, stockId);
      }
      throw new Error('Erro ao atualizar estoque');
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      throw error;
    }
  }

  // Criar movimento de estoque (entrada/saída)
  async criarMovimentacao(harasId: string, data: StockMovementDTO): Promise<StockMovement> {
    try {
      const response = await apiClient.post<ApiResponse<{ movementId: string }>>(`/haras-pro/feed-stocks/haras/${harasId}/movements`, data);
      if (response.data.success && response.data.data?.movementId) {
        // Retornar movimento criado (simulado pois o backend não retorna o objeto completo)
        return {
          id: response.data.data.movementId,
          stockId: data.stockId,
          type: data.type,
          quantity: data.quantity,
          reason: data.reason,
          notes: data.notes,
          createdAt: new Date().toISOString(),
          createdBy: 'current-user' // Será preenchido pelo backend
        };
      }
      throw new Error('Erro ao criar movimentação');
    } catch (error) {
      console.error('Erro ao criar movimentação:', error);
      throw error;
    }
  }

  // Listar movimentações de estoque
  async listarMovimentacoes(harasId: string): Promise<StockMovement[]> {
    try {
      const response = await apiClient.get<ApiResponse<StockMovement[]>>(`/haras-pro/feed-stocks/haras/${harasId}/movements`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Erro ao listar movimentações:', error);
      return [];
    }
  }

  // Obter alertas de estoque baixo
  async obterAlertas(harasId: string): Promise<StockAlert[]> {
    try {
      const response = await apiClient.get<ApiResponse<StockAlert[]>>(`/haras-pro/feed-stocks/haras/${harasId}/alerts/low-stock`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Erro ao obter alertas:', error);
      return [];
    }
  }

  // Registrar consumo de ração por cavalo
  async registrarConsumo(harasId: string, stockId: string, horseId: string, data: { quantity: number; notes?: string }): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<void>>(`/haras-pro/feed-stocks/haras/${harasId}/${stockId}/horses/${horseId}/consumption`, data);
      if (!response.data.success) {
        throw new Error('Erro ao registrar consumo');
      }
    } catch (error) {
      console.error('Erro ao registrar consumo:', error);
      throw error;
    }
  }

  // Processar consumo automático diário
  async processarConsumoAutomatico(harasId: string): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<void>>(`/haras-pro/feed-consumption/process-automatic/${harasId}`);
      if (!response.data.success) {
        throw new Error('Erro ao processar consumo automático');
      }
    } catch (error) {
      console.error('Erro ao processar consumo automático:', error);
      throw error;
    }
  }

  // Obter resumo diário de consumo
  async obterResumoConsumo(harasId: string): Promise<any> {
    try {
      const response = await apiClient.get<ApiResponse<any>>(`/haras-pro/feed-consumption/daily-summary/${harasId}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Erro ao obter resumo de consumo:', error);
      return null;
    }
  }

  // Obter consumo mensal por cavalo
  async obterConsumoMensal(harasId: string): Promise<any> {
    try {
      const response = await apiClient.get<ApiResponse<any>>(`/haras-pro/feed-consumption/monthly-by-horse/${harasId}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Erro ao obter consumo mensal:', error);
      return null;
    }
  }

  // Obter alertas ativos de consumo
  async obterAlertasConsumo(harasId: string): Promise<any[]> {
    try {
      const response = await apiClient.get<ApiResponse<any[]>>(`/haras-pro/feed-consumption/alerts/${harasId}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Erro ao obter alertas de consumo:', error);
      return [];
    }
  }

  // Confirmar/reconhecer alerta
  async confirmarAlerta(alertId: string): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<void>>(`/haras-pro/feed-consumption/alerts/${alertId}/acknowledge`);
      if (!response.data.success) {
        throw new Error('Erro ao confirmar alerta');
      }
    } catch (error) {
      console.error('Erro ao confirmar alerta:', error);
      throw error;
    }
  }

  // Métodos de compatibilidade com os nomes anteriores
  async getStockByHaras(harasId: string): Promise<FeedStock[]> {
    return this.listarEstoque(harasId);
  }

  async getStockAlerts(harasId: string): Promise<StockAlert[]> {
    return this.obterAlertas(harasId);
  }
}

export const stockService = new StockService();
