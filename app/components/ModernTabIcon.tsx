import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Theme from '../../constants/Theme';

interface ModernTabIconProps {
  name: React.ComponentProps<typeof Feather>["name"];
  color: string;
  focused: boolean;
  size?: number;
}

export const ModernTabIcon: React.FC<ModernTabIconProps> = ({ 
  name, 
  color, 
  focused, 
  size = 20 
}) => {
  if (focused) {
    return (
      <View style={styles.focusedContainer}>
        <LinearGradient
          colors={[Theme.colors.primary[500], Theme.colors.primary[600]]}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Feather 
            name={name} 
            size={18} 
            color="#FFFFFF"
            style={styles.icon}
          />
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.unfocusedContainer}>
      <Feather 
        name={name} 
        size={16} 
        color={color}
        style={styles.icon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  focusedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  unfocusedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientBackground: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Theme.colors.primary[600],
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  icon: {
    textAlign: 'center',
  },
});

export default ModernTabIcon;
