import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração base da API
const API_BASE_URL = 'http://localhost:3000/api';

// Instância do Axios configurada
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação automaticamente
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Buscar token dinamicamente do AsyncStorage
      const token = await AsyncStorage.getItem('authToken') || await AsyncStorage.getItem('userToken');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔐 Token encontrado e adicionado ao cabeçalho');
      } else {
        console.warn('⚠️ Nenhum token encontrado no storage');
      }
    } catch (error) {
      console.error('Erro ao buscar token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      console.warn('Token inválido ou expirado');
    }
    return Promise.reject(error);
  }
);

// Tipos para as respostas da API
export interface LoginResponse {
  status: string;
  data: {
    user: {
      id: string;
      email: string;
      role: string;
      photoUrl?: string;
    };
    token: string;
  };
  message: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: string[];
}

// Serviços de autenticação
export const authService = {
  // Login do usuário
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', {
        email,
        password,
      });
      
      // Salvar token e usuário no AsyncStorage
      if (response.data.status === 'success' && response.data.data.token) {
        await AsyncStorage.setItem('userToken', response.data.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || 'Email ou senha inválidos');
      }
      throw new Error('Erro de conexão com o servidor');
    }
  },

  // Logout do usuário
  logout: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  },

  // Verificar se está autenticado
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      return !!token;
    } catch (error) {
      return false;
    }
  },

  // Validar token
  validateToken: async (token: string): Promise<boolean> => {
    try {
      const response = await apiClient.get('/auth/validate', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.success || response.status === 200;
    } catch (error) {
      return false;
    }
  },

  // Esqueci minha senha
  forgotPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return {
          success: false,
          message: error.response.data?.message || 'Erro ao enviar email de recuperação'
        };
      }
      return {
        success: false,
        message: 'Erro de conexão com o servidor'
      };
    }
  },

  // Carregar dados salvos do storage
  loadStoredAuthData: async (): Promise<{ token: string | null; user: any | null }> => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userString = await AsyncStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      
      return { token, user };
    } catch (error) {
      console.error('Erro ao carregar dados do storage:', error);
      return { token: null, user: null };
    }
  },

  // Salvar dados de autenticação no storage
  storeAuthData: async (token: string, user: any): Promise<void> => {
    try {
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Erro ao salvar dados no storage:', error);
      throw error;
    }
  },
};

export default apiClient;
