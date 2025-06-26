# Correção da Duplicação de Filtros na Tela de Estoque

## Problema Identificado

Na tela de estoque, os botões de filtro (Todos, Baixo Estoque, Vencidos) estavam aparecendo duplicados na aba "Farmácia". Isso acontecia porque havia dois conjuntos de filtros:

1. **Filtros gerais** (aplicados a ambas as abas)
2. **Filtros específicos da farmácia** (apenas na aba farmácia)

## Solução Implementada

### 1. Remoção dos Filtros Duplicados
- Removidos os filtros específicos da farmácia que estavam causando duplicação
- Mantidos apenas os filtros gerais que funcionam para ambas as abas

### 2. Adição do Filtro "Receita Obrigatória"
- Adicionado novo tipo de filtro: `'prescription'`
- Filtro aparece apenas na aba "Farmácia"
- Filtra medicamentos que têm `prescriptionRequired: true`

### 3. Atualização da Lógica de Filtros

#### Para Ração:
```typescript
switch (filterType) {
  case 'low': return stock.currentQuantity <= stock.minimumThreshold;
  case 'expired': return stock.expirationDate && new Date(stock.expirationDate) < new Date();
  case 'prescription': return false; // Ração não tem receita obrigatória
  default: return true;
}
```

#### Para Medicamentos:
```typescript
// Filtro de medicamentos
if (filterType === 'prescription') {
  return medicine.prescriptionRequired === true;
}

// Filtro de estoque veterinário
switch (filterType) {
  case 'low': return stock.currentQuantity <= stock.minimumThreshold;
  case 'expired': return stock.expirationDate && new Date(stock.expirationDate) < new Date();
  case 'prescription': return stock.medicine?.prescriptionRequired === true;
  default: return true;
}
```

### 4. Interface dos Filtros
- Filtros gerais: "Todos", "Baixo estoque", "Vencidos"
- Filtro específico: "Receita Obrigatória" (apenas na aba farmácia)
- Filtros são compartilhados entre as abas, mas o filtro "Receita Obrigatória" só aparece na farmácia

## Benefícios da Correção

✅ **Eliminação da duplicação**: Não há mais filtros duplicados na aba farmácia
✅ **Interface limpa**: Experiência de usuário mais consistente
✅ **Funcionalidade específica**: Filtro de receita obrigatória apenas onde faz sentido
✅ **Código otimizado**: Lógica de filtros unificada e eficiente

## Tipos de Filtro

| Filtro | Ração | Farmácia | Descrição |
|--------|-------|----------|-----------|
| Todos | ✅ | ✅ | Mostra todos os itens |
| Baixo estoque | ✅ | ✅ | Itens abaixo do estoque mínimo |
| Vencidos | ✅ | ✅ | Itens com data de validade vencida |
| Receita Obrigatória | ❌ | ✅ | Medicamentos que requerem receita |

## Arquivos Modificados

- `app/modules/haras/screens/EstoqueScreen.tsx`
  - Removida seção duplicada de filtros da farmácia
  - Adicionado tipo `'prescription'` ao filterType
  - Implementada lógica de filtro para receita obrigatória
  - Adicionado filtro condicional na interface (apenas farmácia)

## Status

✅ **Concluído**: Duplicação de filtros removida
✅ **Funcional**: Filtro de receita obrigatória implementado
✅ **Testado**: Interface limpa e consistente
