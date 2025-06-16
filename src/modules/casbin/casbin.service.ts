// src/casbin/casbin.provider.ts
import { HttpException, Injectable, OnModuleInit } from '@nestjs/common';
import { Enforcer, newEnforcer, newModelFromString } from 'casbin';
import { SequelizeAdapter } from 'casbin-sequelize-adapter';

//Service reponsável por construir o adapter, referenciar o banco de dados no adapter, 
//e obter os dados das regras que serão especificadas no banco de dados atravez dos dados do model.conf_
@Injectable()
export class CasBinService implements OnModuleInit {
  private enforcer: Enforcer;
  dataUserCreated;

  //Executa o bloco sempre que o módulo de casbin for iniciado_
  //Basicamente é ele que inicia o casbin na aplicação criando o adapter 
  //e especificando as regras que o BD segurá no mode.conf_
  onModuleInit() {
    this.casbinInitEnforcer();
    // this.seedDefaultPolicies();
  }

  //O banco de dados casbin_rule precisa ter regras definidas, ou seja, dados definidos que agrupam
  //as regras de politica de autenticação do casbin:
  //1- Cadastrar as regras da política de autenticação do casbin na entidade casbin_rule;
  //2- Associar o usuário ao grupo de regras;
  //3- verificar se o usuário possue tais permissões;
  async seedDefaultPolicies() {
    const enforcer = await this.getEnforce();

    const defaultPolicies = [
      ['admin', '/role/create-role', 'post'],
      ['user', '/role/list', 'get'],
    ];

    for (const [sub, obj, act] of defaultPolicies) {
      const exists = await enforcer.hasPolicy(sub, obj, act);
      if (!exists) {
        await enforcer.addPolicy(sub, obj, act);
      }
    }

    await enforcer.savePolicy(); // Salva no banco (casbin_rule)
  }

  //Iniciando o casbin_
  private async casbinInitEnforcer() {
    // Conteúdo do model.conf em string
    //Ao inves de criar o arquivo model.conf, estou adicionando o conteudo atravez desse texto,
    //ele contem as regras específicas para o banco de dados_
    //Modelo RBAC_
    //Define a estrutura da politica de autorização do casbin_
    const modelText = `
      [request_definition]
      r = sub, obj, act

      [policy_definition]
      p = sub, obj, act

      [role_definition]
      g = _, _

      [policy_effect]
      e = some(where (p.eft == allow))

      [matchers]
      m = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act
    `;

    //Configurando o adapter, o adapter são as credencias e informações necessárias para conexão com o BD_
    const adapter = await SequelizeAdapter.newAdapter({
      //Aqui definimos as politicas do para conexão com o banco de dados e inicializar o casbin_
      dialect: 'postgres',
      port: 5432,
      host: 'localhost',
      database: 'microservice_users',
      username: 'jeffersons',
      password: 'JFS0211@ti'
    });

    const model = newModelFromString(modelText);

    //referenciando as regras com o banco de dados_
    this.enforcer = await newEnforcer(model, adapter);

    //Essa comando é usado para carregar todas as políticas de autorização do casbin direto 
    //do banco de dados para a memória do enforcer_
    //O casbin mantem as politicas de autorização em memória dentro do enforcer, isso garante desempenho
    //ao verificar permissoes.
    //Por exemplo, se as políticas de autorização do banco de dados mudar, o enforcer não vai saber automaticamente,
    //dessa forma será usado esse comando para dizer ao enforcer e armazenar em memória as políticas de autorização
    //do banco atuais, dizendo, oh, houve auteração do nas políticas do casbin no banco de dados,
    //use o comando  loadPolicy() para carregar ou atualizar todas as regras do banco de dados para garantir 
    //que estou com as políticas mais atualizadas_
    this.enforcer.loadPolicy();

    return this.enforcer;
  }

  async getDataUserCasbin(dataUser) {
    console.log(dataUser.userid)
    if (!dataUser) throw new HttpException('Dados do usuário não obtidos!', 403);

    await this.enforcer.addGroupingPolicy(dataUser.userid,'admin');//O usuário criado pertencerá ao grupo de regras de role user;
    //Após criar as regras da política de autenticação e adiciona-las na entidade casbin_rule,
    //iremos, ao criar o usuário, atribuir no grupo de regra específica_
  }

  async getEnforce(): Promise<Enforcer> {
    if (!this.enforcer) {
      console.log('🚀 Inicializando o enforcer on-demand...');
      await this.casbinInitEnforcer();
    }

    return this.enforcer;
  }

}