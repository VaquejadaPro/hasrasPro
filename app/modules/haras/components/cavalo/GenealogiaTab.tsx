import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Theme from '../../../../constants/Theme';

interface GenealogiaTabProps {
  father?: {
    name: string;
    registration: string;
  };
  mother?: {
    name: string;
    registration: string;
  };
}

const GenealogiaTab: React.FC<GenealogiaTabProps> = ({ father, mother }) => {
  return (
    <View style={styles.tabContent}>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Árvore Genealógica</Text>
        
        {father && (
          <View style={styles.genealogiaItem}>
            <View style={styles.genealogiaHeader}>
              <Feather name="user" size={20} color={Theme.colors.primary[600]} />
              <Text style={styles.genealogiaTitle}>Pai</Text>
            </View>
            <Text style={styles.genealogiaName}>{father.name}</Text>
            <Text style={styles.genealogiaRegistration}>
              Registro: {father.registration}
            </Text>
          </View>
        )}

        {mother && (
          <View style={styles.genealogiaItem}>
            <View style={styles.genealogiaHeader}>
              <Feather name="user" size={20} color={Theme.colors.success[600]} />
              <Text style={styles.genealogiaTitle}>Mãe</Text>
            </View>
            <Text style={styles.genealogiaName}>{mother.name}</Text>
            <Text style={styles.genealogiaRegistration}>
              Registro: {mother.registration}
            </Text>
          </View>
        )}

        {!father && !mother && (
          <View style={styles.emptyState}>
            <Feather name="users" size={48} color={Theme.colors.neutral[400]} />
            <Text style={styles.emptyText}>Informações genealógicas não disponíveis</Text>
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
  genealogiaItem: {
    backgroundColor: Theme.colors.neutral[50],
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  genealogiaHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: Theme.spacing.sm,
  },
  genealogiaTitle: {
    fontSize: Theme.typography.sizes.base,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Theme.colors.neutral[700],
    marginLeft: Theme.spacing.sm,
  },
  genealogiaName: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.neutral[800],
    marginBottom: 4,
  },
  genealogiaRegistration: {
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

export default GenealogiaTab;
