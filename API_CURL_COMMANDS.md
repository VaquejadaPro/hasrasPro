# 🚀 API Curl Commands - Sistema de Haras

## 🔐 Autenticação

### Login
```bash
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "haraspalmery@gmail.com",
    "password": "123456"
  }'
```

### Resposta:
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "userId",
    "email": "email@example.com",
    "role": "haras"
  }
}
```

---

## 🏡 Gestão de Haras

### Listar Haras do Usuário
```bash
curl -X GET "http://localhost:3000/api/haras-pro/haras" \
  -H "Authorization: Bearer {TOKEN}"
```

### Criar Haras
```bash
curl -X POST "http://localhost:3000/api/haras-pro/haras" \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Haras Santa Maria",
    "description": "Haras especializado em cavalos de corrida",
    "address": "Rua das Flores, 123",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567",
    "phone": "(11) 99999-9999",
    "email": "contato@harassantamaria.com"
  }'
```

### Obter Haras por ID
```bash
curl -X GET "http://localhost:3000/api/haras-pro/haras/{harasId}" \
  -H "Authorization: Bearer {TOKEN}"
```

---

## 🏠 Gestão de Baias

### Listar Baias do Haras
```bash
curl -X GET "http://localhost:3000/api/haras-pro/haras/{harasId}/stalls" \
  -H "Authorization: Bearer {TOKEN}"
```

### Listar Baias Disponíveis
```bash
curl -X GET "http://localhost:3000/api/haras-pro/haras/{harasId}/stalls/available" \
  -H "Authorization: Bearer {TOKEN}"
```

### Criar Baia
```bash
curl -X POST "http://localhost:3000/api/haras-pro/stalls" \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "harasId": "{harasId}",
    "number": "A21",
    "name": "Baia A21",
    "dimensions": "4x4m",
    "description": "Baia padrão para cavalos adultos"
  }'
```

### Obter Baia por ID
```bash
curl -X GET "http://localhost:3000/api/haras-pro/stalls/{stallId}" \
  -H "Authorization: Bearer {TOKEN}"
```

---

## 🐎 Gestão de Cavalos

### Listar Cavalos do Haras
```bash
curl -X GET "http://localhost:3000/api/haras-pro/haras/{harasId}/horses" \
  -H "Authorization: Bearer {TOKEN}"
```

### Criar Cavalo
```bash
curl -X POST "http://localhost:3000/api/haras-pro/horses" \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "haras_id": "{harasId}",
    "name": "Thunder Bolt",
    "breed": "Quarto de Milha",
    "color": "Alazão",
    "gender": "male",
    "birthDate": "2020-05-15",
    "registration": "QM123456",
    "dailyFeedConsumption": 6,
    "feedType": "Performance",
    "feedNotes": "Cavalo de competição - 6kg/dia"
  }'
```

### Obter Cavalo por ID
```bash
curl -X GET "http://localhost:3000/api/haras-pro/horses/{horseId}" \
  -H "Authorization: Bearer {TOKEN}"
```

### Atualizar Cavalo
```bash
curl -X PUT "http://localhost:3000/api/haras-pro/horses/{horseId}" \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Thunder Bolt Updated",
    "dailyFeedConsumption": 7,
    "feedType": "Performance Plus"
  }'
```

### 🎯 Mover Cavalo para Baia (ATIVA CONSUMO AUTOMATICAMENTE)
```bash
curl -X PUT "http://localhost:3000/api/haras-pro/horses/{horseId}/assign-stall" \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "stallId": "{stallId}"
  }'
```

### Resposta (com consumo ativado):
```json
{
  "status": "success",
  "message": "Horse assigned to stall successfully (consumo ativado automaticamente)",
  "data": {
    "horse": {
      "horseId": "...",
      "toStallId": "...",
      "feedActivated": true,
      "feedActivationDetails": {
        "dailyConsumption": 6,
        "feedType": "Performance",
        "startDate": "2025-06-24T..."
      }
    },
    "feedActivated": true
  }
}
```

### Remover Cavalo da Baia
```bash
curl -X PUT "http://localhost:3000/api/haras-pro/horses/{horseId}/remove-stall" \
  -H "Authorization: Bearer {TOKEN}"
```

---

## 🍽️ Gestão de Estoque de Ração

### Listar Estoque de Ração
```bash
curl -X GET "http://localhost:3000/api/haras-pro/haras/{harasId}/feed-stock" \
  -H "Authorization: Bearer {TOKEN}"
```

### Criar Item de Estoque
```bash
curl -X POST "http://localhost:3000/api/haras-pro/feed-stock" \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "harasId": "{harasId}",
    "feedName": "Ração Performance",
    "feedType": "grain",
    "currentQuantity": 50,
    "unit": "sacos",
    "costPerUnit": 125.00,
    "minThreshold": 10,
    "maxThreshold": 200,
    "supplier": "Nutri Equinos Ltda",
    "location": "Galpão A",
    "expirationDate": "2025-12-31"
  }'
```

### Atualizar Estoque
```bash
curl -X PUT "http://localhost:3000/api/haras-pro/feed-stock/{stockId}" \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "currentQuantity": 45,
    "costPerUnit": 130.00
  }'
```

### Obter Alertas de Estoque Baixo
```bash
curl -X GET "http://localhost:3000/api/haras-pro/haras/{harasId}/feed-stock/alerts" \
  -H "Authorization: Bearer {TOKEN}"
```

---

## 🔄 Consumo Automático de Ração

### Executar Consumo Diário Manual
```bash
curl -X POST "http://localhost:3000/api/haras-pro/feed-consumption/process-daily/{harasId}" \
  -H "Authorization: Bearer {TOKEN}"
```

### Obter Relatório de Consumo Diário
```bash
curl -X GET "http://localhost:3000/api/haras-pro/feed-consumption/daily-report/{harasId}" \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-06-24"
  }'
```

### Listar Cavalos Consumindo Ativamente
```bash
curl -X GET "http://localhost:3000/api/haras-pro/haras/{harasId}/horses/active-consumers" \
  -H "Authorization: Bearer {TOKEN}"
```

---

## 💰 Relatórios Financeiros

### Listar Relatórios Financeiros
```bash
curl -X GET "http://localhost:3000/api/haras-pro/haras/{harasId}/financial-reports" \
  -H "Authorization: Bearer {TOKEN}"
```

### Criar Relatório Financeiro
```bash
curl -X POST "http://localhost:3000/api/haras-pro/financial-reports" \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "harasId": "{harasId}",
    "reportType": "monthly",
    "startDate": "2025-06-01",
    "endDate": "2025-06-30",
    "title": "Relatório Mensal - Junho 2025"
  }'
```

### Gerar Relatório de Custos por Cavalo
```bash
curl -X POST "http://localhost:3000/api/haras-pro/financial-reports/horse-costs" \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "harasId": "{harasId}",
    "horseId": "{horseId}",
    "startDate": "2025-06-01",
    "endDate": "2025-06-30"
  }'
```

---

## 🏥 Farmácia Veterinária

### Listar Medicamentos
```bash
curl -X GET "http://localhost:3000/api/haras-pro/haras/{harasId}/veterinary/medicines" \
  -H "Authorization: Bearer {TOKEN}"
```

### Criar Medicamento
```bash
curl -X POST "http://localhost:3000/api/haras-pro/veterinary/medicines" \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "harasId": "{harasId}",
    "name": "Ivermectina",
    "type": "antiparasitário",
    "dosage": "1ml por 50kg",
    "currentStock": 10,
    "unit": "frascos",
    "minThreshold": 2,
    "expirationDate": "2025-12-31",
    "supplier": "Farmácia Veterinária ABC"
  }'
```

### Registrar Tratamento
```bash
curl -X POST "http://localhost:3000/api/haras-pro/veterinary/treatments" \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "harasId": "{harasId}",
    "horseId": "{horseId}",
    "diagnosis": "Verminose",
    "treatment": "Vermifugação",
    "medications": [
      {
        "medicineId": "{medicineId}",
        "dosage": "1ml",
        "frequency": "dose única",
        "duration": "1 dia"
      }
    ],
    "veterinarian": "Dr. João Silva",
    "notes": "Cavalo respondeu bem ao tratamento"
  }'
```

---

## 🍽️ Dietas dos Cavalos

### Listar Dietas do Haras
```bash
curl -X GET "http://localhost:3000/api/haras-pro/haras/{harasId}/horse-diets" \
  -H "Authorization: Bearer {TOKEN}"
```

### Criar Dieta para Cavalo
```bash
curl -X POST "http://localhost:3000/api/haras-pro/horse-diets" \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "harasId": "{harasId}",
    "horseId": "{horseId}",
    "dietName": "Dieta Performance",
    "dailyCalories": 25000,
    "items": [
      {
        "feedType": "Ração Performance",
        "quantity": 6,
        "unit": "kg",
        "feedingTimes": ["07:00", "12:00", "18:00"]
      },
      {
        "feedType": "Feno",
        "quantity": 8,
        "unit": "kg",
        "feedingTimes": ["06:00", "14:00", "20:00"]
      }
    ]
  }'
```

---

## 📊 Endpoints de Dashboard

### Obter Estatísticas do Haras
```bash
curl -X GET "http://localhost:3000/api/haras-pro/haras/{harasId}/stats" \
  -H "Authorization: Bearer {TOKEN}"
```

### Obter Resumo de Consumo do Mês
```bash
curl -X GET "http://localhost:3000/api/haras-pro/haras/{harasId}/consumption-summary" \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "month": "2025-06"
  }'
```

---

## 🔍 Endpoints de Busca

### Buscar Cavalos
```bash
curl -X GET "http://localhost:3000/api/haras-pro/haras/{harasId}/horses/search?q=Thunder" \
  -H "Authorization: Bearer {TOKEN}"
```

### Buscar Baias
```bash
curl -X GET "http://localhost:3000/api/haras-pro/haras/{harasId}/stalls/search?q=A1" \
  -H "Authorization: Bearer {TOKEN}"
```

---

## 🎯 Fluxo Principal para o Frontend

### 1. Login e Obter Token
```bash
TOKEN=$(curl -s -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' | jq -r '.token')
```

### 2. Listar Haras do Usuário
```bash
curl -X GET "http://localhost:3000/api/haras-pro/haras" \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Obter Dados do Haras (Cavalos, Baias, Estoque)
```bash
# Cavalos
curl -X GET "http://localhost:3000/api/haras-pro/haras/{harasId}/horses" \
  -H "Authorization: Bearer $TOKEN"

# Baias
curl -X GET "http://localhost:3000/api/haras-pro/haras/{harasId}/stalls" \
  -H "Authorization: Bearer $TOKEN"

# Estoque
curl -X GET "http://localhost:3000/api/haras-pro/haras/{harasId}/feed-stock" \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Mover Cavalo (Ativa Consumo Automaticamente)
```bash
curl -X PUT "http://localhost:3000/api/haras-pro/horses/{horseId}/assign-stall" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"stallId":"{stallId}"}'
```

### 5. Verificar Status de Consumo
```bash
curl -X GET "http://localhost:3000/api/haras-pro/horses/{horseId}" \
  -H "Authorization: Bearer $TOKEN"
```

---

**🎉 Todos os endpoints estão prontos para integração com o frontend!**

**⚠️ Lembre-se de substituir:**
- `{TOKEN}` pelo token de autenticação
- `{harasId}` pelo ID do haras
- `{horseId}` pelo ID do cavalo
- `{stallId}` pelo ID da baia
- `http://localhost:3000` pela URL do seu servidor
