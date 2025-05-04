# API de Suporte - Bot Telegram FURIA 🐾

Esta é uma API simples desenvolvida com Node.js e Express, criada para fornecer dados estáticos sobre a FURIA (elenco, agenda, redes sociais, link do webchat) para o bot do Telegram associado.

## Visão Geral

A API expõe endpoints `GET` que retornam informações em formato JSON. Atualmente, os dados retornados estão *hardcoded* (fixos no código) dentro de cada arquivo de rota.

## Tecnologias Utilizadas

* **Runtime:** [Node.js](https://nodejs.org/)
* **Framework:** [Express.js](https://expressjs.com/)
* **Middleware:** [cors](https://www.npmjs.com/package/cors) (para permitir requisições de outras origens)
* **Gerenciamento de Variáveis de Ambiente:** [dotenv](https://github.com/motdotla/dotenv) (usado no `server.js` principalmente para a porta)

## Endpoints da API

Todos os endpoints são do tipo `GET`.

### 1. `/elenco`

Retorna a lista atual de jogadores do time de CS:GO da FURIA.

* **Método:** `GET`
* **Path:** `/elenco`
* **Resposta (Exemplo):** `200 OK`
    ```json
    [
      { "nome": "KSCERATO", "posicao": "Rifler" },
      { "nome": "yuurih", "posicao": "Rifler" },
      { "nome": "arT", "posicao": "In-Game Leader (IGL)" },
      { "nome": "chelo", "posicao": "Entry Fragger" },
      { "nome": "saffee", "posicao": "AWPer" }
    ]
    ```

### 2. `/agenda`

Retorna a lista de próximos eventos/jogos agendados.

* **Método:** `GET`
* **Path:** `/agenda`
* **Resposta (Exemplo):** `200 OK`
    ```json
    [
      { "data": "10/05/2025", "evento": "IEM Dallas - vs. Team Liquid" },
      { "data": "12/05/2025", "evento": "BLAST Showmatch" }
    ]
    ```

### 3. `/redes`

Retorna os links das redes sociais oficiais da FURIA.

* **Método:** `GET`
* **Path:** `/redes`
* **Resposta (Exemplo):** `200 OK`
    ```json
    {
      "instagram": "[https://instagram.com/furiagg](https://instagram.com/furiagg)",
      "twitter": "[https://twitter.com/furiagg](https://twitter.com/furiagg)",
      "twitch": "[https://twitch.tv/furia](https://twitch.tv/furia)",
      "youtube": "[https://youtube.com/@furiagg](https://youtube.com/@furiagg)"
    }
    ```

### 4. `/webchat`

Retorna a URL e instruções para acessar o webchat.

* **Método:** `GET`
* **Path:** `/webchat`
* **Resposta (Exemplo):** `200 OK`
    ```json
    {
      "url": "http://localhost:5173/login",
      "instrucoes": "Acesse o link para chat ao vivo"
    }
    ```

## Configuração e Execução Local

**Pré-requisitos:**

* [Node.js](https://nodejs.org/) (versão LTS recomendada)
* [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

**Passos:**

1.  **Navegue até este diretório** (onde `server.js` e a pasta `routes/` estão localizados):
    ```bash
    cd <CAMINHO_PARA_PASTA_DA_API>
    ```

2.  **Instale as Dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Variáveis de Ambiente (Opcional):**
    * Crie um arquivo `.env` neste diretório.
    * Você pode definir a porta da API (o padrão é 3000):
      ```dotenv
      # .env
      PORT=3001
      ```

4.  **Execute a API:**
    ```bash
    node server.js
    ```
    * Para desenvolvimento com reinício automático ao salvar arquivos, use o `nodemon` (se instalado):
      ```bash
      nodemon server.js
      ```
    * O servidor estará rodando na porta definida (padrão `3000`) e pronto para receber requisições nos endpoints listados acima (ex: `http://localhost:3000/elenco`).

## Fonte dos Dados

⚠️ **Importante:** Atualmente, todos os dados retornados pela API estão fixos diretamente nos arquivos de rota (`routes/elenco.js`, `routes/agenda.js`, etc.). Para que a API forneça informações atualizadas, será necessário modificar esses arquivos para buscar os dados de uma fonte dinâmica (como um banco de dados, outra API externa, ou arquivos de configuração).

---
