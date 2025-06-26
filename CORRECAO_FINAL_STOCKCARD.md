# Correção Final do StockCard - Mapeamento com Backend

## Problema Identificado

O StockCard estava tentando mapear campos que não existiam na estrutura real do backend. Após análise do código do `FeedStockService`, foi identificado que a estrutura real dos dados é diferente do que estava sendo esperado.

## Estrutura Real do Backend (FeedStock)

Baseado no `FeedStockService`, os campos que realmente vêm da API são:

### Campos Principais:
- `id`: ID do estoque
- `harasId`: ID do haras
- `feedTypeId`: ID do tipo de ração (pode ser null)
- `feedTypeName`: Nome do tipo (ex: "Haras", "Manutenção", "Performance", "Potros")
- `currentQuantity`: Quantidade atual em estoque
- `minimumStock`: Estoque mínimo
- `unitOfMeasure`: Unidade de medida (ex: "kg")

### Campos Financeiros:
- `totalValue`: Valor total do estoque
- `averageUnitCost`: Custo médio por unidade
- `lastPurchasePrice`: Preço da última compra

### Campos de Data (Firestore Timestamp):
- `lastPurchaseDate`: Data da última compra
- `expirationDate`: Data de validade (opcional)
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

### Campos Opcionais:
- `location`: Localização do estoque
- `observations`: Observações
- `isActive`: Status ativo/inativo

## Correções Implementadas

### 1. Mapeamento Correto dos Dados
```typescript
const getMappedData = () => {
  const stockData = stock as any;
  return {
    // Nome usando feedTypeName que realmente vem da API
    name: stockData.feedTypeName || 'Nome não informado',
    
    // Quantidade e medidas corretas
    currentQuantity: stockData.currentQuantity || 0,
    minimumStock: stockData.minimumStock || 10,
    unit: stockData.unitOfMeasure || 'kg',
    
    // Valores financeiros reais
    totalValue: stockData.totalValue || 0,
    averageUnitCost: stockData.averageUnitCost || 0,
    lastPurchasePrice: stockData.lastPurchasePrice || 0,
    
    // Datas (Firestore Timestamps)
    lastPurchaseDate: stockData.lastPurchaseDate,
    expirationDate: stockData.expirationDate,
    
    // Outros campos
    location: stockData.location || 'Não informado',
    observations: stockData.observations || '',
    isActive: stockData.isActive !== false,
  };
};
```

### 2. Exibição de Informações Reorganizada

#### Seção Principal:
- **Nome**: Usa `feedTypeName` (ex: "Haras", "Performance")
- **Quantidade**: `currentQuantity` + `unitOfMeasure`
- **Estoque mínimo**: `minimumStock`
- **Valor total**: `totalValue`

#### Seção Detalhada:
- **Custo por unidade**: `averageUnitCost` por `unitOfMeasure`
- **Valor total**: `totalValue`
- **Localização**: `location` (se disponível)
- **Observações**: `observations` (se disponível)

#### Seção Informações da API:
- **Tipo**: `feedTypeName`
- **Tipo ID**: `feedTypeId` (se disponível)
- **Última compra**: `lastPurchaseDate` (formatada)
- **Último preço**: `lastPurchasePrice`
- **Data de validade**: `expirationDate` (se disponível)
- **Data de criação**: `createdAt` (formatada)
- **Status**: `isActive` (Ativo/Inativo)

### 3. Tratamento de Datas Firestore
As datas vêm como Firestore Timestamps, então são convertidas usando:
```typescript
new Date(mappedData.lastPurchaseDate.seconds * 1000).toLocaleDateString('pt-BR')
```

### 4. Logs de Debug Atualizados
Os logs agora mostram apenas os campos que realmente existem:
```typescript
console.log('✅ StockCard - Dados mapeados:', {
  name: mappedData.name, // feedTypeName
  currentQuantity: mappedData.currentQuantity,
  unit: mappedData.unit, // unitOfMeasure
  totalValue: mappedData.totalValue,
  averageUnitCost: mappedData.averageUnitCost,
  minimumStock: mappedData.minimumStock,
  location: mappedData.location,
  isActive: mappedData.isActive
});
```

## Exemplo de Dados Exibidos

Para uma ração do tipo "Performance" com 40kg em estoque:

### Card Principal:
- **Nome**: "Performance"
- **Marca**: "Ração" (padrão)
- **Progresso**: "40 kg / 1000 kg"

### Informações:
- **Quantidade**: "40 kg"
- **Estoque mínimo**: "10"
- **Valor**: "R$ 122,00"

### Detalhes:
- **Custo unitário**: "R$ 3,05 por kg"
- **Valor total**: "R$ 122,00"
- **Localização**: "Galpão A" (se informado)

### Informações da API:
- **Tipo**: "Performance"
- **Última compra**: "25/06/2025"
- **Último preço**: "R$ 3,05"
- **Status**: "Ativo"

## Arquivos Modificados

- `app/modules/haras/components/stock/StockCard.tsx`
  - Função `getMappedData()` completamente reescrita
  - Logs de debug atualizados
  - JSX atualizado para usar campos corretos
  - Tratamento de datas Firestore
  - Seções reorganizadas

## Próximos Passos

1. ✅ **Concluído**: Mapeamento correto dos dados do backend
2. ✅ **Concluído**: Exibição de todas as informações relevantes
3. ✅ **Concluído**: Tratamento de datas Firestore
4. 🔄 **Teste**: Validar no aplicativo se os dados estão sendo exibidos corretamente
5. ⏳ **Otimização**: Remover logs de debug após validação
6. ⏳ **Melhorias**: Adicionar formatação de moeda brasileira

## Status

✅ **Implementado**: Mapeamento completo baseado no backend real  
🔄 **Em teste**: Validação da exibição correta dos dados  
⏳ **Pendente**: Testes e refinamentos finais
