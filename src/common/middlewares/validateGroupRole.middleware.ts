import { HttpException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";
import { CasBinService } from "src/modules/casbin/casbin.service";

@Injectable()
export class ValidateGroupRoleMiddleware implements NestMiddleware{
    constructor(private casbinService:CasBinService){}
    
    async use(req: Request, res: Response, next: NextFunction) {
        const role = req.body as any;
        
        if(!role?.role || role?.role.split('') == '') throw new HttpException('Função não atribuida!',400);
        
        const group = await this.casbinService.getOneToGroup(role?.id , role?.role);

        if(group) throw new HttpException('Usuário já possue essa função!',400);

        next();
    }
}