import { embryoService } from '../app/modules/haras/services/embryoService';

export const testEmbryoAPI = async () => {
  try {
    console.log('=== TESTE DA API DE EMBRIÕES ===');
    
    const harasId = '4NDSBXQtOPeYWfROrVfm'; // ID do haras de teste
    console.log('Chamando getEmbryosByHaras() para harasId:', harasId);
    
    const embryos = await embryoService.getEmbryosByHaras(harasId);
    console.log('✅ Embriões carregados:', embryos.length);
    console.log('✅ Dados dos embriões:', embryos);
    
    return embryos;
  } catch (error: any) {
    console.error('❌ Erro ao buscar embriões:', error);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    
    return null;
  }
};
