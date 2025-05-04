# Projeto FURIA Fan Engagement 🔥🐾

Plataforma de engajamento para fãs da FURIA, oferecendo um Webchat em tempo real e um Bot do Telegram informativo.

## O que é este Projeto?

Este projeto combina duas interfaces principais para conectar os fãs da FURIA:

1.  **Webchat Interativo (`frontend/`):** Uma aplicação web construída com React e Firebase onde os usuários podem se cadastrar, fazer login, escolher salas de chat e conversar em tempo real.
2.  **Bot do Telegram Informativo (`api/`):** Um bot para Telegram que fornece informações rápidas sobre o time de CS:GO da FURIA (elenco, agenda, redes sociais) e direciona os usuários para o webchat. Ele utiliza uma API de suporte interna para buscar esses dados.

## Funcionalidades Principais

* **Webchat:**
    * ✅ Autenticação de usuários (Cadastro e Login com username/senha).
    * ✅ Seleção de salas de chat temáticas.
    * ✅ Troca de mensagens em tempo real dentro das salas.
    * ✅ Interface de usuário inspirada na FURIA.
    * ✅ Backend robusto com Firebase (Firestore e Authentication).
* **Telegram Bot:**
    * ✅ Comandos para obter informações: `/elenco`, `/agenda`, `/redes`.
    * ✅ Comando `/start` com menu de botões inline.
    * ✅ Comando `/webchat` com link direto para a aplicação web.
    * ✅ Interação via Telegram.
* **API de Suporte (Interna):**
    * ✅ Endpoints para fornecer dados estáticos (elenco, agenda, etc.) ao bot.
    * ✅ Construída com Node.js e Express.


* Veja os READMEs dentro das pastas `frontend/` e `api/` para detalhes específicos de cada parte.

## Tecnologias Utilizadas

* **Frontend:** React, Vite, JavaScript, CSS, Firebase SDK (Auth, Firestore), React Router DOM, date-fns.
* **Backend (API & Bot):** Node.js, Express.js, Telegraf.js, Axios, dotenv, cors.
* **Banco de Dados/BaaS:** Firebase (Firestore, Authentication).
* **Linguagem:** JavaScript (Frontend e Backend).

## Pré-requisitos

Antes de começar, garanta que você tem instalado:

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (versão LTS recomendada)
* [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

Você também precisará de:

* Uma conta no [Firebase](https://firebase.google.com/) para criar um projeto e obter as credenciais para o frontend.
* Uma conta no [Telegram](https://telegram.org/) e ter criado um bot via [@BotFather](https://t.me/botfather) para obter o Token do Bot para o backend.

## Instalação e Configuração

1.  **Clone o Repositório:**
    ```bash
    git clone [https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git](https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git)
    cd SEU_REPOSITORIO
    ```

2.  **Configure o Backend (`api/`):**
    * Navegue até a pasta da API:
      ```bash
      cd api
      ```
    * Instale as dependências:
      ```bash
      npm install
      # ou
      yarn install
      ```
    * Crie o arquivo de variáveis de ambiente `.env` dentro da pasta `api/`:
      ```dotenv
      # api/.env
      TELEGRAM_BOT_TOKEN=COLE_SEU_TOKEN_DO_BOTFATHER_AQUI

      # Opcional: Defina a porta da API Express (padrão é 3000)
      # PORT=3001

      # Opcional/Recomendado: URL da API para o bot usar (se diferente de localhost:3000)
      # API_URL=http://localhost:3000
      ```
    * ⚠️ **Nota:** A API atualmente serve dados *hardcoded*. Para dados dinâmicos, edite os arquivos em `api/routes/`.

3.  **Configure o Frontend (`frontend/`):**
    * Volte para a raiz e navegue até a pasta do frontend:
      ```bash
      cd ../frontend
      # ou 'cd frontend' se estiver na raiz
      ```
    * Instale as dependências:
      ```bash
      npm install
      # ou
      yarn install
      ```
    * Crie o arquivo de variáveis de ambiente `.env` dentro da pasta `frontend/`. Obtenha os valores do seu projeto Firebase (Configurações do Projeto > Geral > Seus apps > Configuração do SDK):
      ```dotenv
      # frontend/.env
      VITE_FIREBASE_API_KEY=SUA_API_KEY
      VITE_FIREBASE_AUTH_DOMAIN=SEU_AUTH_DOMAIN
      VITE_FIREBASE_PROJECT_ID=SEU_PROJECT_ID
      VITE_FIREBASE_STORAGE_BUCKET=SEU_STORAGE_BUCKET
      VITE_FIREBASE_MESSAGING_SENDER_ID=SEU_MESSAGING_SENDER_ID
      VITE_FIREBASE_APP_ID=SEU_APP_ID
      ```

## Como Rodar o Projeto Completo

Para rodar a aplicação completa, você precisará iniciar os três componentes principais (API, Bot, Frontend), preferencialmente em terminais separados:

1.  **Terminal 1: Iniciar a API de Suporte**
    ```bash
    cd api
    npm start
    # ou para desenvolvimento: nodemon server.js
    ```
    *(Verifique se você tem um script "start" no `api/package.json` ou use `node server.js`)*

2.  **Terminal 2: Iniciar o Bot do Telegram**
    ```bash
    cd api
    node bots/telegram/bot.js
    # ou para desenvolvimento: nodemon bots/telegram/bot.js
    ```
    *(Ajuste o caminho para `bot.js` se necessário)*

3.  **Terminal 3: Iniciar o Frontend (Webchat)**
    ```bash
    cd frontend
    npm run dev
    ```

**Acessando a Aplicação:**

* **Webchat:** Abra seu navegador e acesse `http://localhost:5173` (ou a porta indicada pelo Vite).
* **Telegram Bot:** Encontre seu bot no Telegram (o nome que você deu no BotFather) e envie comandos como `/start`.

## Contribuição

Contribuições são bem-vindas! Se você encontrar bugs ou tiver sugestões, por favor, abra uma *Issue* no repositório. Para contribuir com código:

1.  Faça um Fork do projeto.
2.  Crie uma Branch para sua feature (`git checkout -b feature/MinhaFeature`).
3.  Faça Commit de suas mudanças (`git commit -m 'Adiciona MinhaFeature'`).
4.  Faça Push para a Branch (`git push origin feature/MinhaFeature`).
5.  Abra um Pull Request.

## Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

## Estrutura do Projeto

O projeto está organizado em duas pastas principais na raiz:
```plaintext
furia-chat/
├── api/                  # Backend e Bot Telegram
│   ├── bots/telegram/    # Handlers do bot
│   ├── routes/           # Endpoints API
│   ├── server.js         # Servidor principal
│   └── .env              # Variáveis de ambiente
└── frontend/             # Aplicação WebChat
    ├── src/              # Código React
    ├── public/           # Assets estáticos
    └── vite.config.js    # Config Vite


