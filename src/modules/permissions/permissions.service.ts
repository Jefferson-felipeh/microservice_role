import { Injectable } from "@nestjs/common";

@Injectable()
export class PermissionsService{
    async getUserPermissoes(payload){
        console.log(payload)
    }
}