import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Theme from '../../../../constants/Theme';
import PremiumCard from '@/components/ui/premium-card';

interface ValoresFinanceirosCardProps {
  acquisitionValue?: number;
  currentValue?: number;
  delay?: number;
}

const ValoresFinanceirosCard: React.FC<ValoresFinanceirosCardProps> = ({ 
  acquisitionValue, 
  currentValue, 
  delay = 600 
}) => {
  if (!acquisitionValue && !currentValue) {
    return null;
  }

  const calculateAppreciation = (): { percentage: number; isPositive: boolean } => {
    if (!acquisitionValue || !currentValue) {
      return { percentage: 0, isPositive: true };
    }
    
    const percentage = ((currentValue - acquisitionValue) / acquisitionValue) * 100;
    return { 
      percentage: Math.abs(percentage), 
      isPositive: currentValue >= acquisitionValue 
    };
  };

  const appreciation = calculateAppreciation();

  return (
    <PremiumCard
      title="Valores"
      icon="dollar-sign"
      iconColor={Theme.colors.warning[600]}
      gradient
      delay={delay}
    >
      <View style={styles.financialGrid}>
        {acquisitionValue && (
          <View style={styles.financialCard}>
            <View style={styles.financialHeader}>
              <Feather name="shopping-cart" size={16} color={Theme.colors.primary[600]} />
              <Text style={styles.financialLabel}>Aquisição</Text>
            </View>
            <Text style={styles.financialValue}>
              R$ {acquisitionValue.toLocaleString('pt-BR')}
            </Text>
          </View>
        )}

        {currentValue && (
          <View style={styles.financialCard}>
            <View style={styles.financialHeader}>
              <Feather name="trending-up" size={16} color={Theme.colors.success[600]} />
              <Text style={styles.financialLabel}>Atual</Text>
            </View>
            <Text style={styles.financialValue}>
              R$ {currentValue.toLocaleString('pt-BR')}
            </Text>
          </View>
        )}
      </View>

      {/* Indicador de valorização */}
      {acquisitionValue && currentValue && (
        <View style={styles.appreciationContainer}>
          <View style={styles.appreciationIcon}>
            <Feather 
              name={appreciation.isPositive ? "trending-up" : "trending-down"} 
              size={16} 
              color={appreciation.isPositive ? Theme.colors.success[600] : Theme.colors.error[600]} 
            />
          </View>
          <Text style={[
            styles.appreciationText,
            { color: appreciation.isPositive ? Theme.colors.success[600] : Theme.colors.error[600] }
          ]}>
            {appreciation.isPositive ? '+' : '-'}
            {appreciation.percentage.toFixed(1)}%
          </Text>
        </View>
      )}
    </PremiumCard>
  );
};

const styles = {
  financialGrid: {
    flexDirection: 'row' as const,
    marginHorizontal: -Theme.spacing.xs,
    marginBottom: Theme.spacing.md,
  },
  financialCard: {
    flex: 1,
    backgroundColor: Theme.colors.neutral[50],
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    marginHorizontal: Theme.spacing.xs,
  },
  financialHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: Theme.spacing.sm,
  },
  financialLabel: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
    fontWeight: Theme.typography.weights.medium as any,
    marginLeft: Theme.spacing.xs,
  },
  financialValue: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.neutral[800],
  },
  appreciationContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: Theme.colors.neutral[50],
    padding: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.lg,
  },
  appreciationIcon: {
    marginRight: Theme.spacing.xs,
  },
  appreciationText: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.semibold as any,
  },
};

export default ValoresFinanceirosCard;
