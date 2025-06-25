import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Theme from '../../../../constants/Theme';

interface ConquistasTabProps {
  achievements?: string[];
}

const ConquistasTab: React.FC<ConquistasTabProps> = ({ achievements }) => {
  return (
    <View style={styles.tabContent}>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>
          Conquistas ({achievements?.length || 0})
        </Text>
        
        {achievements && achievements.length > 0 ? (
          achievements.map((conquista, index) => (
            <View key={index} style={styles.conquistaItem}>
              <View style={styles.conquistaIcon}>
                <Feather name="award" size={20} color={Theme.colors.warning[600]} />
              </View>
              <Text style={styles.conquistaText}>{conquista}</Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Feather name="award" size={48} color={Theme.colors.neutral[400]} />
            <Text style={styles.emptyText}>Nenhuma conquista registrada</Text>
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
  conquistaItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: Theme.colors.neutral[50],
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  conquistaIcon: {
    marginRight: Theme.spacing.md,
  },
  conquistaText: {
    flex: 1,
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.neutral[800],
    fontWeight: Theme.typography.weights.medium as any,
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

export default ConquistasTab;
