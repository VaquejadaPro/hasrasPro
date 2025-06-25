import { harasProService } from '../services/harasProService';

export const testHarasAPI = async () => {
  try {
    console.log('=== TESTE DA API DE HARAS ===');
    console.log('Chamando getMyHaras()...');
    
    const response = await harasProService.getMyHaras();
    console.log('✅ Resposta recebida:', response);
    
    if (response.success) {
      console.log('✅ Sucesso! Dados:', response.data);
      return response.data;
    } else {
      console.log('❌ Falha na resposta:', response);
      return null;
    }
  } catch (error: any) {
    console.error('❌ Erro na chamada da API:', error);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    
    return null;
  }
};
