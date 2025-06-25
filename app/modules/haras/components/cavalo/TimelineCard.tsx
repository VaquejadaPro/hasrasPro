import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Theme from '../../../../constants/Theme';
import PremiumCard from '@/components/ui/premium-card';

interface TimelineCardProps {
  birthDate: string;
  acquisitionDate?: string;
  createdAt: string;
  delay?: number;
}

const TimelineCard: React.FC<TimelineCardProps> = ({ 
  birthDate, 
  acquisitionDate, 
  createdAt, 
  delay = 500 
}) => {
  const formatarData = (data: string): string => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const baseItems = [
    {
      icon: 'gift',
      title: 'Nascimento',
      date: formatarData(birthDate),
      color: Theme.colors.success[600],
    },
    {
      icon: 'edit',
      title: 'Cadastro',
      date: formatarData(createdAt),
      color: Theme.colors.warning[600],
    },
  ];

  const timelineItems = acquisitionDate 
    ? [
        baseItems[0],
        {
          icon: 'home',
          title: 'Aquisição',
          date: formatarData(acquisitionDate),
          color: Theme.colors.primary[600],
        },
        baseItems[1],
      ]
    : baseItems;

  return (
    <PremiumCard
      title="Timeline"
      icon="clock"
      iconColor={Theme.colors.success[600]}
      delay={delay}
    >
      <View style={styles.timelineContainer}>
        {timelineItems.map((item, index) => (
          <View key={index} style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: item.color }]}>
              <Feather name={item.icon as any} size={12} color="#ffffff" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>{item.title}</Text>
              <Text style={styles.timelineDate}>{item.date}</Text>
            </View>
          </View>
        ))}
      </View>
    </PremiumCard>
  );
};

const styles = {
  timelineContainer: {
    paddingLeft: Theme.spacing.sm,
  },
  timelineItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: Theme.spacing.lg,
    position: 'relative' as const,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: Theme.spacing.md,
    zIndex: 2,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: Theme.typography.sizes.base,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Theme.colors.neutral[800],
    marginBottom: 2,
  },
  timelineDate: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
  },
};

export default TimelineCard;
