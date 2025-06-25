import React from 'react';
import { View, Text } from 'react-native';
import Theme from '../../../../constants/Theme';
import PremiumCard from '@/components/ui/premium-card';

interface ObservacoesCardProps {
  notes?: string;
  delay?: number;
}

const ObservacoesCard: React.FC<ObservacoesCardProps> = ({ notes, delay = 700 }) => {
  if (!notes) {
    return null;
  }

  return (
    <PremiumCard
      title="Observações"
      icon="file-text"
      iconColor={Theme.colors.neutral[600]}
      delay={delay}
    >
      <View style={styles.notesContainer}>
        <Text style={styles.notesText}>{notes}</Text>
      </View>
    </PremiumCard>
  );
};

const styles = {
  notesContainer: {
    backgroundColor: Theme.colors.neutral[50],
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
  },
  notesText: {
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.neutral[700],
    lineHeight: 24,
    fontStyle: 'italic' as const,
  },
};

export default ObservacoesCard;
