Criação do microservice para gerenciamento de Roles(funções) para os usuários_

Dependencias do microsrvice_
//Cli do nestjs_
npm install @nestjs/cli

//Instalação do ORM typeorm que tem suporte nativo do nestjs e instalação do banco de dados postgreSQL_
npm install @nestjs/typeorm typeorm pg

//Configuração e acesso as variaveis de ambiente em toda aplicação_
npm install @nestjs/config

//Validação e transformação dos dados_
npm install class-validator class-transformer

Autorização dos endpoints_
npm install @nestjs/jwt jsonwebtoken passport-jwt

//Utilização do casbin_
-> O casbin é uma biblioteca poderosa de autorização ou de controle de acesso baseado em políticas(PBAC).
-> Atravez dela consigo gerenciar permissões baseados em usuários,grupos,papeis(roles) e domínios.
-> Usar módulos como: ACL(Access Control List), RBAC(Role-Based Access Control), ABAC(Attribute-Based Access Control) e outros.
-> Centralizar e desacoplar as regras de autorização da lógica da aplicação.

Instalação_
npm install casbin nest-casbin

> Eu vou precisar configurar o casbin com o RBAC, PostgreSQL e Typeorm sem usar o .csv.
> Usaremos o adaptor sequelize-adaptor para persistir as políticas no banco.

`Atualmente não existe um adaptor para o typeorm, mas existe oficialmente o do sequelize,
e apesar de estarmos usando o ORM TypeOrm para as configurações e conexões com o banco de dados,
usaremos o sequelize unicamente para aplicação do casbin_`
Para isso, instalamos:
npm install casbin //O casbin é o núcleo da biblioteca de autorização
npm install casbin-sequelize-adapter //Adaptador oficial para armazenar regras em PostgreSQL
npm install sequelize sequelize-typescript pg //Para integração com o PostgreSQL no Nestjs
npm install reflect-metadata

OBS: Existe um repositório não oficial chamado typeorm-adapter, mas ele esta desatualizado,
sem manutenção, e nem sempre funciona com Nestjs e Postgres. Já o casbin-sequelize-adapter 
é estável e aplicável.
-------------------------------------------------------------------------------------------------------------
Pastas e arquivos necessários para a aplicação do casbin_
.È necessário de pelo menos um banco de dados chamado casbin_rule usado pelo casbin para armazenar as regras de permissão;
.Tabelas já existentes: users,roles, user-roles;

Estrutura das Pastas_
src/
 |---- casbin/
          |---- casbin.model.conf
          |---- casbin.module.ts
          |---- casbin.service.ts
          |---- guards/
                   |---- casbin.guard.ts

<li>Criar o arquivo de modelo RBAC: casbin.model.conf</li>
Esse arquivo casbin.model.conf define a estrutura da política de autorização do casbin.
Ou seja, ele é o modelo(model) que descreve como casbin vai interpretar as regras de acesso 
salvas no banco de dados.

> Por que ele é necessário, sem ele o casbin não saberis:
    - O que compoe uma requisição (usuário,recurso,ação)
    - Como são definidas as permissões
    - Como as permissões se aplicam a usuários com papéis(roles)
    - Como combinar regras para tomar decisões

> Casbin usa dois arquivo:
    - model.conf: define a regra da regra(como as permissões funcionam)
    - As regras em si são salvas no banco de dados com o adapter instalado(casbin-sequelize-adapter)

> Exemplo de um arquivo casbin.model.conf_
[request_definition]
r = sub, obj, act
Essa parte define o que compoe uma requisição. Aqui sub = sujeito; obj = recurso; act = ação.

[policy_definition]
p = sub, onj, act
Essa parte define o formato de uma regra de permissões(ex: admin pode GET /users).

[role_definition]
g = _, _
Essa parte define a relação de papeis(ex: jefferson é admin)

[policy_effect]
e = some(where (p.eft == alow))
Essa parte diz como combinar as regras. AQui: se alguma regra persistir, libera o acesso

[matchers]
m = g(r.sub,p.sub) && r.obj == p.obj && r.act == p.act
A lógica para verificar se a permissão da requisição bate com alguma regra da política.

> Exemplo prático:
Com esse modelo de casbin.model.conf, é possível deinir políticas como:
//Define que "admin" pode fazer GET em /users_
await enforcer.addPolicy('admin','/users','GET')

//Diz que "jefferson" tem o papel de "admin"_
await enforcer.addGroupingPolicy('jefferson','admin')

A apartir disso, quand jefferson fizer uma requisição GET para /users, o casbin checa:
 - Ele tem o papel de "admin"?
 - "admin" pode acessar /users com o método GET?
se sim -> Permite Acesso.

Ou seja, o arquivo casbin.model.conf é o coração do casbin, pois:
é o arquivo que define o modelo de políticas(ou o modelo de autorizações) que a biblioteca casbin 
irá conseguir seguir para aplicar as regras de permissão na aplicação.

---------------------------------------------------------------------------------------------------------------
Próximo passo é configurar o "adapter" e o "enforcer":
Para isso será criado o arquivo casbin.service.ts, onde esse arquivo é o responsável
por inicializar e configurar o casbin na aplicação.

Função do arquivo: 
Ele cria e exporta uma instancia do CasBin Enforcer, que é a classe principal reponsável por 
aplicar as regras de autorização com base no modelo e nas políticas carregadas do banco de dados.

Componentes importantes nesse arquivo:
1. Model Path(modelo):
    - Ele adiciona um caminho para o model definido casbin.model.conf:
    ex: const pathModel = path.join(__diname+'endereço do model');
    const modelPath = path.join(__dirname+'casbin.mode.conf'); //Dessa forma estou buscando ou direcionando para o modelo;

2. Adapter(fonte de dados):
    - Onde o casbin vai buscar e persistir as políticas(roles,permissões, etc).
    - Pode ser Typeorm, sequelize, etc.
    - Exemplo com sequelize: 

    const adapter = await SequelizeAdapter.newAdapter({
        username: 'postgres',
        password: '12345',
        database: 'nome do banco de dados',
        host: 'localhost',
        dialect: 'postgres',
        ...
    });
    - Ele vai servir para inicializar o casbin
    - Para carregar o modelo e as politicas do banco de dados
    - Para expor o enforcer que será usado no sistema para autorizar endpoints, validar ações e
    aplicar regras definidas.

3. Enforcer
    - Instancia carregada com o model eo adapter.
    - Permite usar métodos como enforce, addPolicy, addRoleForUser, etc.

    this.enforcer = await newEnforcer(pathModel,adapter);

    Para que precisa desse arquivo:
        - Para inicializar o casbin.
        - Para carregar o modelo e as politicas do banco de dados.
        - Para expor o enforcer que será usado no sistema para autorizar edpoints, 
        validar ações e aplicar as regras definidas.
---------------------------------------------------------------------------------------------------------------
Depois que foi configurado o casbin.model.conf,carregado o casbin.model.conf, inicializou o adaptor(para banco de dados),
e o enforcer, o próximo passo é integrar o casbin na proteção das rotas, ou seja, usar o casbin para autorizar 
acessos dinamicos conforme as permissões.

1.Criar um CasbinGuard:
 - Esse guard será usado para proteger rotas com base nas políticas definidas no casbin.

<hr/>