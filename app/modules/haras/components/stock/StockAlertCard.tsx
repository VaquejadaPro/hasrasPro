import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StockAlert } from '../../types/stock';
import Theme from '@/constants/Theme';

interface StockAlertCardProps {
  alert: StockAlert;
  onResolve?: () => void;
  onViewItem?: () => void;
}

export const StockAlertCard: React.FC<StockAlertCardProps> = ({
  alert,
  onResolve,
  onViewItem
}) => {
  const getAlertConfig = () => {
    switch (alert.type) {
      case 'low_stock':
        return {
          icon: 'alert-triangle',
          color: Theme.colors.warning[500],
          backgroundColor: Theme.colors.warning[50],
          borderColor: Theme.colors.warning[200],
          title: 'Estoque Baixo'
        };
      case 'expired':
        return {
          icon: 'x-circle',
          color: Theme.colors.error[500],
          backgroundColor: Theme.colors.error[50],
          borderColor: Theme.colors.error[200],
          title: 'Produto Vencido'
        };
      case 'near_expiry':
        return {
          icon: 'clock',
          color: Theme.colors.warning[500],
          backgroundColor: Theme.colors.warning[50],
          borderColor: Theme.colors.warning[200],
          title: 'Próximo ao Vencimento'
        };
      default:
        return {
          icon: 'info',
          color: Theme.colors.neutral[500],
          backgroundColor: Theme.colors.neutral[50],
          borderColor: Theme.colors.neutral[200],
          title: 'Alerta'
        };
    }
  };

  const getSeverityConfig = () => {
    switch (alert.severity) {
      case 'critical':
        return { label: 'Crítico', color: Theme.colors.error[600] };
      case 'high':
        return { label: 'Alto', color: Theme.colors.error[500] };
      case 'medium':
        return { label: 'Médio', color: Theme.colors.warning[500] };
      case 'low':
        return { label: 'Baixo', color: Theme.colors.primary[500] };
      default:
        return { label: 'Normal', color: Theme.colors.neutral[500] };
    }
  };

  const config = getAlertConfig();
  const severity = getSeverityConfig();

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: config.backgroundColor,
        borderColor: config.borderColor 
      }
    ]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconContainer, { backgroundColor: config.color + '20' }]}>
            <Feather name={config.icon as any} size={20} color={config.color} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.title}>{config.title}</Text>
            <View style={[styles.severityBadge, { backgroundColor: severity.color + '20' }]}>
              <Text style={[styles.severityText, { color: severity.color }]}>
                {severity.label}
              </Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.date}>
          {new Date(alert.createdAt).toLocaleDateString('pt-BR')}
        </Text>
      </View>

      <Text style={styles.message}>
        {alert.message}
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.viewButton]}
          onPress={onViewItem}
        >
          <Feather name="eye" size={16} color={Theme.colors.primary[600]} />
          <Text style={styles.viewButtonText}>Ver Item</Text>
        </TouchableOpacity>
        
        {!alert.isResolved && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.resolveButton]}
            onPress={onResolve}
          >
            <Feather name="check" size={16} color={Theme.colors.success[600]} />
            <Text style={styles.resolveButtonText}>Resolver</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    padding: Theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.sm,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Theme.colors.neutral[800],
    marginBottom: 4,
  },
  severityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: Theme.borderRadius.sm,
  },
  severityText: {
    fontSize: Theme.typography.sizes.xs,
    fontWeight: Theme.typography.weights.medium as any,
  },
  date: {
    fontSize: Theme.typography.sizes.xs,
    color: Theme.colors.neutral[500],
  },
  message: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[700],
    lineHeight: Theme.typography.lineHeights.relaxed * Theme.typography.sizes.sm,
    marginBottom: Theme.spacing.md,
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
    borderRadius: Theme.borderRadius.sm,
    borderWidth: 1,
  },
  viewButton: {
    backgroundColor: Theme.colors.primary[50],
    borderColor: Theme.colors.primary[200],
  },
  resolveButton: {
    backgroundColor: Theme.colors.success[50],
    borderColor: Theme.colors.success[200],
  },
  viewButtonText: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.medium as any,
    color: Theme.colors.primary[600],
    marginLeft: 4,
  },
  resolveButtonText: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.medium as any,
    color: Theme.colors.success[600],
    marginLeft: 4,
  },
});
