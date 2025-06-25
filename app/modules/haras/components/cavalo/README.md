# Componentes de Cavalo

Esta pasta contém os componentes reutilizáveis para a tela de detalhes do cavalo, organizados de forma modular para facilitar manutenção e reutilização.

## Componentes Criados

### 1. `InformacoesTecnicasCard`
- **Propósito**: Exibe informações técnicas básicas do cavalo
- **Inclui**: Raça, cor, peso, altura, microchip
- **Características**: 
  - Badge de gênero
  - Microchip copiável
  - Ícones coloridos por categoria
  - Animação de entrada

### 2. `TimelineCard`
- **Propósito**: Exibe linha do tempo do cavalo
- **Inclui**: Nascimento, aquisição (opcional), cadastro
- **Características**:
  - Dots coloridos por evento
  - Layout responsivo
  - Datas formatadas em pt-BR

### 3. `ValoresFinanceirosCard`
- **Propósito**: Exibe valores financeiros do cavalo
- **Inclui**: Valor de aquisição, valor atual, % de valorização
- **Características**:
  - Indicador de valorização/desvalorização
  - Cores dinâmicas baseadas no resultado
  - Formatação monetária brasileira
  - Renderização condicional

### 4. `GenealogiaTab`
- **Propósito**: Exibe informações genealógicas
- **Inclui**: Pai, mãe com registros
- **Características**:
  - Estado vazio quando não há dados
  - Ícones diferenciados por gênero
  - Layout card limpo

### 5. `FilhosTab`
- **Propósito**: Lista descendentes do cavalo
- **Inclui**: Nome, registro, data de nascimento
- **Características**:
  - Contador de descendentes
  - Estado vazio quando não há filhos
  - Formatação de datas

### 6. `ConquistasTab`
- **Propósito**: Lista conquistas e premiações
- **Inclui**: Lista de achievements
- **Características**:
  - Ícones de troféu
  - Estado vazio quando não há conquistas
  - Layout em lista

### 7. `ObservacoesCard`
- **Propósito**: Exibe observações do cavalo
- **Inclui**: Notas/observações
- **Características**:
  - Renderização condicional
  - Texto em itálico
  - Fundo diferenciado

## Arquivos Auxiliares

### `index.ts`
Arquivo de barril (barrel export) que exporta todos os componentes para facilitar importação:

```typescript
import { 
  InformacoesTecnicasCard, 
  TimelineCard, 
  ValoresFinanceirosCard, 
  GenealogiaTab, 
  FilhosTab, 
  ConquistasTab, 
  ObservacoesCard 
} from '../components/cavalo';
```

## Benefícios da Componentização

1. **Reutilização**: Componentes podem ser usados em outras telas
2. **Manutenibilidade**: Cada componente tem responsabilidade única
3. **Testabilidade**: Componentes isolados são mais fáceis de testar
4. **Organização**: Código mais limpo e estruturado
5. **Performance**: Renderização otimizada por componente

## Uso na Tela Principal

A tela `DetalheCavaloScreen.tsx` foi refatorada para usar estes componentes:

- **Aba Info**: Usa `InformacoesTecnicasCard`, `TimelineCard`, `ValoresFinanceirosCard`, `ObservacoesCard`
- **Aba Genealogia**: Usa `GenealogiaTab`
- **Aba Filhos**: Usa `FilhosTab`
- **Aba Conquistas**: Usa `ConquistasTab`

## Consistência Visual

Todos os componentes seguem o mesmo padrão visual:
- Uso consistente do `Theme` para cores, espaçamentos e tipografia
- Animações usando `delay` props
- Estados vazios padronizados
- Ícones da biblioteca Feather
- Layouts responsivos

## Futuras Melhorias

1. Adicionar testes unitários para cada componente
2. Implementar stories no Storybook (se aplicável)
3. Adicionar PropTypes ou validação de props mais robusta
4. Implementar lazy loading para componentes pesados
5. Adicionar acessibilidade (a11y) labels
