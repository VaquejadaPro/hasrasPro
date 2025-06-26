const axios = require('axios');

async function testStockAPI() {
  try {
    const harasId = '4NDSBXQtOPeYWfROrVfm';
    const url = `https://haras-pro-backend.vercel.app/api/haras-pro/feed-stocks/haras/${harasId}`;
    
    console.log('🔄 Fazendo chamada para a API...');
    console.log('URL:', url);
    
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('\n✅ Resposta recebida!');
    console.log('Status:', response.status);
    console.log('Headers:', response.headers);
    
    console.log('\n📋 DADOS COMPLETOS DA RESPOSTA:');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.data && response.data.data && response.data.data.length > 0) {
      console.log('\n🎯 PRIMEIRO ITEM DETALHADO:');
      const firstItem = response.data.data[0];
      console.log('ID:', firstItem.id);
      console.log('Todos os campos disponíveis:');
      Object.keys(firstItem).forEach(key => {
        console.log(`  ${key}:`, firstItem[key]);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro na chamada da API:');
    console.error('Message:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testStockAPI();
