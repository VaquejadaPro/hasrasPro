import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import Theme from '../app/constants/Theme';

export default function Login() {
  const { login, setAuthData } = useAuth();
  const [email, setEmail] = useState('maite@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
    } catch (error: any) {
      Alert.alert('Erro no Login', error.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  // Função temporária para usar o token que você já tem
  const handleUseExistingToken = async () => {
    try {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJXbmNiUXF6SXNnbzJiSWtMNVdveSIsImVtYWlsIjoibWFpdGVAZ21haWwuY29tIiwicm9sZSI6Im5vcm1hbCIsImlhdCI6MTc1MDYzMTIxNSwiZXhwIjoxNzUwNjM0ODE1fQ.gWOMsLgQwW5o24QzFKxy7UVRHbh_XyMqWAZn6ANHSs8';
      const user = {
        id: 'WncbQqzIsgo2bIkL5Woy',
        email: 'maite@gmail.com',
        role: 'normal',
        photoUrl: 'https://storage.googleapis.com/valeuboi-c0816.firebasestorage.app/users/WncbQqzIsgo2bIkL5Woy/avatar_WncbQqzIsgo2bIkL5Woy_150x150.jpeg'
      };
      
      await setAuthData(token, user);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao configurar autenticação');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.title}>HarasPro</Text>
          <Text style={styles.subtitle}>Gestão de Haras e Baias</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Digite seu email"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Digite sua senha"
              secureTextEntry
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Theme.colors.primary[50]} />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <Text style={styles.dividerText}>OU</Text>
          </View>

          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={handleUseExistingToken}
            disabled={loading}
          >
            <Text style={styles.buttonSecondaryText}>Usar Token Existente</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Use "Usar Token Existente" para testar com o token que você já possui
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.primary[50],
  },
  content: {
    flex: 1,
    padding: Theme.spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Theme.spacing['2xl'],
  },
  title: {
    fontSize: Theme.typography.sizes['3xl'],
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.primary[700],
    marginBottom: Theme.spacing.sm,
  },
  subtitle: {
    fontSize: Theme.typography.sizes.lg,
    color: Theme.colors.neutral[600],
    textAlign: 'center',
  },
  form: {
    marginBottom: Theme.spacing['2xl'],
  },
  inputGroup: {
    marginBottom: Theme.spacing.lg,
  },
  label: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.medium as any,
    color: Theme.colors.primary[700],
    marginBottom: Theme.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: Theme.colors.neutral[300],
    borderRadius: Theme.borderRadius.sm,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.primary[700],
    backgroundColor: Theme.colors.primary[50],
  },
  button: {
    backgroundColor: Theme.colors.primary[600],
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.sm,
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Theme.colors.primary[50],
    fontSize: Theme.typography.sizes.base,
    fontWeight: Theme.typography.weights.semibold as any,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Theme.colors.primary[600],
  },
  buttonSecondaryText: {
    color: Theme.colors.primary[600],
    fontSize: Theme.typography.sizes.base,
    fontWeight: Theme.typography.weights.medium as any,
  },
  divider: {
    alignItems: 'center',
    marginVertical: Theme.spacing.lg,
  },
  dividerText: {
    color: Theme.colors.neutral[500],
    fontSize: Theme.typography.sizes.sm,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[500],
    textAlign: 'center',
    lineHeight: Theme.typography.lineHeights.relaxed * Theme.typography.sizes.sm,
  },
});
