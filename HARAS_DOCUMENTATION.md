# HarasPro - Sistema Completo de Gestão Reprodutiva

## 🐎 Sobre o Projeto

O HarasPro é um sistema completo de gestão reprodutiva para haras, inspirado no VaquejadaPro, que oferece todas as funcionalidades avançadas de manejo, reprodução, saúde animal e gestão de embriões.

## 🚀 Funcionalidades Implementadas

### 1. **Gestão de Embriões**
- ✅ Registro de coleta de embriões
- ✅ Controle de qualidade (Grau 1-4)
- ✅ Gestão de status (Congelado, Transferido, Descartado)
- ✅ Transferência para receptoras
- ✅ Histórico completo de operações
- ✅ Interface intuitiva com filtros e busca

### 2. **Manejo Reprodutivo**
- ✅ Registro de coberturas
- ✅ Controle de inseminações
- ✅ Gestão de implantações
- ✅ Registro de partos
- ✅ Taxa de sucesso
- ✅ Controle de custos
- ✅ Condições climáticas
- ✅ Responsáveis por operação

### 3. **Agenda Reprodutiva**
- ✅ Agendamento de eventos
- ✅ Sistema de prioridades (Alta, Média, Baixa)
- ✅ Notificações
- ✅ Controle de status (Realizado/Pendente)
- ✅ Eventos vencidos e vencendo
- ✅ Visão por período (Hoje, Próximos 7 dias, Todos)

### 4. **Saúde Animal**
- ✅ Registro de vacinas
- ✅ Controle de medicamentos
- ✅ Exames veterinários
- ✅ Cirurgias
- ✅ Ferimentos
- ✅ Controle de reações
- ✅ Próximas aplicações
- ✅ Controle de validade
- ✅ Histórico médico completo

### 6. **Gestão de Cavalos**
- ✅ Lista completa do plantel
- ✅ Filtros por categoria (Garanhão, Doadora, Receptora, Potro)
- ✅ Busca avançada por nome, raça, cor, registro
- ✅ Estatísticas do plantel
- ✅ Status de disponibilidade
- ✅ Integração com baia
- ✅ Interface moderna com cards e gradientes
- ✅ Refresh automático e manual

### 7. **Cavalos Disponíveis** 🆕
- ✅ Listagem específica de cavalos sem baia
- ✅ Interface otimizada para gestão de disponibilidade
- ✅ Função de alocação de baia
- ✅ Stats rápidas de disponibilidade
- ✅ Integração com endpoint `/haras/:harasId/horses/available`
- ✅ Design diferenciado com tema verde (disponibilidade)
- ✅ Botão de ação primária para alocar baia

### 8. **Detalhes do Animal**
- ✅ Perfil completo do animal
- ✅ Informações básicas (idade, peso, cor, raça)
- ✅ Status reprodutivo
- ✅ Histórico de saúde
- ✅ Histórico reprodutivo
- ✅ Genealogia completa
- ✅ Foto do animal
- ✅ Observações

### 6. **Genealogia**
- ✅ Árvore genealógica
- ✅ Pais e avós
- ✅ Lista de descendentes
- ✅ Registros oficiais
- ✅ Navegação intuitiva

### 7. **Estatísticas e Relatórios**
- ✅ Dashboard completo
- ✅ Estatísticas reprodutivas
- ✅ Taxa de sucesso
- ✅ Gráficos de status dos embriões
- ✅ Próximos eventos
- ✅ Indicadores de performance
- ✅ Filtros por período

## 🏗️ Arquitetura

### Estrutura de Diretórios
```
app/
├── modules/
│   └── haras/
│       ├── screens/           # Telas do módulo
│       │   ├── HarasMainScreen.tsx
│       │   ├── EmbriaoScreen.tsx
│       │   ├── ManejoReprodutivoScreen.tsx
│       │   ├── AgendaReprodutivaScreen.tsx
│       │   ├── SaudeAnimalScreen.tsx
│       │   ├── DetalheCavaloScreen.tsx
│       │   ├── EstatisticasScreen.tsx
│       │   └── index.ts
│       ├── services/          # Serviços e API
│       │   └── animalService.ts
│       └── types/             # Tipos TypeScript
│           └── index.ts
└── tabs/
    └── (tabs)/
        └── reproducao.tsx     # Integração com navegação
```

### Tipos Principais
- `Animal` - Dados básicos do animal
- `Garanhao` - Especialização para garanhões
- `Doadora` - Especialização para doadoras
- `Receptora` - Especialização para receptoras
- `RegistroEmbriao` - Gestão de embriões
- `RegistroSaude` - Controle de saúde
- `ManejoReprodutivo` - Manejo reprodutivo
- `AgendaReprodutiva` - Agenda de eventos
- `Genealogia` - Árvore genealógica

## 🔧 Serviços Implementados

### animalService.ts
Serviço completo com 29 métodos para:

**Animais:**
- CRUD completo de animais
- Filtros avançados
- Busca por critérios

**Embriões:**
- Gestão completa de embriões
- Transferências
- Controle de status

**Saúde:**
- Registros médicos
- Vacinas e medicamentos
- Histórico completo

**Reprodução:**
- Manejo reprodutivo
- Agenda de eventos
- Estatísticas

**Genealogia:**
- Árvore genealógica
- Descendentes
- Relacionamentos

### cavaloService.ts 🆕
Serviço especializado para gestão de cavalos com integração aos endpoints REST:

**Endpoints Integrados:**
- `GET /haras-pro/haras/:harasId/horses` - Lista todos os cavalos do haras
- `GET /haras-pro/haras/:harasId/horses/available` - Lista cavalos disponíveis (sem baia)
- `GET /haras-pro/haras/:harasId/horses/stats` - Estatísticas dos cavalos
- `POST /haras-pro/horses` - Criar novo cavalo
- `GET /haras-pro/horses/:id` - Buscar cavalo por ID
- `PUT /haras-pro/horses/:id` - Atualizar cavalo
- `DELETE /haras-pro/horses/:id` - Excluir cavalo

**Funcionalidades:**
- CRUD completo de cavalos
- Busca de cavalos disponíveis
- Estatísticas detalhadas
- Integração com sistema de baias
- Tratamento de erros
- Tipagem completa com TypeScript

**Reprodução:**

## 🎨 Interface

### Design System
- **Cores:** Tema verde (HarasPro) consistente
- **Ícones:** Feather Icons
- **Layout:** Cards, modais e navegação por tabs
- **UX:** Interface intuitiva baseada no VaquejadaPro

### Funcionalidades de UX
- ✅ Pull-to-refresh
- ✅ Loading states
- ✅ Empty states
- ✅ Confirmação de ações
- ✅ Validação de formulários
- ✅ Feedback visual
- ✅ Navegação fluida

## 🔐 Integração

### Backend
- ✅ Autenticação JWT
- ✅ Interceptor de requisições
- ✅ Tratamento de erros
- ✅ API RESTful

### Navegação
- ✅ Integração com Expo Router
- ✅ Navegação por tabs
- ✅ Modais e stacks
- ✅ Deep linking ready

## 📱 Telas Implementadas

1. **HarasMainScreen** - Tela principal com menu e dashboard
2. **CavalosScreen** - Gestão completa do plantel
3. **CavalosDisponiveisScreen** - Cavalos sem baia 🆕
4. **EmbriaoScreen** - Gestão de embriões
5. **ManejoReprodutivoScreen** - Manejo reprodutivo
6. **AgendaReprodutivaScreen** - Agenda de eventos
7. **SaudeAnimalScreen** - Saúde animal
8. **DetalheCavaloScreen** - Detalhes do animal
9. **EstatisticasScreen** - Estatísticas e relatórios

## 🧭 Como Navegar

### Menu Principal (HarasMainScreen)
1. **Cards Principais** - Acesso direto às funcionalidades
   - Cavalos do Haras → CavalosScreen
   - Gestão de Embriões → EmbriaoScreen
   - Manejo Reprodutivo → ManejoReprodutivoScreen
   - Agenda Reprodutiva → AgendaReprodutivaScreen
   - Saúde Animal → SaudeAnimalScreen
   - Relatórios → EstatisticasScreen

2. **Ações Rápidas** 🆕
   - **Cavalos Disponíveis** → CavalosDisponiveisScreen
   - Buscar Animal → DetalheCavaloScreen
   - Novo Evento → AgendaReprodutivaScreen

### Tela de Cavalos Disponíveis
- **Acesso**: Menu Principal → "Cavalos Disponíveis" (botão verde)
- **Funcionalidade**: Lista apenas cavalos sem baia alocada
- **Ação Principal**: Botão "Alocar Baia" para cada cavalo
- **Filtros**: Por categoria (Garanhão, Doadora, Receptora, Potro)
- **Stats**: Contadores rápidos por categoria

## 🚀 Como Usar

1. **Navegação**: Acesse a aba "Reprodução"
2. **Menu Principal**: Escolha a funcionalidade desejada
3. **Gestão**: Use os botões + para adicionar novos registros
4. **Filtros**: Use as abas para filtrar informações
5. **Detalhes**: Toque nos cards para ver/editar detalhes

## 🔄 Status do Projeto

### ✅ Concluído
- Todas as telas implementadas
- Tipos TypeScript completos
- Serviços integrados
- Interface responsiva
- Navegação funcional

### 🔄 Próximos Passos
- Integração real com backend
- Testes unitários
- Otimizações de performance
- Sincronização offline
- Notificações push

## 📋 Funcionalidades Baseadas no VaquejadaPro

Todas as funcionalidades foram inspiradas e baseadas no VaquejadaPro:

- ✅ **RegistrarEmbriaoScreen** → EmbriaoScreen
- ✅ **ManejoReprodutivoScreen** → ManejoReprodutivoScreen
- ✅ **AgendaReprodutivaScreen** → AgendaReprodutivaScreen
- ✅ **DetalheCavaloScreen** → DetalheCavaloScreen
- ✅ **Estatísticas** → EstatisticasScreen
- ✅ **Saúde Animal** → SaudeAnimalScreen

## 🛠️ Tecnologias

- **React Native** + **Expo**
- **TypeScript** para tipagem
- **Expo Router** para navegação
- **Feather Icons** para ícones
- **AsyncStorage** para cache local
- **Axios** para requisições HTTP

---

**HarasPro** - Sistema completo de gestão reprodutiva para haras 🐎
