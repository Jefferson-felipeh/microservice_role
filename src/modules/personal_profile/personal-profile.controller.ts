import { Body, Controller, Get, Post } from "@nestjs/common";
import { PersonalProfileDto } from "./dtos/createPersonalProfile";
import { PersonalProfileService } from "./personal-profile.service";

@Controller('personal')
export class PersonalProfileController{
    constructor(private personalProfileService:PersonalProfileService){}

    @Post('create')
    async createPersonal(@Body() dataBody:PersonalProfileDto):Promise<PersonalProfileDto>{
        return this.personalProfileService.createPersonal(dataBody);
    }

    @Get('list')
    findAll(){
        return this.personalProfileService.findAll();
    }
}