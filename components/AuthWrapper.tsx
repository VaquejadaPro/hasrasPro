import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import LoginScreenModern from '../app/modules/login/screens/LoginScreenModern';
import Theme from '../app/constants/Theme';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, token, loading } = useAuth();

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary[600]} />
      </View>
    );
  }

  // Se não tem usuário ou token, mostra tela de login
  if (!user || !token) {
    return <LoginScreenModern />;
  }

  // Se autenticado, mostra as telas normais
  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary[50],
  },
});
