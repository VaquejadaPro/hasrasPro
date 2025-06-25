import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, LoginResponse } from '../services/api';

/**
 * Interface que define as propriedades do usuário
 */
export interface User {
  id: string;
  email: string;
  role: string;
  photoUrl?: string;
}

/**
 * Interface que define as propriedades disponíveis no contexto de autenticação
 */
interface AuthContextProps {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (updatedUser: Partial<User>) => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  setAuthData: (token: string, user: User) => Promise<void>;
  createAccount: (formData: {
    email: string;
    name: string;
    password: string;
    confirmPassword: string;
    phone: string;
  }) => Promise<{ success: boolean; message: string; user?: User }>;
}

// Criação do contexto de autenticação
const AuthContext = createContext<AuthContextProps | null>(null);

/**
 * Provider de autenticação que gerencia o estado de autenticação
 * e fornece métodos para interagir com o serviço de autenticação
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Carrega usuário do storage ao iniciar o app
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        // Carregar dados do AsyncStorage
        const { token: storedToken, user: storedUser } = await authService.loadStoredAuthData();
        
        if (storedToken && storedUser) {
          // Validar token com a API
          const isValidToken = await authService.validateToken(storedToken);
          
          if (isValidToken) {
            setToken(storedToken);
            setUser(storedUser);
          } else {
            // Token inválido, deslogar usuario automaticamente
            await authService.logout();
            setToken(null);
            setUser(null);
          }
        } else {
          // Sem dados armazenados, usuário não está logado
          setToken(null);
          setUser(null);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar estado de autenticação:', error);
        // Em caso de erro, deslogar usuário
        await authService.logout();
        setToken(null);
        setUser(null);
        setLoading(false);
      }
    };

    loadAuthState();
  }, []);

  /**
   * Realiza o login do usuário
   */
  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      
      // Chamar API real de login
      const response: LoginResponse = await authService.login(email, password);
      
      // Se chegou até aqui, o login foi bem-sucedido
      // O authService já salvou os dados no AsyncStorage
      if (response.status === 'success' && response.data) {
        const { user, token } = response.data;
        
        // Atualizar o estado local
        setUser(user);
        setToken(token);
      } else {
        throw new Error(response.message || 'Falha no login');
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      // Relançar o erro para ser tratado na tela de login
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Realiza o logout do usuário
   */
  const signOut = async (): Promise<void> => {
    try {
      // Chamar API de logout (que já limpa o AsyncStorage)
      await authService.logout();
      
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo com erro na API, limpar dados locais
      setUser(null);
      setToken(null);
    }
  };

  /**
   * Atualiza os dados do usuário
   */
  const updateUser = async (updatedUser: Partial<User>): Promise<void> => {
    if (user) {
      const newUser = { ...user, ...updatedUser };
      setUser(newUser);
      
      // Salvar no storage - implementar posteriormente
      // await AsyncStorage.setItem('user', JSON.stringify(newUser));
    }
  };

  /**
   * Envia email de recuperação de senha
   */
  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Chamar API de recuperação de senha
      const response = await authService.forgotPassword(email);
      return response;
    } catch (error) {
      console.error('Erro ao solicitar recuperação de senha:', error);
      return {
        success: false,
        message: 'Erro ao enviar email de recuperação'
      };
    }
  };

  /**
   * Cria uma nova conta
   */
  const createAccount = async (formData: {
    email: string;
    name: string;
    password: string;
    confirmPassword: string;
    phone: string;
  }): Promise<{ success: boolean; message: string; user?: User }> => {
    try {
      // Validações básicas
      if (formData.password !== formData.confirmPassword) {
        throw new Error('As senhas não coincidem');
      }

      // Simulação - implementar posteriormente com API real
      const newUser: User = {
        id: Date.now().toString(),
        email: formData.email,
        role: 'normal',
      };

      return {
        success: true,
        message: 'Conta criada com sucesso!',
        user: newUser
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao criar conta'
      };
    }
  };

  /**
   * Define os dados de autenticação (token e usuário)
   */
  const setAuthData = async (newToken: string, newUser: User): Promise<void> => {
    setToken(newToken);
    setUser(newUser);
    
    // Salvar no AsyncStorage
    await authService.storeAuthData(newToken, newUser);
  };

  const value: AuthContextProps = {
    user,
    token,
    loading,
    signIn,
    signOut,
    updateUser,
    forgotPassword,
    setAuthData,
    createAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook personalizado para usar o contexto de autenticação
 */
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};
