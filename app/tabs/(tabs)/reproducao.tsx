import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { HarasMainScreen } from '../../modules/haras/screens';
import { useAuth } from '../../../hooks/useAuth';
import { useHaras } from '../../../hooks/useHaras';
import Theme from '../../constants/Theme';

export default function Reproducao() {
  const { user, signIn, loading } = useAuth();
  const { haras, loading: harasLoading, error: harasError } = useHaras();
  const [initializing, setInitializing] = useState(true);
  const searchParams = useLocalSearchParams();
  
  const telaInicial = searchParams.tela as string;

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Se não está logado, fazer login automático para desenvolvimento
        if (!user && !loading) {
          console.log('🔧 DESENVOLVIMENTO: Fazendo login automático...');
          await signIn('haraspalmery@gmail.com', '123456');
        }
      } catch (error) {
        console.error('Erro no login automático:', error);
      } finally {
        setInitializing(false);
      }
    };

    if (!loading) {
      initializeAuth();
    }
  }, [user, loading, signIn]);

  // Mostrar loading durante inicialização ou carregamento do haras
  if (loading || initializing || harasLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text style={styles.loadingText}>
          {loading ? 'Verificando autenticação...' : harasLoading ? 'Carregando haras...' : 'Inicializando...'}
        </Text>
      </View>
    );
  }

  // Se ainda não está autenticado após tentativa de login
  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Erro de Autenticação</Text>
        <Text style={styles.errorText}>
          Não foi possível fazer login automaticamente.{'\n'}
          Verifique se o servidor está rodando em localhost:3000
        </Text>
      </View>
    );
  }

  // Se não conseguiu carregar haras
  if (harasError || !haras) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Erro ao carregar haras</Text>
        <Text style={styles.errorText}>
          {harasError || 'Nenhum haras encontrado para este usuário'}
        </Text>
      </View>
    );
  }

  return <HarasMainScreen harasId={haras.id} telaInicial={telaInicial} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ef4444',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
});
