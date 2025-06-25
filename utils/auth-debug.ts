import AsyncStorage from '@react-native-async-storage/async-storage';

// Utilitário para definir token manualmente para debug
export const setDebugToken = async () => {
  // Token válido obtido via login haraspalmery@gmail.com / 123456
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJNcTBBRE5qTVpzdlpsVTIxWXl3TiIsImVtYWlsIjoiaGFyYXNwYWxtZXJ5QGdtYWlsLmNvbSIsInJvbGUiOiJoYXJhcyIsImlhdCI6MTc1MDc4NjYxNywiZXhwIjoxNzUwNzkwMjE3fQ.plZAO9hPBEMcN2JhNbkNfHR_t4mU1TmQ_N1yLdWFef8";
  
  const user = {
    id: "Mq0ADNjMZsvZlU21YywN",
    email: "haraspalmery@gmail.com",
    role: "haras",
  };

  try {
    // Salvar nos dois formatos para compatibilidade
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('authToken', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    console.log('✅ Token de debug definido com sucesso!');
    console.log('Token:', token);
    
    // Recarregar a página para aplicar o token
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  } catch (error) {
    console.error('Erro ao definir token:', error);
  }
};

// Função para verificar o token atual
export const checkCurrentToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    const user = await AsyncStorage.getItem('user');
    console.log('Token atual:', token);
    console.log('Usuário atual:', user);
    return { token, user: user ? JSON.parse(user) : null };
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return { token: null, user: null };
  }
};

// Função para limpar dados de auth
export const clearAuthData = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
    console.log('Dados de autenticação limpos');
    
    // Recarregar a página
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
  }
};
