/**
 * Teste para verificar se o token JWT está sendo gerado e verificado com a mesma chave
 * Este arquivo é apenas para debug - deve ser removido após correção
 */

import jwt from 'jsonwebtoken';

// Simular o mesmo token que está sendo enviado do frontend
const tokenFromFrontend = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4SmFzSTg1Q2syWW1ldDA5ZmVCdSIsImVtYWlsIjoidGVzdGVAbWFpbC5jb20iLCJyb2xlIjoibm9ybWFsIiwiaWF0IjoxNzM2OTY2NDQwLCJleHAiOjE3MzY5NzAwNDB9.EJIbfHOcxOgc5Gq7PKKWs8Tov8tFZR8B4cGGNe2xGpM';

console.log('=== JWT DEBUG TEST ===');

// Teste com diferentes valores de JWT_SECRET que podem estar sendo usados
const possibleSecrets = [
  'defaultSecret',
  'your-secret-key-here',
  'default_jwt_secret_for_development',
  process.env.JWT_SECRET,
  undefined
];

possibleSecrets.forEach((secret, index) => {
  console.log(`\n--- Teste ${index + 1}: ${secret || 'undefined'} ---`);
  
  try {
    const decoded = jwt.verify(tokenFromFrontend, secret || 'defaultSecret');
    console.log('✅ Token VÁLIDO com esta chave!');
    console.log('Payload decodificado:', decoded);
  } catch (error) {
    console.log('❌ Token inválido:', error.message);
  }
});

// Teste de geração de token com cada chave possível
console.log('\n=== TESTE DE GERAÇÃO ===');

const testPayload = {
  userId: '8JasI85Ck2Ymet09feBu',
  email: 'teste@mail.com',
  role: 'normal'
};

possibleSecrets.forEach((secret, index) => {
  console.log(`\n--- Gerando token ${index + 1} com: ${secret || 'undefined'} ---`);
  
  try {
    const newToken = jwt.sign(testPayload, secret || 'defaultSecret', { expiresIn: '1h' });
    console.log('Token gerado:', newToken);
    
    // Verificar se o token gerado é igual ao do frontend
    if (newToken === tokenFromFrontend) {
      console.log('🎯 BINGO! Esta é a chave correta usada no frontend!');
    }
  } catch (error) {
    console.log('❌ Erro ao gerar token:', error.message);
  }
});

export {};
