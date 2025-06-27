// src/casbin/casbin.provider.ts
import { ForbiddenException, HttpException, Inject, Injectable, OnModuleInit,forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Enforcer, newEnforcer, newModelFromString } from 'casbin';
import { SequelizeAdapter } from 'casbin-sequelize-adapter';
import { CasbinRuleEntity } from './entities/casbin.entity';
import { Repository } from 'typeorm';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

//Service reponsável por construir o adapter, referenciar o banco de dados no adapter, 
//e obter os dados das regras que serão especificadas no banco de dados atravez dos dados do model.conf_
@Injectable()
export class CasBinService implements OnModuleInit {
  constructor(
    //Entidade casbin_rule_
    @InjectRepository(CasbinRuleEntity) private repository: Repository<CasbinRuleEntity>,
    
    //Utilizando o ClientProxy para enviar um send() para o microservice_users_
    @Inject('MICROSERVICE_USERS') private client:ClientProxy,
  ){}

  private enforcer: Enforcer;
  private dataEnforce?:{user:string,sub:string};

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
    //Método que esta instanciando novas regras da política de autorização do casbin para o banco de dados do casbin_rule_
    const enforcer = await this.getEnforce();

    const defaultPolicies = [
      ['admin', '/role/create-role', 'post'],
      ['user', '/role/list', 'get'],
      ['admin', '/role/delete/:id', 'delete'],
      ['admin', '/role/update/:id', 'patch'],
      ['user', '/role/getOne/:id', 'get'],
      ['super-admin', '/role/assign-role', 'post'],
      ['super-admin','/casbin/list','get'],

      ['admin','/users/query','get'],
      ['admin','/users/list','get'],
      ['admin','/users/getOne/:id','get'],
      ['admin','/users/delete:/id','delete'],
      ['admin','/users/update/:id','patch']
    ];

    for (const [sub, obj, act] of defaultPolicies) {
      const exists = await enforcer.hasPolicy(sub, obj, act);
      if (!exists) {
        await enforcer.addPolicy(sub, obj, act);
      }
    }

    await enforcer.savePolicy(); // Salva no banco (casbin_rule)
  }

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
      m = g(r.sub, p.sub) && keyMatch(r.obj, p.obj) && r.act == p.act
    `;

    //Configurando o adapter, o adapter são as credencias e informações necessárias para conexão com o BD_
    const adapter = await SequelizeAdapter.newAdapter({
      //Aqui definimos as politicas do para conexão com o banco de dados e inicializar o casbin_
      dialect: 'postgres',
      port: 5432,
      host: 'localhost',
      database: 'microservice_users',
      username: 'jeffersons',
      password: 'JFS0211@ti',
      logging: false//Retira os logs de queries SQL emitidos pelo Sequelize;
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

  async getEnforce(dataUser?:{user:string ,sub:string}): Promise<Enforcer> {
    if (!this.enforcer) {
      console.log('🚀 Inicializando o enforcer on-demand...');
      // await this.createdBy_attribuited(createdBy)
      await this.casbinInitEnforcer();
    }

    this.dataEnforce = dataUser;
    
    return this.enforcer;
  }

  //Grupo padrão atribuido a todo usuário criado_
  async getDataUserCasbin(dataUser, createdBy: string) {
    try{

      if (!dataUser) throw new HttpException('Dados do usuário não obtidos!', 403);
  
      //Por padrão, todo usuário criado será adicionado no grupo de regra user_
      await this.enforcer.addGroupingPolicy(dataUser.userid, 'user');
  
      await this.createdByAttribuition(dataUser, createdBy);
    }catch(error){
      throw new HttpException(error.message || error,400);
    }
  }

  //Atribuindo valor a coluna createdBy_
  async createdByAttribuition(dataUser,createdBy: string,role?) {
    try{
      const grupoRegister = await this.repository.findOne({
        where: {
          ptype: 'g',
          v0: dataUser.userid ? dataUser.userid : dataUser,
          v1: role ? role : 'user'
        }
      });

      if (!grupoRegister) throw new HttpException('Grupo de regras não encontrado!', 403);
  
      grupoRegister.createdBy = createdBy;

      await this.repository.save(grupoRegister);
    }catch(error){
      throw new HttpException(error.message || error,400);
    }
  }

  //Atribuir um usuário a um novo grupo de regras_
  async assign_role(id: string, role: string): Promise<object> {
    try{

      if (!id) throw new HttpException('Identificador não atribuido!', 400);
  
      this.enforcer.loadPolicy();
      
      const assign_role_user = await this.getUser(this.dataEnforce);
      if (!assign_role_user) throw new HttpException('Erro ao obter dados!', 400);
      
      const roleActual = await this.getUserToGroup(id);
      if(!roleActual) throw new HttpException('Usuário não encontrado no grupo de regras!',403);
  
      const role_attribuited = await this.enforcer.addGroupingPolicy(id, role, roleActual);
      if (!role_attribuited) throw new HttpException('Erro ao atribuir role!', 400);
  
      await this.createdByAttribuition(id,assign_role_user,role);
  
      return {
        status: 'attribuited successfuly'
      }
    }catch(error){
      throw new HttpException(error.message || error,400);
    }
  }

  //Retorna o grupo ao qual o usuário pertence de acordo com o id do usuário_
  async getUserToGroup(id:string){
    try{

      //Buscando pelo grupo de regras em que o usuário foi inserido_
      const userToGroup = await this.repository.findOne({
        where: {
          v0: id,
        },
        order: {
          id: 'DESC'
        }
      });
      if(!userToGroup) throw new HttpException('Usuário não tem acesso a esse grupo de permissões!',403);
      
      return userToGroup.v1;
    }catch(error){
      throw new HttpException(error.message || error,400);
    }
  }

  async getUser(dataUser?:{user:string,sub:string}){
    try{
      const user = await lastValueFrom(
        this.client.send('find-user-by-email',dataUser?.user),
      );
  
      return user.firstname;
    }catch(error){
      console.log(error.message || error);
    }
  }

  //Retorna a lista de regras cadastradas na entidade casbin_
  async getListCasbin(){
    return this.repository.find();
  }

  //verifica se o usuário pertence ao grupo com a função especificada_
  async getOneToGroup(id?:string,role?:string):Promise<boolean>{
    try{
      if(!id) throw new ForbiddenException('Identificador Inválido!');
  
      const group = await this.repository.findOne({
        where: {
          ptype: 'g',
          v0: id,
          v1:role
        }
      });
  
      if(group) return true;

      return false;
    }catch(error){
      throw new ForbiddenException(error);
    }
  }

  //Busca pelas funções e pelas permissões que o usuários possue na entidade casbin_rule_
  async getUserPermissoes(id:string):Promise<object>{
    const permissoes = await this.repository.find({
      where: {
        ptype: 'g',
        v0: id
      }
    });

    //Isso me retorna um array contendo todas os grupos de permissoes e em quais funções eles estão associados com base no id do usuário_
    const permissions = await this.enforcer.getImplicitPermissionsForUser(id);
    const perms = permissions.map(([_, obj, act]) => `${obj}:${act}`);

    //Aqui depois de obter todas as permissões que o usuário tem no casbin, eu vou acessar
    //a entidade de menus e filtrar quais menus o usuário tem acesso com base nas permissões_
    //-----------------------

    if(!permissoes) throw new HttpException('Grupo de permissões não encontrado!',403);

    const obj_roles = permissoes.map(e => e.v1);
    const obj_permissions = permissions;

    return {
      obj_roles,
      perms
      //Falta apenas trazer os menus que ele usuário tem permissão,
      //para isso, irei precisar acessar/chamar o MenuRepository,
      //la irei fazer um filtro e ver se perms esta incluso e retornar os 
      //menus;
    };

    /*
      Eu preciso que o backend retorne para o front os menus em que esse usuários terá acesso ou não,
    */
  }

  //Verifica se uma politica já existe no banco de dados do casbin_rule_
  async getPolicieToMenu(path:string):Promise<object>{

    if(!path) throw new HttpException('Path Inválido!',403);

    const role = 'admin';

    const [obj, act] = path.split(':');
    
    const policie = await this.enforcer.hasPolicy(role,obj,act);

    if(policie) throw new HttpException('Politica já definida na base de dados!',403);

    const savePolicie = await this.enforcer.addPolicy(role,obj,act);

    this.enforcer.loadPolicy();

    return {
      status:'Sucessfully',
      message: 'Política cadastrada com sucesso',
      data: savePolicie
    }
  }
}