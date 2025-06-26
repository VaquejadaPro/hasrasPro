# Melhoria na Exibição dos Dados de Ração

## Problema Identificado

A exibição dos dados de ração estava confusa pois não estava claro que:
- `currentQuantity: 40` = 40 sacos de ração
- Cada saco tem 40kg
- O preço é por saco, não por kg
- O valor total é calculado: quantidade de sacos × preço por saco

## Dados da API Analisados

```javascript
// Dados reais vindos da API
{
  "id": "PJVhHTCLWdNndCKMc0tk",
  "harasId": "4NDSBXQtOPeYWfROrVfm", 
  "feedTypeId": null,
  "feedTypeName": "Haras",           // Nome do tipo de ração
  "currentQuantity": 40,             // 40 sacos
  "isActive": true,
  // ... outros campos
}
```

## Melhorias Implementadas

### 1. Unidades Corretas
- **Antes**: "40 kg" (incorreto)
- **Depois**: "40 sacos (1600kg)" (correto)

### 2. Informações Detalhadas
- **Peso por saco**: 40kg por saco
- **Peso total**: Calculado automaticamente (40 sacos × 40kg = 1600kg)
- **Preço por saco**: R$ X,XX por saco
- **Valor total**: Calculado automaticamente (40 sacos × preço)

### 3. Layout Melhorado

#### Seção Principal (Stock Info):
- Quantidade em sacos
- Peso total em kg
- Valor total em R$

#### Seção Detalhada (Detailed Info):
- Informações específicas: kg por saco, preço por saco
- Fornecedor e localização (quando disponíveis)

#### Seção Adicional (Additional Info):
- Dados técnicos da API: tipo, ID, datas, status

### 4. Mapeamento de Dados Correto

```typescript
const getMappedData = () => {
  const stockData = stock as any;
  return {
    // Nome usando feedTypeName da API
    name: stockData.feedTypeName || stock.name || 'Nome não informado',
    
    // Unidade correta
    unit: stock.unit || 'sacos',
    
    // Pesos calculados
    weightPerUnit: 40, // kg por saco
    totalWeight: (stock.currentQuantity || 0) * 40, // peso total
    
    // Outros campos...
  };
};
```

### 5. Logs de Debug Melhorados

```javascript
console.log('✅ StockCard - Dados mapeados:', {
  name: mappedData.name,              // "Haras"
  currentQuantity: mappedData.currentQuantity, // 40 (sacos)
  totalWeight: mappedData.totalWeight,         // 1600 (kg)
  weightPerUnit: mappedData.weightPerUnit,     // 40 (kg/saco)
  costPerUnit: mappedData.costPerUnit,         // preço por saco
  totalValue: (quantity * costPerUnit),        // valor total
});
```

## Resultado Visual

### Antes:
```
Nome da Ração
Marca • Tipo
████████░░ 40/100 kg
Qtd: 40 kg | Preço: R$ 122,00
```

### Depois:
```
Haras
Ração Haras • Outros
████████░░ 40 sacos (1600kg) / 100 sacos

40 sacos | 1600kg total | R$ 122,00

Detalhes:
40kg por saco | R$ 3,05 por saco
Fornecedor: Fornecedor não informado
Localização: Localização não informada

Informações Técnicas:
Tipo: Haras
Haras: 4NDSBXQtOPeYWfROrVfm
Status: Ativo
```

## Arquivos Modificados

- `app/modules/haras/components/stock/StockCard.tsx`
  - Mapeamento correto das unidades (sacos vs kg)
  - Cálculo automático do peso total
  - Seções organizadas de informações
  - Logs de debug melhorados
  - Estilos adicionais para nova seção detalhada

## Benefícios

1. **Clareza**: Distinção clara entre sacos e peso em kg
2. **Precisão**: Cálculos corretos de peso e valor totais
3. **Completude**: Exibição de todos os dados relevantes da API
4. **Organização**: Informações agrupadas logicamente
5. **Debug**: Logs detalhados para monitoramento

## Status

✅ **Implementado**: Exibição correta das unidades e cálculos  
✅ **Testado**: Mapeamento dos dados da API  
⏳ **Pendente**: Validação visual no aplicativo
