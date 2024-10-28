# Teste Umentor Gustavo Albino

Este projeto é uma aplicação frontend construída com React + Vite com um backend simples em PHP e mysql que utiliza o XAMPP.

## Requisitos

- [Node.js](https://nodejs.org/) (com NPM)
- [XAMPP](https://www.apachefriends.org/index.html)

## Configuração do Frontend

- Clone o repositório:
   ```bash
   git clone https://github.com/zanettekuhn/teste-umentor.git
   cd teste-umentor
   ```

- Instale as dependências:
    ```bash
    npm install
    ```
- Inicie a aplicação:
    ```bash
    npm run build

    npm run preview
    ```

- Configuração do Backend (PHP)
    ```bash
    Abra o XAMPP:

    Inicie o XAMPP e ative o Apache e o MySQL.
    Coloque os arquivos PHP no diretório do XAMPP:

    Mova o teste_umentor.php da pasta 'backend/api' PHP para o diretório htdocs do XAMPP (geralmente em C:\xampp\htdocs).

    Utilize o backend no .env do react. Exemplo: 'http://localhost/teste-umentor.php'
    
    Acesse o banco de dados MySQL utilizando qualquer ferramenta ou terminal:
    Importe o arquivo que esta em 'teste-umentor/backend/db' chamado 'users.sql'
    ```
- Estrutura do Projeto

    ```bash
    /teste-umentor
    ├── /frontend       # Código da React
    └── /backend        # Código do backend PHP
        └── /api
            └── teste_umentor.php
        └── /db
            └── users.sql
    ```

## Authors

- Gustavo Albino | [Linkedin](https://www.linkedin.com/in/gustavo-albino-zanette-kuhn/)

