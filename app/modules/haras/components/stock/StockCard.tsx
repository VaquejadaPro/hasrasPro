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
  const getStockStatus = () => {
    const percentage = (stock.currentQuantity / stock.maximumCapacity) * 100;
    
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
  const isLowStock = stock.currentQuantity <= stock.minimumThreshold;
  const stockPercentage = Math.min((stock.currentQuantity / stock.maximumCapacity) * 100, 100);

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
                name={getFeedTypeIcon(stock.feedType)} 
                size={20} 
                color={statusColor} 
              />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.name} numberOfLines={1}>
                {stock.name}
              </Text>
              <Text style={styles.brand}>
                {stock.brand} • {getFeedTypeLabel(stock.feedType)}
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
            {stock.currentQuantity} / {stock.maximumCapacity} {stock.unit}
          </Text>
        </View>

        {/* Stock Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Feather name="package" size={14} color={Theme.colors.neutral[500]} />
            <Text style={styles.infoText}>
              {stock.currentQuantity} {stock.unit}
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Feather name="dollar-sign" size={14} color={Theme.colors.neutral[500]} />
            <Text style={styles.infoText}>
              R$ {(stock.currentQuantity * stock.costPerUnit).toFixed(2)}
            </Text>
          </View>
          
          {stock.storageLocation && (
            <View style={styles.infoItem}>
              <Feather name="map-pin" size={14} color={Theme.colors.neutral[500]} />
              <Text style={styles.infoText} numberOfLines={1}>
                {stock.storageLocation}
              </Text>
            </View>
          )}
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
            <Text style={styles.restockButtonText}>Reabastecer</Text>
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
    height: 6,
    backgroundColor: Theme.colors.neutral[200],
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: Theme.spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
    textAlign: 'center',
    fontWeight: Theme.typography.weights.medium as any,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
