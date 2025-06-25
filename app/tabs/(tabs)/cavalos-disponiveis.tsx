import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { CavalosDisponiveisScreen } from '../../modules/haras/screens';
import { useHaras } from '../../../hooks/useHaras';
import Theme from '../../constants/Theme';

export default function CavalosDisponiveis() {
  const { haras, loading, error } = useHaras();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Theme.colors.primary[600]} />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (error || !haras) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro ao carregar haras</Text>
      </View>
    );
  }

  return <CavalosDisponiveisScreen harasId={haras.id} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.neutral[50],
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Theme.colors.neutral[600],
  },
  errorText: {
    fontSize: 16,
    color: Theme.colors.error[600],
  },
});
