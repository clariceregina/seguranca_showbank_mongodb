# Segurança e Disponibilidade de Dados – ShowBank

## 📌 Descrição

Este projeto documenta práticas de **segurança** e **alta disponibilidade** no banco de dados MongoDB utilizado pela aplicação **ShowBank**. As diretrizes cobrem desde a criação de usuários com controle de acesso até a configuração de conjuntos de réplicas para garantir redundância de dados e maior tolerância a falhas.

## ✅ Categorias das Ações Utilizadas

### 1. Gerenciamento de Usuários
- Criação de usuários com ou sem permissões (`db.createUser`)
- Autenticação com usuários (`mongosh --authenticationDatabase`)
- Verificação de usuário atual e seus papéis (`db.runCommand({ connectionStatus })`, `db.getUser`)
- Atualização de dados e senha de usuários (`db.updateUser`, `db.changeUserPassword`)
- Remoção de usuários (`db.dropUser`)

### 2. Controle de Permissões
- Concessão e revogação de papéis a usuários (`db.grantRolesToUser`, `db.runCommand({ revokeRolesFromUser })`)
- Criação de papéis personalizados com privilégios específicos (`db.createRole`)
- Exclusão de papéis (`db.dropRole`)

### 3. Segurança e Autenticação
- Ativação do controle de acesso (`mongod --auth`, `security.authorization: enabled`)
- Acesso e edição de configurações do MongoDB (`mongod.conf`)
- Encerramento seguro do serviço MongoDB (`db.adminCommand({ shutdown: 1 })`)

### 4. Replicação e Alta Disponibilidade
- Criação de conjunto de réplicas (`mongod --replSet`)
- Inicialização e status do conjunto (`rs.initiate()`, `rs.status()`)
- Adição de nós secundários e arbitrários (`rs.add()`, `rs.addArb()`)
- Configuração de leitura em secundários (`db.getMongo().setReadPref("secondary")`)
- Configuração e consulta das políticas de leitura/escrita (`db.adminCommand({ getDefaultRWConcern })`, `setDefaultRWConcern`)
- Remoção de nós do conjunto (`rs.remove()`)

## 📄 Funcionalidades Implementadas

### 🔐 Segurança e Controle de Acesso
- Autenticação obrigatória de usuários.
- Separação de permissões por papéis (roles).
- Criação de usuários com permissões mínimas e controle granular de ações (privilégios por banco e coleção).
- Criação de papéis personalizados com ações específicas como `find` e `insert`.

### 👥 Gerenciamento de Usuários
- Criação, modificação e exclusão de usuários.
- Atualização segura de senhas.
- Atribuição e revogação de papéis a qualquer momento.

### 📑 Auditoria e Diagnóstico
- Verificação da identidade do usuário autenticado.
- Inspeção dos papéis atribuídos a cada usuário.

### 🛡️ Configuração de Segurança
- Ativação da autenticação via terminal ou por arquivo de configuração.
- Boas práticas como uso de `passwordPrompt()` em ambientes de produção.

### ⚙️ Alta Disponibilidade com Réplicas
- Criação e configuração de conjuntos de réplicas.
- Adição de nós secundários e arbitrários.
- Configuração da leitura em nós secundários para distribuir carga.
- Personalização de políticas de leitura e escrita.

