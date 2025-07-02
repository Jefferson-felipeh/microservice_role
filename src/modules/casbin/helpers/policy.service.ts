import { ForbiddenException, HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Enforcer } from "casbin";
import { CasbinRuleEntity } from "../entities/casbin.entity";
import { In, Repository } from "typeorm";
import { PermissionsDto } from "src/modules/permissions/dtos/permissions.dto";
import { PersonalProfileDto } from "src/modules/personal_profile/dtos/createPersonalProfile";

@Injectable()
export class PolicyService {

  private enforcer:Enforcer;

  constructor(
    @InjectRepository(CasbinRuleEntity) private repository: Repository<CasbinRuleEntity>,
  ){}

  async getListCasbin() {
    return this.repository.find();
  }

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

  async getPolicieToMenus(dataBody:PersonalProfileDto,enforcer:Enforcer): Promise<object> {

    if (!dataBody) throw new HttpException('Path Inválido!', 403);

    const role = 'super-admin';

    const [obj, act] = dataBody.permission.split(':');

    const policie = await enforcer.hasPolicy(role, obj, act);

    const exists = await this.repository.findOne({
      where: {
        v1: obj.toLocaleLowerCase().trim()
      }
    });

    console.log(exists);
    if(exists) throw new HttpException('Política já existe na base de dados!',403);

    const savePolicie = await enforcer.addPolicy(role, obj, act);

    await enforcer.loadPolicy();

    return {
      status: 'Sucessfully',
      message: 'Política cadastrada com sucesso',
      data: savePolicie
    }
  }

  async getUserPermissions(id: string, enforcer: Enforcer): Promise<PermissionsDto> {

    await enforcer.loadPolicy();

    const permissoes = await this.repository.find({
      where: {
        ptype: 'g',
        v0: id
      }
    });

    const permissions = await enforcer.getImplicitPermissionsForUser(id);
    const perms = permissions.map(([_, obj, act]) => `${obj}:${act}`);

    if (!permissoes) throw new HttpException('Grupo de permissões não encontrado!', 403);

    const obj_roles = permissoes.map(e => e.v1);
    
    console.log(obj_roles)
    console.log(perms);
    return { obj_roles, perms };
  }

  // async getPoliciesPersonalProfile(dataBody:PersonalProfileDto,enforcer:Enforcer):Promise<object>{
  //   try{
  //     const [ obj , act ] = dataBody.permission.split(':');

  //     const policy = await this.repository.findOne({
  //       where: {
  //         v1: obj,
  //         v2: act
  //       }
  //     });

  //     if(!policy) enforcer.addPolicy();

  //     return policy;
  //   }catch(error){
  //     throw new HttpException(error.message || error,403);
  //   }
  // }
}