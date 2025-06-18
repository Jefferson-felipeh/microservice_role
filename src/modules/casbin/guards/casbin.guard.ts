import { CanActivate, ExecutionContext, ForbiddenException, HttpException, Injectable } from "@nestjs/common";
import { CasBinService } from '../casbin.service';

@Injectable()
export class CasBinGuard implements CanActivate {
    constructor(private casbinService: CasBinService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        //Aqui dentro iremos construir a lógica de permissão/autorização do casbin_

        //Obtendo dados do header da requisição_
        const request = context.switchToHttp().getRequest();
        const user = request.user;//Usuário fornecido por meio do token jwt;
        const path = request.route.path;//endereço da rota acessada;
        const method = request.method.toLowerCase();//Método de endpoint que esta sendo acessado;

        //Chamando o método do casbin.service.ts para obter o enforce_
        const enforcer = await this.casbinService.getEnforce(user);
        
        //Passando o enforce_
        const sllowed = await enforcer.enforce(user?.sub, path, method);

        if (!sllowed) throw new ForbiddenException('Acesso negado,usuário não tem permissão!');
        return true;
    }
}