# Integração da Farmácia na Tela de Estoque

## Resumo das Alterações

### 1. Tela de Estoque (EstoqueScreen.tsx)
- **Adicionado carregamento de dados da farmácia**: A função `loadData` agora carrega dados de medicamentos, estoque veterinário e alertas veterinários em paralelo com os dados de ração.
- **Implementado filtros para farmácia**: Criada função `filteredVeterinaryStocks` similar à de ração, permitindo filtrar por nome do medicamento, fabricante e lote.
- **Corrigidas propriedades das interfaces**: Ajustadas as propriedades utilizadas para corresponder às interfaces do `veterinaryService`:
  - `batchNumber` (ao invés de `lotNumber`)
  - `currentQuantity` (ao invés de `quantity`)
  - `minimumThreshold` (ao invés de `minimumQuantity`)
  - `unitCost` (ao invés de `costPerUnit`)
  - `storageLocation` (ao invés de `location`)

### 2. Serviço Veterinário (veterinaryService.ts)
- **Corrigido baseUrl**: Alterado de `/api/veterinary` para `/api/haras-pro/veterinary` para corresponder ao endpoint mencionado.
- **Endpoints utilizados**:
  - `GET /api/haras-pro/veterinary/haras/{haras_id}/medicines` - Lista medicamentos
  - `GET /api/haras-pro/veterinary/haras/{haras_id}/stocks` - Lista estoque veterinário
  - `GET /api/haras-pro/veterinary/haras/{haras_id}/alerts/low-stock` - Lista alertas

### 3. Funcionalidades Implementadas
- **Aba Farmácia**: Os dados são carregados automaticamente quando a tela é aberta
- **Filtros e busca**: Funciona tanto para ração quanto para farmácia
- **Alertas veterinários**: São exibidos na seção de alertas da farmácia
- **Contadores**: Mostram a quantidade correta de itens filtrados
- **Interface responsiva**: Mantém o mesmo padrão visual da aba de ração

## APIs Utilizadas

### Medicamentos
```
GET /api/haras-pro/veterinary/haras/{haras_id}/medicines
```
Retorna lista de medicamentos cadastrados para o haras.

### Estoque Veterinário  
```
GET /api/haras-pro/veterinary/haras/{haras_id}/stocks
```
Retorna lista de itens do estoque veterinário com informações de quantidade, lote, validade, etc.

### Alertas Veterinários
```
GET /api/haras-pro/veterinary/haras/{haras_id}/alerts/low-stock
```
Retorna alertas de estoque baixo, produtos vencidos ou próximos ao vencimento.

## Estados Gerenciados

### Farmácia
- `medicines: Medicine[]` - Lista de medicamentos
- `veterinaryStocks: VeterinaryStock[]` - Estoque veterinário
- `veterinaryAlerts: VeterinaryAlert[]` - Alertas ativos

### Filtros
- `filteredVeterinaryStocks` - Estoque veterinário filtrado por busca e tipo

## Estrutura de Dados

### Medicine
```typescript
interface Medicine {
  id: string;
  name: string;
  activeIngredient: string;
  type: 'antibiotic' | 'anti-inflammatory' | 'vaccine' | 'supplement' | 'other';
  manufacturer: string;
  prescriptionRequired: boolean;
  // ... outros campos
}
```

### VeterinaryStock
```typescript
interface VeterinaryStock {
  id: string;
  harasId: string;
  medicineId: string;
  medicine: Medicine;
  batchNumber: string;
  currentQuantity: number;
  minimumThreshold: number;
  unitCost: number;
  expirationDate: string;
  storageLocation: string;
  // ... outros campos
}
```

## Como Testar

1. **Verificar carregamento**: Na tela de estoque, alternar para a aba "Farmácia"
2. **Testar filtros**: Usar a barra de busca e filtros (todos, estoque baixo, vencidos)
3. **Verificar alertas**: Alertas veterinários devem aparecer na seção de alertas
4. **Validar dados**: Verificar se os dados dos medicamentos são exibidos corretamente

## Requisitos do Backend

O backend deve implementar os endpoints mencionados retornando dados no formato esperado pelas interfaces definidas.

## Status

✅ **Implementação Completa**
- Carregamento de dados da farmácia
- Filtros e busca funcionais
- Alertas veterinários integrados  
- Interface consistente com a aba de ração
- Correção de tipos e propriedades
- Export defaults adicionados para compatibilidade com Expo Router
