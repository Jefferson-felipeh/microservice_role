import { HttpException, Injectable } from "@nestjs/common";
import { PersonalProfileDto } from "../dtos/createPersonalProfile";
import { InjectRepository } from "@nestjs/typeorm";
import { PersonalProfileEntity } from "../entities/Personal.entity";
import { In, Repository } from "typeorm";
import { CasBinService } from "src/modules/casbin/casbin.service";

@Injectable()
export class PersonalProfileRepository{
    constructor(
        @InjectRepository(PersonalProfileEntity) private repository:Repository<PersonalProfileEntity>,
        private casbinService:CasBinService
    ){}

    async createPersonal(dataBody:PersonalProfileDto):Promise<any>{

        const lastProfile = await this.repository
        .createQueryBuilder('personal')
        .orderBy('personal.order')
        .getOne();

        const newOrder = lastProfile ? lastProfile.order + 1 : 1;

        await this.casbinService.getPolicieToMenus(dataBody);
        
        const personal = await this.repository.findOne({
            where: {
                permission: dataBody.permission
            }
        });
        
        if(personal) throw new HttpException('Personal profile já cadastrado na base de dados!',403);
        
        const createPersonal = this.repository.create({
            ...dataBody,
            order: newOrder
        });

        const savePersonal = await this.repository.save(createPersonal);;

        if(!savePersonal) throw new HttpException('Erro ao salvar informações na base de dados!',400);

        return savePersonal;
    }

    findAll(){
        return this.repository.find();
    }

    async getAllProfiles(perms):Promise<PersonalProfileDto[]>{
        try{
            return this.repository.find({
                where: {
                    permission: In(perms),
                }
            });
        }catch(error){
            throw new HttpException(error.message || error,403);
        }
    }
}