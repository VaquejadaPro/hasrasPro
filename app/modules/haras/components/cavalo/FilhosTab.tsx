import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Theme from '../../../../constants/Theme';

interface FilhosTabProps {
  offspring?: Array<{
    name: string;
    registration: string;
    birthDate: string;
  }>;
}

const FilhosTab: React.FC<FilhosTabProps> = ({ offspring }) => {
  const formatarData = (data: string): string => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  return (
    <View style={styles.tabContent}>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>
          Descendentes ({offspring?.length || 0})
        </Text>
        
        {offspring && offspring.length > 0 ? (
          offspring.map((filho, index) => (
            <View key={index} style={styles.filhoItem}>
              <View style={styles.filhoHeader}>
                <Text style={styles.filhoName}>{filho.name}</Text>
                <Text style={styles.filhoRegistration}>{filho.registration}</Text>
              </View>
              <Text style={styles.filhoDate}>
                Nascimento: {formatarData(filho.birthDate)}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Feather name="heart" size={48} color={Theme.colors.neutral[400]} />
            <Text style={styles.emptyText}>Nenhum descendente registrado</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = {
  tabContent: {
    padding: Theme.spacing.lg,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.sm,
  },
  sectionTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.neutral[800],
    marginBottom: Theme.spacing.md,
  },
  filhoItem: {
    backgroundColor: Theme.colors.neutral[50],
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  filhoHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 4,
  },
  filhoName: {
    fontSize: Theme.typography.sizes.base,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Theme.colors.neutral[800],
    flex: 1,
  },
  filhoRegistration: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.primary[600],
    fontWeight: Theme.typography.weights.medium as any,
  },
  filhoDate: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
  },
  emptyState: {
    alignItems: 'center' as const,
    paddingVertical: Theme.spacing.xl,
  },
  emptyText: {
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.neutral[500],
    marginTop: Theme.spacing.md,
    textAlign: 'center' as const,
  },
};

export default FilhosTab;
