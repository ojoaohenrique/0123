# 🚓 Sistema de Controle de Viaturas - GML

Sistema web para gestão e monitoramento de viaturas da Guarda Municipal de Laguna.

## 🚀 Deploy na Vercel

### Pré-requisitos
1. Conta no [Vercel](https://vercel.com)
2. Conta no [GitHub](https://github.com) (opcional, mas recomendado)
3. Projeto Firebase configurado

### Método 1: Deploy via GitHub (Recomendado)

1. **Criar repositório no GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Sistema GML"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/gml-viaturas.git
   git push -u origin main
   ```

2. **Conectar com Vercel**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Importe seu repositório do GitHub
   - Clique em "Deploy"

3. **Configurar Variáveis de Ambiente (Opcional)**
   - No painel da Vercel, vá em Settings > Environment Variables
   - Adicione suas credenciais do Firebase como variáveis de ambiente

### Método 2: Deploy via Vercel CLI

1. **Instalar Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Fazer Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd c:\Users\joaoh\Desktop\gml
   vercel
   ```

4. **Seguir as instruções**
   - Confirme o diretório do projeto
   - Escolha um nome para o projeto
   - Aguarde o deploy

### Método 3: Deploy Manual (Arrastar e Soltar)

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Arraste a pasta `gml` para a área de upload
3. Aguarde o deploy automático

## ⚙️ Configuração Pós-Deploy

### 1. Configurar Firebase
Após o deploy, você precisa:
1. Criar projeto no Firebase Console
2. Ativar Authentication (Email/Password)
3. Criar Firestore Database
4. Ativar Storage
5. Copiar as credenciais

### 2. Atualizar Credenciais
Edite o arquivo `index.viaturas.html` linha 674 com suas credenciais:
```javascript
const firebaseConfig = {
    apiKey: "sua-api-key",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto-id",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789",
    appId: "seu-app-id"
};
```

### 3. Fazer Commit e Push
```bash
git add index.viaturas.html
git commit -m "Adicionar credenciais Firebase"
git push
```

A Vercel fará o redeploy automaticamente!

## 🔐 Segurança

### Proteger Credenciais do Firebase

**Opção 1: Variáveis de Ambiente (Recomendado)**

1. Crie arquivo `.env.local`:
```env
VITE_FIREBASE_API_KEY=sua-api-key
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
```

2. Configure na Vercel:
   - Settings > Environment Variables
   - Adicione cada variável

**Opção 2: Firebase App Check**
- Ative no Firebase Console
- Adicione seu domínio Vercel à lista de domínios autorizados

## 📁 Estrutura do Projeto

```
gml/
├── index.viaturas.html    # Página principal
├── viaturas.js           # Lógica JavaScript
├── vercel.json           # Configuração Vercel
├── README.md             # Este arquivo
├── CONFIGURACAO_FIREBASE.md  # Guia Firebase
└── .gitignore            # Arquivos ignorados
```

## 🌐 Domínio Personalizado

Para usar um domínio próprio:
1. No painel da Vercel, vá em Settings > Domains
2. Adicione seu domínio (ex: `viaturas.gml.gov.br`)
3. Configure os DNS conforme instruções da Vercel

## 📊 Funcionalidades

- ✅ Autenticação de usuários
- ✅ Registro de saída de viaturas
- ✅ Registro de chegada com fotos
- ✅ Controle de abastecimento
- ✅ Cálculo automático de KM rodado
- ✅ Cálculo de média de consumo
- ✅ Upload de fotos
- ✅ Observações por viagem
- ✅ Histórico completo
- ✅ Interface responsiva

## 🛠️ Tecnologias

- HTML5
- CSS3 (Design moderno com gradientes)
- JavaScript Vanilla
- Firebase (Authentication, Firestore, Storage)
- Vercel (Hospedagem)

## 📞 Suporte

- Documentação Vercel: https://vercel.com/docs
- Documentação Firebase: https://firebase.google.com/docs
- Console Vercel: https://vercel.com/dashboard

## 📝 Licença

© 2025 Guarda Municipal de Laguna - Todos os direitos reservados
