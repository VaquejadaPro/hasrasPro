import { apiClient } from '../../../../services/api';
import { 
  FeedStock, 
  StockMovement, 
  StockAlert, 
  StockStats, 
  CreateStockDTO, 
  UpdateStockDTO, 
  StockMovementDTO 
} from '../types/stock';

export interface ApiResponse<T> {
  status: string;
  message?: string;
  data: T;
}

class StockService {
  // NOTA: Por enquanto usando apenas dados mock até o backend implementar as APIs de estoque
  
  // Listar estoque do haras
  async getStockByHaras(harasId: string): Promise<FeedStock[]> {
    console.log('🔧 Usando dados de exemplo para estoque (APIs não implementadas no backend)');
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.getMockStockData(harasId);
  }

  // Obter estatísticas do estoque
  async getStockStats(harasId: string): Promise<StockStats> {
    console.log('🔧 Usando dados de exemplo para estatísticas (APIs não implementadas no backend)');
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 200));
    const mockStock = this.getMockStockData(harasId);
    return this.calculateStatsFromStock(mockStock);
  }

  // Obter alertas de estoque
  async getStockAlerts(harasId: string): Promise<StockAlert[]> {
    console.log('🔧 Usando dados de exemplo para alertas (APIs não implementadas no backend)');
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 150));
    const mockStock = this.getMockStockData(harasId);
    return this.generateMockAlerts(mockStock);
  }

  // Buscar item do estoque por ID
  async getStockById(id: string): Promise<FeedStock> {
    console.log('🔧 Usando dados de exemplo para item específico');
    const allMockStock = this.getMockStockData('any');
    const stock = allMockStock.find(s => s.id === id);
    if (!stock) {
      throw new Error('Item não encontrado');
    }
    return stock;
  }

  // Reabastecer estoque
  async restockItem(stockId: string, quantity: number, notes?: string): Promise<FeedStock> {
    console.log(`🔧 Simulando reabastecimento: +${quantity} para item ${stockId}`);
    // Simular operação
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const stock = await this.getStockById(stockId);
    return {
      ...stock,
      currentQuantity: stock.currentQuantity + quantity,
      lastRestockDate: new Date().toISOString()
    };
  }

  // Consumir do estoque
  async consumeStock(stockId: string, quantity: number, reason: string, notes?: string): Promise<FeedStock> {
    console.log(`🔧 Simulando consumo: -${quantity} para item ${stockId}`);
    // Simular operação
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const stock = await this.getStockById(stockId);
    const newQuantity = Math.max(0, stock.currentQuantity - quantity);
    
    return {
      ...stock,
      currentQuantity: newQuantity
    };
  }

  // Marcar alerta como resolvido
  async resolveAlert(alertId: string): Promise<void> {
    console.log(`🔧 Simulando resolução de alerta: ${alertId}`);
    // Simular operação
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  // As outras funções que usariam APIs reais ficam como placeholder
  async createStock(stockData: CreateStockDTO): Promise<FeedStock> {
    throw new Error('Funcionalidade não implementada - backend necessário');
  }

  async updateStock(id: string, stockData: Partial<UpdateStockDTO>): Promise<FeedStock> {
    throw new Error('Funcionalidade não implementada - backend necessário');
  }

  async deleteStock(id: string): Promise<void> {
    throw new Error('Funcionalidade não implementada - backend necessário');
  }

  async recordStockMovement(movementData: StockMovementDTO): Promise<StockMovement> {
    throw new Error('Funcionalidade não implementada - backend necessário');
  }

  async getStockMovements(stockId: string): Promise<StockMovement[]> {
    throw new Error('Funcionalidade não implementada - backend necessário');
  }

  // === DADOS MOCK (temporários) ===
  
  private getMockStockData(harasId: string): FeedStock[] {
    return [
      {
        id: 'stock-1',
        harasId: harasId,
        feedType: 'hay',
        brand: 'Fazenda Verde',
        name: 'Feno Premium',
        description: 'Feno de alfafa de alta qualidade',
        currentQuantity: 150,
        minimumThreshold: 100,
        maximumCapacity: 500,
        unit: 'kg',
        costPerUnit: 12.50,
        supplier: 'Fazenda Verde Ltda',
        lastRestockDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        expirationDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        storageLocation: 'Galpão A - Setor 1',
        notes: 'Produto de alta qualidade',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'stock-2',
        harasId: harasId,
        feedType: 'grain',
        brand: 'Nutri Equinos',
        name: 'Ração Concentrada',
        description: 'Ração balanceada para cavalos adultos',
        currentQuantity: 300,
        minimumThreshold: 150,
        maximumCapacity: 800,
        unit: 'kg',
        costPerUnit: 8.75,
        supplier: 'Nutri Equinos S.A.',
        lastRestockDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        expirationDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
        storageLocation: 'Galpão B - Setor 2',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'stock-3',
        harasId: harasId,
        feedType: 'supplement',
        brand: 'VitaHorse',
        name: 'Complexo Vitamínico',
        description: 'Vitaminas A, D, E + minerais essenciais',
        currentQuantity: 45,
        minimumThreshold: 50,
        maximumCapacity: 100,
        unit: 'kg',
        costPerUnit: 125.00,
        supplier: 'VitaHorse Brasil',
        lastRestockDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        storageLocation: 'Galpão A - Setor 3',
        notes: 'Manter em local seco',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'stock-4',
        harasId: harasId,
        feedType: 'supplement',
        brand: 'VitaHorse',
        name: 'Vitamina E + Selênio',
        description: 'Suplemento antioxidante para reprodução',
        currentQuantity: 25,
        minimumThreshold: 20,
        maximumCapacity: 50,
        unit: 'kg',
        costPerUnit: 180.00,
        supplier: 'VitaHorse Brasil',
        lastRestockDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        expirationDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        storageLocation: 'Galpão A - Setor 3',
        notes: 'Vence em breve - usar primeiro',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'stock-5',
        harasId: harasId,
        feedType: 'hay',
        brand: 'Campo Dourado',
        name: 'Feno de Coastcross',
        description: 'Feno de capim coastcross',
        currentQuantity: 80,
        minimumThreshold: 100,
        maximumCapacity: 300,
        unit: 'kg',
        costPerUnit: 9.80,
        supplier: 'Campo Dourado Agro',
        lastRestockDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        expirationDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        storageLocation: 'Galpão A - Setor 2',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  private calculateStatsFromStock(stocks: FeedStock[]): StockStats {
    let totalValue = 0;
    let lowStockItems = 0;
    let expiredItems = 0;
    let nearExpiryItems = 0;
    const byCategory: { [key: string]: { count: number; value: number; quantity: number } } = {};
    
    const now = new Date();
    const nearExpiryThreshold = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 dias
    
    stocks.forEach(stock => {
      const stockValue = stock.currentQuantity * stock.costPerUnit;
      totalValue += stockValue;
      
      if (stock.currentQuantity <= stock.minimumThreshold) {
        lowStockItems++;
      }
      
      if (stock.expirationDate) {
        const expirationDate = new Date(stock.expirationDate);
        if (expirationDate < now) {
          expiredItems++;
        } else if (expirationDate < nearExpiryThreshold) {
          nearExpiryItems++;
        }
      }
      
      if (!byCategory[stock.feedType]) {
        byCategory[stock.feedType] = { count: 0, value: 0, quantity: 0 };
      }
      byCategory[stock.feedType].count++;
      byCategory[stock.feedType].value += stockValue;
      byCategory[stock.feedType].quantity += stock.currentQuantity;
    });

    return {
      totalItems: stocks.length,
      totalValue,
      lowStockItems,
      expiredItems,
      nearExpiryItems,
      byCategory
    };
  }

  private generateMockAlerts(stocks: FeedStock[]): StockAlert[] {
    const alerts: StockAlert[] = [];
    const now = new Date();
    const nearExpiryThreshold = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    stocks.forEach(stock => {
      // Alerta de estoque baixo
      if (stock.currentQuantity <= stock.minimumThreshold) {
        alerts.push({
          id: `alert-low-${stock.id}`,
          stockId: stock.id,
          type: 'low_stock',
          severity: stock.currentQuantity <= stock.minimumThreshold * 0.5 ? 'high' : 'medium',
          message: `${stock.name} está com estoque baixo (${stock.currentQuantity}${stock.unit} restantes)`,
          isResolved: false,
          createdAt: new Date().toISOString()
        });
      }
      
      // Alerta de vencimento próximo
      if (stock.expirationDate) {
        const expirationDate = new Date(stock.expirationDate);
        if (expirationDate < nearExpiryThreshold && expirationDate > now) {
          const daysToExpiry = Math.ceil((expirationDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
          alerts.push({
            id: `alert-expiry-${stock.id}`,
            stockId: stock.id,
            type: 'near_expiry',
            severity: daysToExpiry <= 7 ? 'high' : 'medium',
            message: `${stock.name} vence em ${daysToExpiry} dias`,
            isResolved: false,
            createdAt: new Date().toISOString()
          });
        }
      }
    });
    
    return alerts;
  }

  // Obter tipos de ração disponíveis
  getFeedTypes(): Array<{ value: FeedStock['feedType']; label: string; icon: string }> {
    return [
      { value: 'hay', label: 'Feno', icon: 'layers' },
      { value: 'grain', label: 'Grãos', icon: 'grid' },
      { value: 'supplement', label: 'Suplementos', icon: 'plus-circle' },
      { value: 'concentrate', label: 'Concentrado', icon: 'box' },
      { value: 'pellets', label: 'Pellets', icon: 'circle' },
      { value: 'other', label: 'Outros', icon: 'more-horizontal' }
    ];
  }

  // Obter unidades disponíveis
  getUnits(): Array<{ value: FeedStock['unit']; label: string }> {
    return [
      { value: 'kg', label: 'Quilograma (kg)' },
      { value: 'tons', label: 'Toneladas (t)' },
      { value: 'bags', label: 'Sacos' },
      { value: 'liters', label: 'Litros (L)' }
    ];
  }
}

export const stockService = new StockService();
