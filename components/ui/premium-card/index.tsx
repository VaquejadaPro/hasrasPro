import React, { useEffect, ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Theme from '@/constants/Theme';
import useAnimations from '@/hooks/useAnimations';

interface PremiumCardProps {
  title: string;
  icon?: keyof typeof Feather.glyphMap;
  iconColor?: string;
  children: ReactNode;
  onPress?: () => void;
  badge?: string;
  badgeColor?: string;
  gradient?: boolean;
  delay?: number;
}

const PremiumCard: React.FC<PremiumCardProps> = ({
  title,
  icon,
  iconColor = Theme.colors.primary[600],
  children,
  onPress,
  badge,
  badgeColor = Theme.colors.primary[600],
  gradient = false,
  delay = 0,
}) => {
  const { fadeAnim, scaleAnim, slideAnim, fadeIn, scaleIn, slideIn, pulseAnimation } = useAnimations();

  useEffect(() => {
    setTimeout(() => {
      fadeIn();
      scaleIn();
      slideIn();
    }, delay);
  }, [delay]);

  const handlePress = () => {
    if (onPress) {
      pulseAnimation();
      setTimeout(onPress, 100);
    }
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  const cardContent = (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: slideAnim },
          ],
        },
      ]}
    >
      <CardComponent
        style={[
          styles.card,
          gradient && styles.gradientCard,
        ]}
        onPress={handlePress}
        activeOpacity={onPress ? 0.95 : 1}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {icon && (
              <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
                <Feather name={icon} size={20} color={iconColor} />
              </View>
            )}
            <Text style={styles.title}>{title}</Text>
          </View>

          {badge && (
            <View style={[styles.badge, { backgroundColor: badgeColor + '20' }]}>
              <Text style={[styles.badgeText, { color: badgeColor }]}>
                {badge}
              </Text>
            </View>
          )}

          {onPress && (
            <Feather name="chevron-right" size={20} color={Theme.colors.neutral[400]} />
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {children}
        </View>
      </CardComponent>
    </Animated.View>
  );

  if (gradient) {
    return (
      <LinearGradient
        colors={['#ffffff', Theme.colors.neutral[50]]}
        style={styles.gradientContainer}
      >
        {cardContent}
      </LinearGradient>
    );
  }

  return cardContent;
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.spacing.lg,
  },
  gradientContainer: {
    borderRadius: Theme.borderRadius.xl,
    marginBottom: Theme.spacing.lg,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.lg,
    ...Theme.shadows.md,
  },
  gradientCard: {
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: Theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.sm,
  },
  title: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.neutral[800],
    flex: 1,
  },
  badge: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.borderRadius.full,
    marginRight: Theme.spacing.sm,
  },
  badgeText: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.semibold as any,
  },
  content: {
    flex: 1,
  },
});

export default PremiumCard;
