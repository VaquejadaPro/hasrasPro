import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { FeedStock } from '../../types/stock';
import Theme from '@/constants/Theme';

interface StockCardProps {
  stock: FeedStock;
  onPress?: () => void;
  onRestock?: () => void;
  onConsume?: () => void;
}

export const StockCard: React.FC<StockCardProps> = ({
  stock,
  onPress,
  onRestock,
  onConsume
}) => {
  // Debug log para verificar os dados recebidos
  console.log('🐛 StockCard - Dados da API:', { 
    id: stock.id, 
    feedTypeName: (stock as any).feedTypeName, // Campo correto da API
    feedTypeId: (stock as any).feedTypeId,
    currentQuantity: stock.currentQuantity,
    harasId: (stock as any).harasId,
    isActive: (stock as any).isActive
  });

  // Função para mapear os dados da API para os campos esperados
  const getMappedData = () => {
    const stockData = stock as any;
    return {
      id: stock.id,
      // Campos do FeedStock do backend
      name: stockData.feedTypeName || 'Nome não informado',
      brand: 'Ração', // Padrão, pois não vem específico da API
      feedType: 'other' as FeedStock['feedType'],
      description: `Ração do tipo ${stockData.feedTypeName || 'padrão'}`,
      
      // Quantidade e medidas
      currentQuantity: stockData.currentQuantity || 0,
      minimumStock: stockData.minimumStock || 10,
      unit: stockData.unitOfMeasure || 'kg',
      
      // Valores financeiros
      totalValue: stockData.totalValue || 0,
      averageUnitCost: stockData.averageUnitCost || 0,
      lastPurchasePrice: stockData.lastPurchasePrice || 0,
      
      // Datas
      lastPurchaseDate: stockData.lastPurchaseDate,
      expirationDate: stockData.expirationDate,
      createdAt: stockData.createdAt,
      updatedAt: stockData.updatedAt,
      
      // Localização e observações
      location: stockData.location || 'Não informado',
      observations: stockData.observations || '',
      
      // Campos específicos do backend
      feedTypeId: stockData.feedTypeId,
      feedTypeName: stockData.feedTypeName,
      harasId: stockData.harasId,
      isActive: stockData.isActive !== false, // Default true se não especificado
      
      // Campos calculados
      costPerUnit: stockData.averageUnitCost || 0,
      supplier: 'Não informado', // Não vem direto do estoque, apenas nos movimentos
      storageLocation: stockData.location || 'Não informado',
      maximumCapacity: 1000, // Valor padrão
      minimumThreshold: stockData.minimumStock || 10,
    };
  };

  const mappedData = getMappedData();
  
  // Log dos dados mapeados para debug
  console.log('✅ StockCard - Dados mapeados corretamente:', {
    name: mappedData.name, // Usando feedTypeName
    feedTypeName: mappedData.feedTypeName, // Campo original da API
    currentQuantity: mappedData.currentQuantity, // quantidade atual
    unit: mappedData.unit, // unidade de medida
    totalValue: mappedData.totalValue, // valor total em estoque
    averageUnitCost: mappedData.averageUnitCost, // custo médio por unidade
    minimumStock: mappedData.minimumStock, // estoque mínimo
    location: mappedData.location, // localização
    isActive: mappedData.isActive
  });

  const getStockStatus = () => {
    const maxCapacity = mappedData.maximumCapacity || 1;
    const percentage = ((mappedData.currentQuantity || 0) / maxCapacity) * 100;
    
    if (percentage <= 10) return { status: 'critical', color: Theme.colors.error[500] };
    if (percentage <= 25) return { status: 'low', color: Theme.colors.warning[500] };
    if (percentage <= 50) return { status: 'medium', color: Theme.colors.primary[500] };
    return { status: 'good', color: Theme.colors.success[500] };
  };

  const getFeedTypeIcon = (type: FeedStock['feedType']) => {
    switch (type) {
      case 'hay': return 'layers';
      case 'grain': return 'grid';
      case 'supplement': return 'plus-circle';
      case 'concentrate': return 'box';
      case 'pellets': return 'circle';
      default: return 'more-horizontal';
    }
  };

  const getFeedTypeLabel = (type: FeedStock['feedType']) => {
    switch (type) {
      case 'hay': return 'Feno';
      case 'grain': return 'Grãos';
      case 'supplement': return 'Suplementos';
      case 'concentrate': return 'Concentrado';
      case 'pellets': return 'Pellets';
      default: return 'Outros';
    }
  };

  const { color: statusColor } = getStockStatus();
  const isLowStock = (mappedData.currentQuantity || 0) <= (mappedData.minimumThreshold || 0);
  const maxCapacity = mappedData.maximumCapacity || 1;
  const stockPercentage = Math.min(((mappedData.currentQuantity || 0) / maxCapacity) * 100, 100);

  return (
    <TouchableOpacity 
      style={[styles.container, isLowStock && styles.lowStockBorder]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['#ffffff', '#f8fafc']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.iconContainer, { backgroundColor: statusColor + '20' }]}>
              <Feather 
                name={getFeedTypeIcon(mappedData.feedType)} 
                size={20} 
                color={statusColor} 
              />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.name} numberOfLines={1}>
                {mappedData.name}
              </Text>
              <Text style={styles.brand}>
                {mappedData.brand} • {getFeedTypeLabel(mappedData.feedType)}
              </Text>
            </View>
          </View>
          
          {isLowStock && (
            <View style={styles.alertBadge}>
              <Feather name="alert-triangle" size={14} color={Theme.colors.warning[600]} />
            </View>
          )}
        </View>

        {/* Stock Level Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${stockPercentage}%`, backgroundColor: statusColor }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {mappedData.currentQuantity || 0} {mappedData.unit} / {mappedData.maximumCapacity || 0} {mappedData.unit}
          </Text>
        </View>

        {/* Stock Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Feather name="package" size={14} color={Theme.colors.neutral[500]} />
            <Text style={styles.infoText}>
              {mappedData.currentQuantity || 0} {mappedData.unit}
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Feather name="archive" size={14} color={Theme.colors.neutral[500]} />
            <Text style={styles.infoText}>
              Estoque mínimo: {mappedData.minimumStock}
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Feather name="dollar-sign" size={14} color={Theme.colors.neutral[500]} />
            <Text style={styles.infoText}>
              R$ {((mappedData.currentQuantity || 0) * (mappedData.costPerUnit || 0)).toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Detailed Info */}
        <View style={styles.detailedInfoContainer}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Feather name="info" size={14} color={Theme.colors.neutral[500]} />
              <Text style={styles.infoText}>
                R$ {(mappedData.averageUnitCost || 0).toFixed(2)} por {mappedData.unit}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Feather name="dollar-sign" size={14} color={Theme.colors.neutral[500]} />
              <Text style={styles.infoText}>
                R$ {(mappedData.totalValue || 0).toFixed(2)} total
              </Text>
            </View>
          </View>
          
          {mappedData.location && (
            <View style={styles.infoItem}>
              <Feather name="map-pin" size={14} color={Theme.colors.neutral[500]} />
              <Text style={styles.infoText} numberOfLines={1}>
                Localização: {mappedData.location}
              </Text>
            </View>
          )}
          
          {mappedData.observations && (
            <View style={styles.infoItem}>
              <Feather name="file-text" size={14} color={Theme.colors.neutral[500]} />
              <Text style={styles.infoText} numberOfLines={2}>
                {mappedData.observations}
              </Text>
            </View>
          )}
        </View>

        {/* Additional Info from API */}
        <View style={styles.additionalInfoContainer}>
          <View style={styles.infoItem}>
            <Feather name="tag" size={14} color={Theme.colors.neutral[500]} />
            <Text style={styles.infoText}>
              Tipo: {mappedData.feedTypeName || 'Não especificado'}
            </Text>
          </View>
          
          {mappedData.feedTypeId && (
            <View style={styles.infoItem}>
              <Feather name="hash" size={14} color={Theme.colors.neutral[500]} />
              <Text style={styles.infoText}>
                Tipo ID: {mappedData.feedTypeId}
              </Text>
            </View>
          )}
          
          {mappedData.lastPurchaseDate && (
            <View style={styles.infoItem}>
              <Feather name="shopping-cart" size={14} color={Theme.colors.neutral[500]} />
              <Text style={styles.infoText}>
                Última compra: {new Date(mappedData.lastPurchaseDate.seconds * 1000).toLocaleDateString('pt-BR')}
              </Text>
            </View>
          )}
          
          {mappedData.lastPurchasePrice && (
            <View style={styles.infoItem}>
              <Feather name="dollar-sign" size={14} color={Theme.colors.neutral[500]} />
              <Text style={styles.infoText}>
                Último preço: R$ {mappedData.lastPurchasePrice.toFixed(2)}
              </Text>
            </View>
          )}
          
          {mappedData.expirationDate && (
            <View style={styles.infoItem}>
              <Feather name="calendar" size={14} color={Theme.colors.neutral[500]} />
              <Text style={styles.infoText}>
                Validade: {new Date(mappedData.expirationDate.seconds * 1000).toLocaleDateString('pt-BR')}
              </Text>
            </View>
          )}
          
          {mappedData.createdAt && (
            <View style={styles.infoItem}>
              <Feather name="plus-circle" size={14} color={Theme.colors.neutral[500]} />
              <Text style={styles.infoText}>
                Criado: {new Date(mappedData.createdAt.seconds * 1000).toLocaleDateString('pt-BR')}
              </Text>
            </View>
          )}
          
          <View style={styles.infoItem}>
            <Feather name={mappedData.isActive ? "check-circle" : "x-circle"} size={14} color={mappedData.isActive ? Theme.colors.success[500] : Theme.colors.error[500]} />
            <Text style={[styles.infoText, { color: mappedData.isActive ? Theme.colors.success[600] : Theme.colors.error[600] }]}>
              {mappedData.isActive ? 'Ativo' : 'Inativo'}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.consumeButton]}
            onPress={onConsume}
          >
            <Feather name="minus" size={16} color={Theme.colors.error[600]} />
            <Text style={styles.consumeButtonText}>Consumir</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.restockButton]}
            onPress={onRestock}
          >
            <Feather name="plus" size={16} color={Theme.colors.success[600]} />
            <Text style={styles.restockButtonText}>Repor</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lowStockBorder: {
    borderWidth: 2,
    borderColor: Theme.colors.warning[400],
  },
  gradient: {
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.sm,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: Theme.typography.sizes.base,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Theme.colors.neutral[900],
    marginBottom: 2,
  },
  brand: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
    fontWeight: Theme.typography.weights.medium as any,
  },
  alertBadge: {
    backgroundColor: Theme.colors.warning[100],
    borderRadius: 12,
    padding: 4,
  },
  progressContainer: {
    marginBottom: Theme.spacing.md,
  },
  progressTrack: {
    height: 8,
    backgroundColor: Theme.colors.neutral[200],
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: Theme.typography.sizes.xs,
    color: Theme.colors.neutral[600],
    textAlign: 'center',
    fontWeight: Theme.typography.weights.medium as any,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.md,
  },
  additionalInfoContainer: {
    backgroundColor: Theme.colors.neutral[50],
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
    gap: Theme.spacing.xs,
  },
  detailedInfoContainer: {
    backgroundColor: Theme.colors.primary[50],
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
    gap: Theme.spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.xs,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginBottom: 2,
  },
  infoText: {
    fontSize: Theme.typography.sizes.xs,
    color: Theme.colors.neutral[600],
    marginLeft: 4,
    fontWeight: Theme.typography.weights.medium as any,
  },
  actions: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
  },
  consumeButton: {
    backgroundColor: Theme.colors.error[50],
    borderColor: Theme.colors.error[200],
  },
  restockButton: {
    backgroundColor: Theme.colors.success[50],
    borderColor: Theme.colors.success[200],
  },
  consumeButtonText: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.medium as any,
    color: Theme.colors.error[600],
    marginLeft: 4,
  },
  restockButtonText: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.medium as any,
    color: Theme.colors.success[600],
    marginLeft: 4,
  },
});
