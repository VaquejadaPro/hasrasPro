import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../../../hooks/useAuth';
import Theme from '../../../constants/Theme';

const LoginScreenModern = () => {
  const [email, setEmail] = useState('haraspalmery@gmail.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { signIn, loading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Por favor, preencha todos os campos');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      // Login bem-sucedido - o redirecionamento é feito automaticamente pelo AuthProvider
    } catch (error: any) {
      console.error('Erro no login:', error);
      setErrorMessage(error.message || 'Falha no login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.primary[800]} />
      
      <ImageBackground
        source={require('../../../../assets/images/apollo.jpg')}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <LinearGradient
          colors={Theme.colors.gradients.dark as any}
          style={styles.overlay}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
          >
            <View style={styles.content}>
              {/* Logo Section */}
              <View style={styles.logoSection}>
                <Image
                  source={require('../../../../assets/images/icon.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <Text style={styles.title}>Haras Pro</Text>
                <Text style={styles.subtitle}>
                  Sistema de Gestão Profissional
                </Text>
              </View>

              {/* Form Section */}
              <View style={styles.formSection}>
                <View style={styles.inputContainer}>
                  <Feather 
                    name="mail" 
                    size={20} 
                    color={Theme.colors.primary[400]} 
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={Theme.colors.primary[400]}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Feather 
                    name="lock" 
                    size={20} 
                    color={Theme.colors.primary[400]} 
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    placeholderTextColor={Theme.colors.primary[400]}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Feather
                      name={showPassword ? 'eye' : 'eye-off'}
                      size={20}
                      color={Theme.colors.primary[400]}
                    />
                  </TouchableOpacity>
                </View>

                {/* Error Message */}
                {errorMessage ? (
                  <View style={styles.errorContainer}>
                    <Feather name="alert-circle" size={16} color={Theme.colors.error[500]} />
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  </View>
                ) : null}

                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>
                    Esqueceu sua senha?
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={Theme.colors.gradients.primary as any}
                    style={styles.loginButtonGradient}
                  >
                    <Text style={styles.loginButtonText}>
                      {isLoading ? 'Entrando...' : 'Entrar'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Não tem uma conta?
                </Text>
                <TouchableOpacity>
                  <Text style={styles.footerLink}>
                    Entre em contato
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.primary[800],
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImageStyle: {
    opacity: 0.3,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.xl,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: Theme.spacing['2xl'],
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.typography.sizes['4xl'],
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.primary[50],
    textAlign: 'center',
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.normal as any,
    color: Theme.colors.primary[200],
    textAlign: 'center',
    lineHeight: Theme.typography.lineHeights.normal * Theme.typography.sizes.lg,
  },
  formSection: {
    width: '100%',
    marginBottom: Theme.spacing.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Theme.borderRadius.lg,
    marginBottom: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputIcon: {
    marginRight: Theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.primary[50],
    fontWeight: Theme.typography.weights.normal as any,
  },
  eyeIcon: {
    padding: Theme.spacing.xs,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: Theme.spacing.lg,
  },
  forgotPasswordText: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.primary[300],
    fontWeight: Theme.typography.weights.medium as any,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: Theme.colors.error[500],
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
    marginTop: Theme.spacing.sm,
  },
  errorText: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.error[500],
    marginLeft: Theme.spacing.xs,
    fontWeight: Theme.typography.weights.medium as any,
    flex: 1,
  },
  loginButton: {
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    ...Theme.shadows.md,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonGradient: {
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
  },
  loginButtonText: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Theme.colors.primary[50],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Theme.spacing.xl,
  },
  footerText: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.primary[300],
    marginRight: Theme.spacing.xs,
  },
  footerLink: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.primary[200],
    fontWeight: Theme.typography.weights.semibold as any,
  },
});

export default LoginScreenModern;
