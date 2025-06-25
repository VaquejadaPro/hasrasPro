import AsyncStorage from '@react-native-async-storage/async-storage';

export const testTokenStorage = async () => {
  try {
    console.log('=== TESTE DO TOKEN STORAGE ===');
    
    // Definir um token válido
    const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJNcTBBRE5qTVpzdlpsVTIxWXl3TiIsImVtYWlsIjoiaGFyYXNwYWxtZXJ5QGdtYWlsLmNvbSIsInJvbGUiOiJoYXJhcyIsImlhdCI6MTc1MDc5MTY0NCwiZXhwIjoxNzUwNzk1MjQ0fQ.69kun0SYY38dNIZgat9jDmtuWCMRf0ZCH3153saoq7A';
    
    console.log('Salvando token no AsyncStorage...');
    await AsyncStorage.setItem('userToken', validToken);
    await AsyncStorage.setItem('authToken', validToken);
    
    console.log('Verificando se token foi salvo...');
    const userToken = await AsyncStorage.getItem('userToken');
    const authToken = await AsyncStorage.getItem('authToken');
    
    console.log('userToken:', userToken ? 'Presente' : 'Ausente');
    console.log('authToken:', authToken ? 'Presente' : 'Ausente');
    
    if (userToken === validToken && authToken === validToken) {
      console.log('✅ Token salvo corretamente!');
      return true;
    } else {
      console.log('❌ Erro ao salvar token');
      return false;
    }
  } catch (error) {
    console.error('❌ Erro no teste do token:', error);
    return false;
  }
};
