# Gerenciamento de Baias e Cavalos

Este documento descreve as funcionalidades implementadas para o gerenciamento de baias e atribuição de cavalos no sistema Haras Pro.

## Funcionalidades Implementadas

### 1. Serviços (Services)

#### CavaloService
- **Localização**: `app/modules/haras/services/cavaloService.ts`
- **Novas funcionalidades**:
  - `assignCavaloToBaia(horseId, stallId)` - Atribui um cavalo a uma baia
  - `removeCavaloFromBaia(horseId)` - Remove um cavalo de sua baia atual

#### BaiaService
- **Localização**: `app/modules/haras/services/baiaService.ts`
- **Funcionalidades**:
  - `getBaiasByHaras(harasId)` - Lista todas as baias de um haras
  - `getBaiasDisponiveis(harasId)` - Lista apenas baias disponíveis
  - `getBaiaStats(harasId)` - Estatísticas das baias
  - `getBaiaById(id)` - Busca uma baia específica
  - `assignCavaloToBaia(stallId, horseId)` - Atribui cavalo à baia (via baia)
  - `removeCavaloFromBaia(stallId)` - Remove cavalo da baia (via baia)
  - `setBaiaStatus(stallId, status)` - Altera status da baia

### 2. Telas (Screens)

#### BaiasScreen
- **Localização**: `app/modules/haras/screens/BaiasScreen.tsx`
- **Funcionalidades**:
  - Visualização de todas as baias com status
  - Estatísticas de ocupação
  - Busca por baia ou cavalo
  - Atribuição de cavalos via modal
  - Remoção de cavalos das baias
  - Alteração de status das baias

#### GerenciamentoBaiasScreen
- **Localização**: `app/modules/haras/screens/GerenciamentoBaiasScreen.tsx`
- **Funcionalidades**:
  - Tela de teste para as APIs de baias
  - Interface simples para testar atribuições
  - Consulta de status dos cavalos
  - Demonstração das funcionalidades

#### DetalheCavaloScreen (Atualizado)
- **Localização**: `app/modules/haras/screens/DetalheCavaloScreen.tsx`
- **Novas funcionalidades**:
  - Exibição da baia atual do cavalo
  - QuickStat clicável para gerenciar baia
  - Atribuição/remoção de baia diretamente do detalhes
  - Carregamento automático de baias disponíveis

## APIs Backend Correspondentes

### Endpoints de Cavalos
```
PUT /api/haras-pro/horses/{horseId}/assign-stall
PUT /api/haras-pro/horses/{horseId}/remove-stall
GET /api/haras-pro/horses/{horseId}
```

### Endpoints de Baias
```
GET /api/haras-pro/haras/{harasId}/stalls
GET /api/haras-pro/haras/{harasId}/stalls/available
GET /api/haras-pro/haras/{harasId}/stalls/stats
GET /api/haras-pro/stalls/{stallId}
PUT /api/haras-pro/stalls/{stallId}/assign-horse
PUT /api/haras-pro/stalls/{stallId}/remove-horse
PUT /api/haras-pro/stalls/{stallId}/status
```

## Como Testar

### 1. Usando GerenciamentoBaiasScreen
- Acesse a tela de teste
- Selecione um cavalo
- Escolha "Consultar" para ver o status atual
- Escolha "Atribuir à Baia" para associar a uma baia
- Escolha "Remover da Baia" para desassociar

### 2. Usando DetalheCavaloScreen
- Abra os detalhes de um cavalo
- Clique no QuickStat "Baia"
- Escolha as opções disponíveis no alert

### 3. Usando BaiasScreen
- Visualize todas as baias
- Use a busca para filtrar
- Clique em "Atribuir" em baias disponíveis
- Clique no "X" para remover cavalos

## Estrutura de Dados

### Cavalo
```typescript
interface Cavalo {
  id: string;
  name: string;
  stallId?: string; // ID da baia atual
  // ... outros campos
}
```

### Baia
```typescript
interface Baia {
  id: string;
  number: string;
  name?: string;
  type: 'individual' | 'paddock' | 'quarantine' | 'breeding';
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  horse?: {
    id: string;
    name: string;
    registration?: string;
  };
  // ... outros campos
}
```

## Fluxo de Atribuição

1. **Cavalo → Baia**: `cavaloService.assignCavaloToBaia(horseId, stallId)`
2. **Baia → Cavalo**: `baiaService.assignCavaloToBaia(stallId, horseId)`
3. **Remoção**: Ambos os serviços têm métodos de remoção

## Tratamento de Erros

- Todas as operações têm try/catch
- Alertas informativos para o usuário
- Logs detalhados no console
- Recarregamento automático dos dados após operações

## Validações

- Verificação de disponibilidade da baia
- Verificação se cavalo já está em baia
- Validação de IDs existentes
- Feedback visual de loading

## Próximos Passos

1. Implementar tela de criação de baias
2. Adicionar filtros avançados
3. Implementar notificações push
4. Adicionar histórico de movimentações
5. Implementar reservas de baias
6. Adicionar relatórios de ocupação
