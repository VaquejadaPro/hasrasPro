import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { authService } from '../services/api';
import Theme from '../app/constants/Theme';

export const TokenDebugComponent = () => {
  const setToken = async () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJNcTBBRE5qTVpzdlpsVTIxWXl3TiIsImVtYWlsIjoiaGFyYXNwYWxtZXJ5QGdtYWlsLmNvbSIsInJvbGUiOiJoYXJhcyIsImlhdCI6MTc1MDYzMjMzOCwiZXhwIjoxNzUwNjM1OTM4fQ.kIA8dP6AdRsE5wwaTtUBQf8C06_3xpcnrWwRDWhpVmY";
    
    const user = {
      id: "Mq0ADNjMZsvZlU21YywN",
      email: "haraspalmery@gmail.com",
      role: "haras",
      photoUrl: null
    };

    try {
      await authService.storeAuthData(token, user);
      Alert.alert('Sucesso', 'Token definido com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao definir token');
    }
  };

  const checkToken = async () => {
    try {
      const { token, user } = await authService.loadStoredAuthData();
      Alert.alert('Token Atual', token ? `Token existe: ${token.substring(0, 50)}...` : 'Nenhum token encontrado');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao verificar token');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Debug Token</Text>
      <TouchableOpacity style={styles.button} onPress={setToken}>
        <Text style={styles.buttonText}>Definir Token</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={checkToken}>
        <Text style={styles.buttonText}>Verificar Token</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.warning[50],
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.warning[500],
  },
  title: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.warning[700],
    marginBottom: Theme.spacing.sm,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Theme.colors.warning[600],
    padding: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.sm,
    marginBottom: Theme.spacing.xs,
  },
  buttonText: {
    color: Theme.colors.primary[50],
    fontSize: Theme.typography.sizes.xs,
    textAlign: 'center',
    fontWeight: Theme.typography.weights.medium as any,
  },
});
