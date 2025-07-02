import { HttpException, Injectable } from "@nestjs/common";
import { PersonalProfileDto } from "./dtos/createPersonalProfile";
import { PersonalProfileRepository } from "./repository/personal-profile.repository";

@Injectable()
export class PersonalProfileService{

    constructor(private personalProfileRepo:PersonalProfileRepository){}

    async createPersonal(dataBody:PersonalProfileDto):Promise<PersonalProfileDto>{
        if(!dataBody) throw new HttpException('Dados fonecidos inválidos!',400);
        return this.personalProfileRepo.createPersonal(dataBody);
    }

    findAll(){
        return this.personalProfileRepo.findAll();
    }
}