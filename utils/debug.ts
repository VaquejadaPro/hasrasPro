// Debug para testar a API
import { setDebugToken, checkCurrentToken } from './auth-debug';
import { testHarasAPI } from './test-api';

export const debugAuth = async () => {
  console.log('=== DEBUG AUTH ===');
  
  // 1. Verificar token atual
  console.log('1. Verificando token atual...');
  const current = await checkCurrentToken();
  
  if (!current.token) {
    console.log('2. Nenhum token encontrado, definindo token de debug...');
    await setDebugToken();
  } else {
    console.log('2. Token encontrado:', current.token.substring(0, 50) + '...');
  }
  
  // 3. Testar API
  console.log('3. Testando API...');
  await testHarasAPI();
};

// Tornar disponível globalmente para debug
if (typeof window !== 'undefined') {
  (window as any).debugAuth = debugAuth;
  (window as any).setDebugToken = setDebugToken;
  (window as any).testHarasAPI = testHarasAPI;
}

export default debugAuth;
