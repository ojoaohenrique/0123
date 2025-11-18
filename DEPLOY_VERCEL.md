# 🚀 Guia Rápido: Deploy na Vercel

## Método Mais Simples (Arrastar e Soltar)

### Passo 1: Preparar o Projeto
✅ Já está pronto! Todos os arquivos necessários estão na pasta `gml`.

### Passo 2: Criar Conta na Vercel
1. Acesse: https://vercel.com/signup
2. Cadastre-se com GitHub, GitLab ou Email
3. Confirme seu email

### Passo 3: Fazer Deploy
1. Acesse: https://vercel.com/new
2. **Arraste a pasta `gml`** para a área de upload
3. Aguarde o upload (alguns segundos)
4. Clique em **"Deploy"**
5. Pronto! Em 30 segundos seu site estará no ar

### Passo 4: Acessar seu Site
Após o deploy, você receberá um link como:
```
https://gml-viaturas.vercel.app
```

## ⚠️ IMPORTANTE: Configurar Firebase

Seu site está no ar, mas **ainda não funciona** porque precisa do Firebase!

### O que fazer agora:

1. **Criar projeto Firebase** (5 minutos)
   - Acesse: https://console.firebase.google.com
   - Clique em "Adicionar projeto"
   - Nome: `gml-viaturas`
   - Siga os passos

2. **Ativar Authentication**
   - No menu lateral: Authentication
   - Clique em "Começar"
   - Ative "E-mail/Senha"
   - Adicione um usuário (ex: `admin@gml.com` / `senha123`)

3. **Ativar Firestore**
   - No menu lateral: Firestore Database
   - Clique em "Criar banco de dados"
   - Modo: "Teste" (ou configure regras)
   - Localização: `southamerica-east1`

4. **Ativar Storage**
   - No menu lateral: Storage
   - Clique em "Começar"
   - Aceite as regras padrão

5. **Copiar Credenciais**
   - Clique na engrenagem ⚙️ > Configurações do projeto
   - Role até "Seus aplicativos"
   - Clique em `</>` (Web)
   - Copie as credenciais

6. **Atualizar o Código**
   - Abra `index.viaturas.html` no VS Code
   - Vá até a linha 674
   - Cole suas credenciais do Firebase
   - Salve o arquivo

7. **Fazer Redeploy**
   - Volte para https://vercel.com/dashboard
   - Clique no seu projeto
   - Arraste o arquivo `index.viaturas.html` atualizado
   - Ou use o botão "Redeploy"

## ✅ Pronto!

Agora seu sistema está 100% funcional:
- 🔐 Login funcionando
- 💾 Dados salvos no Firebase
- 📸 Upload de fotos
- 🌐 Acessível de qualquer lugar

## 🎯 URL Final

Seu sistema estará disponível em:
```
https://seu-projeto.vercel.app
```

Para usar um domínio personalizado (ex: `viaturas.gml.gov.br`):
1. No painel da Vercel: Settings > Domains
2. Adicione seu domínio
3. Configure o DNS conforme instruções

## 📱 Testar

1. Abra o link do Vercel no navegador
2. Faça login com o usuário que criou no Firebase
3. Registre uma saída de viatura
4. Verifique no Firebase Console se os dados foram salvos

## 🆘 Problemas Comuns

### "Erro ao fazer login"
- Verifique se copiou as credenciais corretamente
- Verifique se criou um usuário no Firebase Authentication

### "Não carrega os dados"
- Verifique se o Firestore está ativado
- Verifique as regras de segurança do Firestore

### "Erro ao enviar foto"
- Verifique se o Storage está ativado
- Verifique as regras de segurança do Storage

## 💡 Dica

Salve o link do seu projeto:
- Vercel Dashboard: https://vercel.com/dashboard
- Firebase Console: https://console.firebase.google.com
- Seu Site: https://seu-projeto.vercel.app

---

**Tempo total estimado: 15 minutos** ⏱️
