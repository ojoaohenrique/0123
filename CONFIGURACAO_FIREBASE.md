# 🔥 Configuração do Firebase - Sistema GML

## 📋 Passo a Passo

### 1. Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Nome do projeto: `gml-viaturas` (ou outro de sua preferência)
4. Siga os passos e crie o projeto

### 2. Configurar Autenticação

1. No menu lateral, clique em **Authentication**
2. Clique em "Começar"
3. Ative o método **E-mail/Senha**
4. Na aba "Users", clique em "Adicionar usuário"
5. Crie um usuário com e-mail e senha (ex: `admin@gml.com` / `senha123`)

### 3. Configurar Firestore Database

1. No menu lateral, clique em **Firestore Database**
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste" (ou configure regras personalizadas)
4. Escolha a localização (ex: `southamerica-east1` para São Paulo)

**Regras de Segurança Recomendadas:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Apenas usuários autenticados podem ler/escrever
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Configurar Storage (para fotos)

1. No menu lateral, clique em **Storage**
2. Clique em "Começar"
3. Aceite as regras padrão

**Regras de Segurança Recomendadas:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /viaturas/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
                   && request.resource.size < 5 * 1024 * 1024  // 5MB max
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

### 5. Obter Credenciais do Projeto

1. Clique no ícone de engrenagem ⚙️ > **Configurações do projeto**
2. Role até "Seus aplicativos"
3. Clique no ícone **</>** (Web)
4. Registre o app com nome "GML Web"
5. Copie as credenciais que aparecem

### 6. Configurar no Código

Abra o arquivo `index.viaturas.html` e localize a linha 674:

```javascript
const firebaseConfig = {
    apiKey: "SUA_API_KEY_AQUI",
    authDomain: "SEU_PROJECT_ID.firebaseapp.com",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_PROJECT_ID.appspot.com",
    messagingSenderId: "SEU_SENDER_ID",
    appId: "SEU_APP_ID"
};
```

**Substitua** pelos valores que você copiou do Firebase.

### 7. Criar Coleção de Viaturas (Opcional - para automação de KM)

No Firestore, crie manualmente a coleção `viaturas` com documentos:

**Documento: `VTR 0109`**
```json
{
  "kmAtual": 50000,
  "placa": "ABC-1234",
  "modelo": "Fiat Strada"
}
```

**Documento: `VTR 0110`**
```json
{
  "kmAtual": 75000,
  "placa": "DEF-5678",
  "modelo": "Chevrolet S10"
}
```

**Documento: `VTR 0111`**
```json
{
  "kmAtual": 30000,
  "placa": "GHI-9012",
  "modelo": "Toyota Hilux"
}
```

## 🎯 Estrutura das Coleções

### Coleção: `saidas`
```javascript
{
  viatura: "VTR 0109",
  dataSaida: Timestamp,
  kmSaida: 50000,
  motorista: "DUARTE",
  protocolo: 12345,
  coordenador: "INSP MAIK",
  patrulhamento: "Ronda Preventiva",
  kmChegada: 50150,  // null se ainda não voltou
  observacoes: "Sem ocorrências",
  fotos: ["url1", "url2"]  // URLs do Storage
}
```

### Coleção: `abastecimentos`
```javascript
{
  viatura: "VTR 0109",
  dataAbastecimento: Timestamp,
  kmAbastecimento: 49500,
  kmAtual: 50000,
  kmRodado: 500,
  litros: 40.5,
  media: "12.35 KM/L",
  motorista: "DUARTE"
}
```

### Coleção: `viaturas`
```javascript
{
  kmAtual: 50000,
  placa: "ABC-1234",
  modelo: "Fiat Strada",
  ultimaAtualizacao: Timestamp
}
```

## ✅ Testar o Sistema

1. Abra o arquivo `index.viaturas.html` no navegador
2. Faça login com o usuário criado
3. Teste registrar uma saída de viatura
4. Verifique no Firestore Console se os dados foram salvos
5. Teste o abastecimento
6. Teste o registro de volta com fotos

## 🔐 Segurança

⚠️ **IMPORTANTE**: Nunca compartilhe suas credenciais do Firebase publicamente!

Se você for versionar o código no Git, crie um arquivo `.gitignore`:
```
# Não versionar credenciais
firebase-config.js
```

E mova as credenciais para um arquivo separado.

## 📞 Suporte

Em caso de dúvidas:
- Documentação Firebase: https://firebase.google.com/docs
- Console Firebase: https://console.firebase.google.com/
