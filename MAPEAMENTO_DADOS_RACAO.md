# Mapeamento dos Dados de Ração da API

## Problema Identificado

A API estava retornando dados de estoque em uma estrutura diferente da esperada pela interface `FeedStock`. Os campos `name`, `brand` e `feedType` estavam chegando como `undefined`, mas outros campos estavam disponíveis na resposta da API.

## Estrutura dos Dados da API

### Campos que estão vindo da API:
- `id`: ID do item
- `harasId`: ID do haras
- `feedTypeId`: ID do tipo de ração (pode ser null)
- `feedTypeName`: Nome do tipo de ração ("Tipo Básico")
- `currentQuantity`: Quantidade atual (ex: 40)
- Outros campos específicos da API

### Campos esperados pela interface `FeedStock`:
- `name`: Nome do produto
- `brand`: Marca do produto
- `feedType`: Tipo da ração ('hay' | 'grain' | 'supplement' | 'concentrate' | 'pellets' | 'other')

## Solução Implementada

### 1. Função de Mapeamento
Criada função `getMappedData()` no `StockCard` que mapeia os dados da API para os campos esperados:

```typescript
const getMappedData = () => {
  const stockData = stock as any;
  return {
    id: stock.id,
    name: stock.name || stockData.feedTypeName || stockData.productName || stockData.itemName || stockData.title || 'Nome não informado',
    brand: stock.brand || stockData.brandName || stockData.marca || 'Marca não informada',
    feedType: stock.feedType || 'other' as FeedStock['feedType'],
    description: stock.description || stockData.descricao || stockData.description,
    currentQuantity: stock.currentQuantity || stockData.quantidade || 0,
    unit: stock.unit || stockData.unidade || 'kg',
    costPerUnit: stock.costPerUnit || stockData.custo || stockData.preco || 0,
    supplier: stock.supplier || stockData.fornecedor || stockData.supplier,
    storageLocation: stock.storageLocation || stockData.localizacao || stockData.location,
    maximumCapacity: stock.maximumCapacity || stockData.capacidadeMaxima || stockData.maxCapacity || 100,
    minimumThreshold: stock.minimumThreshold || stockData.estoqueMinimo || stockData.minThreshold || 10,
  };
};
```

### 2. Melhorias no Card
- **Dados mapeados**: Uso dos dados mapeados em todas as exibições
- **Informações adicionais**: Seção adicional para mostrar descrição, ID do tipo, validade e última reposição
- **Fornecedor**: Adicionada exibição do fornecedor quando disponível
- **Logs detalhados**: Logs para debug dos dados recebidos e mapeados

### 3. Novos Campos Exibidos
- Nome da ração (usando `feedTypeName` quando `name` não está disponível)
- Marca (com fallback para diferentes campos possíveis)
- Fornecedor (quando disponível)
- Descrição (em seção separada)
- ID do tipo de ração
- Data de validade (quando disponível)
- Última data de reposição (quando disponível)

## Logs de Debug

### Logs implementados:
1. **Dados completos**: Log de todos os dados recebidos da API
2. **Chaves disponíveis**: Log de todas as chaves do objeto
3. **Valores específicos**: Log dos campos que estamos tentando mapear
4. **Dados mapeados**: Log dos dados após o mapeamento

### Como interpretar os logs:
- `🐛 StockCard - Dados COMPLETOS recebidos`: Dados brutos da API
- `🐛 StockCard - Todas as chaves disponíveis`: Lista de todas as propriedades
- `🐛 StockCard - Valores específicos`: Campos específicos que estamos mapeando
- `✅ StockCard - Dados mapeados`: Dados finais após mapeamento

## Próximos Passos

1. **Validar exibição**: Verificar se todos os dados estão sendo exibidos corretamente
2. **Ajustes finos**: Ajustar mapeamento baseado nos dados reais da API
3. **Otimização**: Remover logs de debug após validação
4. **Padronização**: Considerar padronizar a API para retornar dados na estrutura esperada

## Arquivos Modificados

- `app/modules/haras/components/stock/StockCard.tsx`
  - Função de mapeamento de dados
  - Logs de debug detalhados
  - Seção de informações adicionais
  - Estilos para nova seção

## Status

✅ **Implementado**: Mapeamento básico dos dados  
🔄 **Em teste**: Validação da exibição dos dados  
⏳ **Pendente**: Otimização baseada nos dados reais
