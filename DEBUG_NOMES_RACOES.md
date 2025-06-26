# Debug - Problema com Nomes das Rações

## 🐛 Problema Identificado
**Sintoma**: Nomes das rações não estão sendo exibidos na tela de estoque.

## 🔍 Investigação Implementada

### 1. **Logs de Debug Adicionados**

#### Na EstoqueScreen.tsx:
```typescript
console.log('✅ Dados do estoque carregados:', stocksData.length, 'itens');
if (stocksData.length > 0) {
  console.log('📋 Primeiro item do estoque:', JSON.stringify(stocksData[0], null, 2));
  console.log('📋 Nomes dos primeiros 3 itens:', stocksData.slice(0, 3).map(s => ({ 
    id: s.id, 
    name: s.name, 
    brand: s.brand 
  })));
}
```

#### No StockCard.tsx:
```typescript
console.log('🐛 StockCard - Dados recebidos:', { 
  id: stock.id, 
  name: stock.name, 
  brand: stock.brand, 
  feedType: stock.feedType 
});
```

### 2. **Pontos de Verificação**

#### ✅ Interface FeedStock (Correta)
```typescript
export interface FeedStock {
  id: string;
  harasId: string;
  name: string;        // ← Campo existe
  brand: string;       // ← Campo existe
  feedType: string;
  // ... outros campos
}
```

#### ✅ StockCard Renderização (Com Fallbacks)
```typescript
<Text style={styles.name}>
  {stock.name || 'Nome não informado'}
</Text>
<Text style={styles.brand}>
  {(stock.brand || 'Marca não informada')} • {getFeedTypeLabel(stock.feedType)}
</Text>
```

#### ✅ Filtro de Busca (Com Verificações)
```typescript
const filteredStocks = stocks.filter(stock => {
  const matchesSearch = (stock.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                       (stock.brand || '').toLowerCase().includes(searchQuery.toLowerCase());
  // ...
});
```

## 🧪 Como Diagnosticar

### 1. **Execute a Aplicação**
```bash
npm start
# ou
expo start
```

### 2. **Navegue para Estoque**
- Abra a tab "Estoque"
- Selecione a aba "Ração"

### 3. **Verifique o Console**
Procure pelos logs:

#### A. **Carregamento de Dados**
```
✅ Dados do estoque carregados: X itens
📋 Primeiro item do estoque: {...}
📋 Nomes dos primeiros 3 itens: [...]
```

#### B. **Renderização dos Cards**
```
🐛 StockCard - Dados recebidos: { id: "...", name: "...", brand: "..." }
```

## 🔧 Cenários Possíveis

### **Cenário 1: Dados Chegam Vazios**
```json
📋 Nomes dos primeiros 3 itens: [
  { id: "1", name: "", brand: "" },
  { id: "2", name: null, brand: null }
]
```
**Solução**: Problema na API ou simulação de dados

### **Cenário 2: Dados Corretos, Renderização Falhando**
```json
📋 Nomes dos primeiros 3 itens: [
  { id: "1", name: "Feno Premium", brand: "Marca A" }
]
🐛 StockCard - Dados recebidos: { name: undefined, brand: undefined }
```
**Solução**: Problema na passagem de props ou componente

### **Cenário 3: Problema de Tipagem**
```json
📋 Primeiro item: {
  "id": "1",
  "productName": "Feno Premium",  // ← Nome do campo errado
  "brandName": "Marca A"          // ← Nome do campo errado
}
```
**Solução**: Ajustar mapeamento de campos

## 🛠️ Próximas Ações

Baseado nos logs do console, implementaremos uma das seguintes correções:

### **Se dados estão corretos:**
- Verificar passagem de props
- Revisar renderização do componente

### **Se dados estão vazios:**
- Verificar endpoint da API
- Revisar simulação de dados
- Ajustar mapeamento de resposta

### **Se nomes de campos estão errados:**
- Atualizar interface TypeScript
- Ajustar mapeamento de dados
- Corrigir transformação de resposta

## 📋 Informações para Análise

Após executar e verificar os logs, relate:

1. **Quantidade de itens carregados**
2. **Estrutura do primeiro item** (JSON completo)
3. **Nomes dos primeiros 3 itens**
4. **Logs do StockCard** (se aparecem)
5. **O que aparece na tela** (vazio, "Nome não informado", etc.)

Com essas informações, poderemos identificar e corrigir o problema rapidamente! 🎯
