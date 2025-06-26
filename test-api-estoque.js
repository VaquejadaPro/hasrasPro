const axios = require('axios');

// Configuração da API
const API_BASE_URL = 'http://localhost:3000/api';
const HARAS_ID = '4NDSBXQtOPeYWfROrVfm';

// Credenciais de teste (ajuste conforme necessário)
const CREDENTIALS = {
  email: 'haraspalmery@gmail.com',
  password: '123456'
};

let TOKEN_VALIDO = null;

// Função para fazer login e obter token
async function fazerLogin() {
  try {
    console.log('🔐 Fazendo login para obter token...');
    
    const response = await axios.post(`${API_BASE_URL}/auth/login`, CREDENTIALS, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('✅ Login realizado com sucesso!');
    console.log('Resposta do login:', JSON.stringify(response.data, null, 2));
    
    if (response.data && response.data.data && response.data.data.token) {
      TOKEN_VALIDO = response.data.data.token;
      console.log('🎫 Token obtido:', TOKEN_VALIDO.substring(0, 50) + '...');
      return TOKEN_VALIDO;
    }
    
    throw new Error('Token não encontrado na resposta do login');
    
  } catch (error) {
    console.error('❌ Erro no login:');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Message:', error.message);
    }
    
    return null;
  }
}

// Função para testar a API de estoque
async function testarAPIEstoque(token) {
  try {
    console.log('\n🔍 Testando API de estoque...');
    console.log('URL:', `${API_BASE_URL}/haras-pro/feed-stocks/haras/${HARAS_ID}`);
    
    const response = await axios.get(`${API_BASE_URL}/haras-pro/feed-stocks/haras/${HARAS_ID}`, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('\n📊 STATUS DA RESPOSTA:', response.status);
    console.log('\n📦 DADOS COMPLETOS DA RESPOSTA:');
    console.log(JSON.stringify(response.data, null, 2));
    
    // Analisar a estrutura dos dados
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      console.log('\n📋 ANÁLISE DOS DADOS:');
      console.log('✅ Success:', response.data.success);
      console.log('📊 Total de itens:', response.data.data.length);
      
      if (response.data.data.length > 0) {
        const primeiroItem = response.data.data[0];
        console.log('\n🔍 PRIMEIRO ITEM COMPLETO:');
        console.log(JSON.stringify(primeiroItem, null, 2));
        
        console.log('\n🔑 TODAS AS CHAVES DISPONÍVEIS:');
        const chaves = Object.keys(primeiroItem);
        chaves.forEach((chave, index) => {
          console.log(`${index + 1}. ${chave}: ${typeof primeiroItem[chave]} = ${primeiroItem[chave]}`);
        });
        
        console.log('\n📝 ANÁLISE DOS CAMPOS IMPORTANTES:');
        console.log('- ID:', primeiroItem.id);
        console.log('- harasId:', primeiroItem.harasId);
        console.log('- name:', primeiroItem.name, '(tipo:', typeof primeiroItem.name, ')');
        console.log('- brand:', primeiroItem.brand, '(tipo:', typeof primeiroItem.brand, ')');
        console.log('- feedType:', primeiroItem.feedType, '(tipo:', typeof primeiroItem.feedType, ')');
        console.log('- feedTypeName:', primeiroItem.feedTypeName, '(tipo:', typeof primeiroItem.feedTypeName, ')');
        console.log('- feedTypeId:', primeiroItem.feedTypeId, '(tipo:', typeof primeiroItem.feedTypeId, ')');
        console.log('- currentQuantity:', primeiroItem.currentQuantity, '(tipo:', typeof primeiroItem.currentQuantity, ')');
        console.log('- unit:', primeiroItem.unit, '(tipo:', typeof primeiroItem.unit, ')');
        console.log('- description:', primeiroItem.description, '(tipo:', typeof primeiroItem.description, ')');
        console.log('- supplier:', primeiroItem.supplier, '(tipo:', typeof primeiroItem.supplier, ')');
        
        console.log('\n📊 RESUMO DE TODOS OS ITENS:');
        response.data.data.forEach((item, index) => {
          console.log(`\n--- Item ${index + 1} ---`);
          console.log('ID:', item.id);
          console.log('name:', item.name);
          console.log('feedTypeName:', item.feedTypeName);
          console.log('brand:', item.brand);
          console.log('feedType:', item.feedType);
          console.log('currentQuantity:', item.currentQuantity);
          console.log('Chaves disponíveis:', Object.keys(item).length);
        });
      }
    } else {
      console.log('\n⚠️ Estrutura de dados inesperada');
      console.log('response.data:', response.data);
    }
    
  } catch (error) {
    console.error('\n❌ ERRO NA CHAMADA DA API DE ESTOQUE:');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('Request não recebeu resposta');
    } else {
      console.error('Message:', error.message);
    }
  }
}

// Função principal
async function executarTeste() {
  console.log('='.repeat(60));
  console.log('🧪 TESTE COMPLETO DA API DE ESTOQUE');
  console.log('='.repeat(60));
  
  // Primeiro fazer login
  const token = await fazerLogin();
  
  if (token) {
    // Depois testar a API de estoque
    await testarAPIEstoque(token);
  } else {
    console.log('❌ Não foi possível obter token, abortando teste da API de estoque');
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🏁 TESTE CONCLUÍDO');
  console.log('='.repeat(60));
}

// Executar o teste
executarTeste();
