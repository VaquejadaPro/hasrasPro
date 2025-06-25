import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StockStats } from '../../types/stock';
import Theme from '@/constants/Theme';

interface StockStatsCardProps {
  stats: StockStats;
}

export const StockStatsCard: React.FC<StockStatsCardProps> = ({ stats }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const statsData = [
    {
      icon: 'box',
      label: 'Total de Itens',
      value: stats.totalItems.toString(),
      color: Theme.colors.primary[500],
      gradient: [Theme.colors.primary[500], Theme.colors.primary[600]]
    },
    {
      icon: 'dollar-sign',
      label: 'Valor Total',
      value: formatCurrency(stats.totalValue),
      color: Theme.colors.success[500],
      gradient: [Theme.colors.success[500], Theme.colors.success[600]]
    },
    {
      icon: 'alert-triangle',
      label: 'Estoque Baixo',
      value: stats.lowStockItems.toString(),
      color: Theme.colors.warning[500],
      gradient: [Theme.colors.warning[500], Theme.colors.warning[600]]
    },
    {
      icon: 'x-circle',
      label: 'Vencidos',
      value: stats.expiredItems.toString(),
      color: Theme.colors.error[500],
      gradient: [Theme.colors.error[500], Theme.colors.error[600]]
    }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumo do Estoque</Text>
      
      <View style={styles.statsGrid}>
        {statsData.map((stat, index) => (
          <LinearGradient
            key={index}
            colors={[stat.gradient[0], stat.gradient[1]] as const}
            style={styles.statCard}
          >
            <View style={styles.statIcon}>
              <Feather name={stat.icon as any} size={24} color="white" />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </LinearGradient>
        ))}
      </View>

      {/* Estatísticas por Categoria */}
      {Object.keys(stats.byCategory).length > 0 && (
        <View style={styles.categoriesContainer}>
          <Text style={styles.categoriesTitle}>Por Categoria</Text>
          <View style={styles.categoriesList}>
            {Object.entries(stats.byCategory).map(([category, data]) => (
              <View key={category} style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>
                    {getCategoryLabel(category)}
                  </Text>
                  <Text style={styles.categoryCount}>
                    {data.count} itens • {formatCurrency(data.value)}
                  </Text>
                </View>
                <Text style={styles.categoryQuantity}>
                  {data.quantity} unidades
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const getCategoryLabel = (category: string) => {
  const labels: { [key: string]: string } = {
    'hay': 'Feno',
    'grain': 'Grãos',
    'supplement': 'Suplementos',
    'concentrate': 'Concentrado',
    'pellets': 'Pellets',
    'other': 'Outros'
  };
  return labels[category] || category;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    margin: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.neutral[900],
    marginBottom: Theme.spacing.lg,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  statIcon: {
    marginBottom: Theme.spacing.xs,
  },
  statValue: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: 'white',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: Theme.typography.sizes.xs,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: Theme.typography.weights.medium as any,
  },
  categoriesContainer: {
    borderTopWidth: 1,
    borderTopColor: Theme.colors.neutral[200],
    paddingTop: Theme.spacing.lg,
  },
  categoriesTitle: {
    fontSize: Theme.typography.sizes.base,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Theme.colors.neutral[800],
    marginBottom: Theme.spacing.md,
  },
  categoriesList: {
    gap: Theme.spacing.sm,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    backgroundColor: Theme.colors.neutral[50],
    borderRadius: Theme.borderRadius.md,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.medium as any,
    color: Theme.colors.neutral[800],
    marginBottom: 2,
  },
  categoryCount: {
    fontSize: Theme.typography.sizes.xs,
    color: Theme.colors.neutral[600],
  },
  categoryQuantity: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Theme.colors.primary[600],
  },
});
