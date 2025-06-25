import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Theme from '../../../../constants/Theme';
import PremiumCard from '@/components/ui/premium-card';
import { Cavalo } from '../../services/cavaloService';

interface InformacoesTecnicasCardProps {
  cavalo: Cavalo;
  delay?: number;
}

const InformacoesTecnicasCard: React.FC<InformacoesTecnicasCardProps> = ({ 
  cavalo, 
  delay = 400 
}) => {
  const getGenderGradient = (gender: string): [string, string] => {
    switch (gender) {
      case 'male':
        return [Theme.colors.primary[500], Theme.colors.primary[600]];
      case 'female':
        return [Theme.colors.success[500], Theme.colors.success[600]];
      case 'gelding':
        return [Theme.colors.warning[500], Theme.colors.warning[600]];
      default:
        return [Theme.colors.neutral[500], Theme.colors.neutral[600]];
    }
  };

  const copyMicrochip = () => {
    // TODO: Implementar copy to clipboard
    Alert.alert('Copiado!', 'Microchip copiado para a área de transferência');
  };

  const baseItems = [
    {
      icon: 'bookmark',
      label: 'Raça',
      value: cavalo.breed || 'Não informado',
      color: Theme.colors.primary[600],
    },
    {
      icon: 'eye',
      label: 'Cor',
      value: cavalo.color || 'Não informado',
      color: Theme.colors.success[600],
    },
  ];

  const conditionalItems = [
    cavalo.weight && {
      icon: 'trending-up',
      label: 'Peso',
      value: `${cavalo.weight} kg`,
      color: Theme.colors.warning[600],
    },
    cavalo.height && {
      icon: 'bar-chart-2',
      label: 'Altura',
      value: `${cavalo.height} cm`,
      color: Theme.colors.error[600],
    },
  ].filter(Boolean) as Array<{
    icon: string;
    label: string;
    value: string;
    color: string;
  }>;

  const infoItems = [...baseItems, ...conditionalItems];

  return (
    <PremiumCard
      title="Informações Básicas"
      icon="info"
      iconColor={Theme.colors.primary[600]}
      badge={cavalo.gender === 'male' ? 'Macho' : cavalo.gender === 'female' ? 'Fêmea' : 'Castrado'}
      badgeColor={getGenderGradient(cavalo.gender)[0]}
      delay={delay}
    >
      <View style={styles.infoGrid}>
        {infoItems.map((item, index) => (
          <View key={index} style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Feather name={item.icon as any} size={16} color={item.color} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Microchip destacado */}
      {cavalo.microchip && (
        <TouchableOpacity 
          style={styles.microchipContainer}
          onPress={copyMicrochip}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={[Theme.colors.neutral[100], Theme.colors.neutral[200]]}
            style={styles.microchipGradient}
          >
            <View style={styles.microchipLeft}>
              <Feather name="cpu" size={20} color={Theme.colors.primary[600]} />
              <View style={styles.microchipTextContainer}>
                <Text style={styles.microchipLabel}>Microchip</Text>
                <Text style={styles.microchipValue}>{cavalo.microchip}</Text>
              </View>
            </View>
            <Feather name="copy" size={16} color={Theme.colors.neutral[500]} />
          </LinearGradient>
        </TouchableOpacity>
      )}
    </PremiumCard>
  );
};

const styles = {
  infoGrid: {
    marginBottom: Theme.spacing.md,
  },
  infoItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.neutral[100],
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.neutral[100],
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: Theme.spacing.md,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
    fontWeight: Theme.typography.weights.medium as any,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.neutral[800],
    fontWeight: Theme.typography.weights.semibold as any,
  },
  microchipContainer: {
    marginTop: Theme.spacing.md,
  },
  microchipGradient: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
  },
  microchipLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
  },
  microchipTextContainer: {
    marginLeft: Theme.spacing.sm,
    flex: 1,
  },
  microchipLabel: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
    fontWeight: Theme.typography.weights.medium as any,
    marginBottom: 2,
  },
  microchipValue: {
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.neutral[800],
    fontWeight: Theme.typography.weights.bold as any,
    fontFamily: 'monospace' as const,
  },
};

export default InformacoesTecnicasCard;
