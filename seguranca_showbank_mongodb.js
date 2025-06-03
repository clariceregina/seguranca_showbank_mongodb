// listar todos os usuários cadastrados no banco de dados.
db.system.users.find()

// no prompt de comando, criar usuário admin, com permições para acessar todos os bancos de dados, assim como ler e escrever em todos
mongosh
use admin
db.createUser({
    user: 'admin',
    pwd: 'admin123', // passwordPrompt() para que a senha não fique visível no terminal em produção, ela só é solicitada quando o comando é executado
    roles: [
        {role: 'userAdminAnyDatabase', db: 'admin'}, // usuário se autenticará no banco admin, mas pode acessar todos os bancos de dados
        {role: 'readWriteAnyDatabase', db: 'admin'} // usuário pode ler e escrever em todos os bancos e o banco de autenticação é o admin
        ]
})

// logar com usuário admin pelo prompt de comando
mongosh --authenticationDatabase "admin" -u "admin" -p // para isso, saia do mongosh com "exit"

db.auth("admin", "admin123")

// criar usuário sem permissão, cujo banco de dados de autenticação seja o showbank pelo prompt de comando
db.createUser({
    user: 'ana',
    pwd: 'ana123',
    roles: []
})

// caso tentemos logar no banco admin com o usuário da Ana, a autenticação falhará
mongosh --authenticationDatabase "admin" -u "ana" -p

// já no banco de dados showbank, é possível
mongosh --authenticationDatabase "showbank" -u "ana" -p

// verificar na linha de comando com qual usuário estou autenticada
db.runCommand({ connectionStatus: 1 })

// verificar na linha de comando quais papeis o usuário possui e outras informações sobre o mesmo
db.getUser("ana")

// na linha de comando conceder permissões a um usuário
use showbank
db.grantRolesToUser("ana", [{role: "readWrite", db: "showbank"}])

// criar novo usuário sem permissão no banco showbank e conceder permissão pelo runCommand na linha de comando
use showbank
db.createUser({user: 'miranda', pwd: 'miranda123', roles: []})
db.runCommand({grantRolesToUser: 'miranda', roles:[{role:'read', db: 'showbank'}]})

// ativar o controle de acesso

// caso tenha apenas instalado os executáveis e ao usar sempre sobre o serviço pela linha de comando, ao iniciar passamos o parâmetro
mongod --auth

// caso tenha instalado como um serviço, precisamos parar os serviços do mongodb acessando os serviços do windows (Windows + R > services.msc > localizar MongoDB > Parar o serviço) ou dando um shutdown no próprio mongodb
db.adminCommand({shutdown: 1})

// acessar o arquivo de configuração do mongodb e descomentar security
security:
  authorization: enabled

// fechar nosqlbooster e iniciar serviços do mongodb novamente 

// criar funções específicas de permissões de usuário pela linha de comando
db.createRole({
    role: "RegrasBanco",
    privileges: [
        {resource: {db: "showbank", collection: ""},actions: ["find", "insert"]}
        ],
        roles:[]
})

db.createRole({
    role: "RegrasColecao",
    privileges: [
        {resource: {db: "showbank", collection: "clientes"},actions: ["find", "insert"]}
        ],
        roles:[]
})

// criar usuário que possa executar insert e find na coleção clientes do banco showbank
db.createUser({
    user: "Paulo",
    pwd: passwordPrompt(),
    customData: {nomecompleto:"José Paulo dos Santos", identificador: 3},
    roles: ["RegrasColecao"]
})

// alterar informações de um usuário
db.updateUser(
    "Paulo",
    {
        pwd: "paulo123",
        customData: {nomecompleto:"José Paulo dos Santos Silva", identificador: 3},
    })

// alterar senha te um usuário
db.changeUserPassword("senhaAntiga", "senhaNova")

// remover permissões de um usuário pela linha de comando
db.runCommand({
    revokeRolesFromUser: "Paulo",
    roles: [{role: "RegrasColecao", db: "admin"}]
})

// excluir função criada
db.dropRole("RegrasColecao")

// excluir usuário 
db.dropUser("Paulo")

// criando um conjunto de réplicas pela linha de comando
mongod --replSet rs0 --port 27018 --dbpath \Curso\mongodb\rs1

// conectar-se ao primeiro nó
mongosh --port 27018

// iniciar conjunto de regras
rs.initiate()

// informações sobre o conjunto de réplicas
rs.status()

// adicionar nós secundários
rs.add({host:"localhost:27019"})
rs.add({host:"localhost:27020"})

// indicar que a leitura deve ser feita nos nós secundários
db.getMongo().setReadPref("secondary")

// criar nó arbitrário
mongod --replSet rs0 --port 27021 --dbpath /curso/mongodb/arb

// retornar informações padrão de leitura e escrita do conjunto de réplicas
db.adminCommand({getDefaultRWConcern: 1})

// alterar configuração para permitir escrita
db.adminCommand({
    setDefaultRWConcern: 1,
    defaultReadConcern: {level: "local"},
    defaultWriteConcern: {w: 1, wtimeout: 0}
})

// adicionar nó arbitrário
rs.addArb("localhost:27021")

// remover nó do conjunto de réplicas
rs.remove("localhost:27020")