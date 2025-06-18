import { Injectable } from "@nestjs/common";
import { CasBinService } from "src/modules/casbin/casbin.service";
import { UserRoleRepository } from "src/modules/user_roles/repository/userRole.repository";

@Injectable()
export class Access_Control_Service{
    constructor(
        private casbinService:CasBinService,
        private userRoleRepository:UserRoleRepository
    ){}
}