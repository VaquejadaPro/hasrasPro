import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Theme from '@/constants/Theme';
import useAnimations from '@/hooks/useAnimations';

interface QuickStatProps {
  icon: keyof typeof Feather.glyphMap;
  value: string | number;
  label: string;
  colors: [string, string];
  onPress?: () => void;
  delay?: number;
}

const QuickStat: React.FC<QuickStatProps> = ({
  icon,
  value,
  label,
  colors,
  onPress,
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

  const StatComponent = onPress ? TouchableOpacity : View;

  return (
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
      <StatComponent
        onPress={handlePress}
        activeOpacity={onPress ? 0.9 : 1}
        style={styles.touchable}
      >
        <LinearGradient
          colors={colors}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Feather name={icon} size={24} color="#ffffff" />
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.label}>{label}</Text>
        </LinearGradient>
      </StatComponent>
    </Animated.View>
  );
};

interface QuickStatsContainerProps {
  children: React.ReactNode;
}

export const QuickStatsContainer: React.FC<QuickStatsContainerProps> = ({ children }) => (
  <View style={styles.statsContainer}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    marginBottom: Theme.spacing.lg,
    marginHorizontal: -Theme.spacing.xs,
  },
  container: {
    flex: 1,
    marginHorizontal: Theme.spacing.xs,
  },
  touchable: {
    flex: 1,
  },
  gradient: {
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 90,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  value: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: '#ffffff',
    marginTop: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  label: {
    fontSize: Theme.typography.sizes.xs,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: Theme.typography.weights.medium as any,
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});

export default QuickStat;
