import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt'
import { PayloadDto } from "../dtos/payload.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        //Configuração do JWtGuard para autenticação de acordo com o token fornecido pelo usuário na requisição_
        super({
            //Extraindo o token do header da requisição_
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            //Não é para ignorar tokens expirados_
            ignoreExpiration: false,
            //Chave secreta dos tokens_
            secretOrKey:'jeffersons',  
        });
    }
    //Método utilizado para construção da lógica de autenticação e permissão com base no token fornecido pelo usuário na requisição_
    validate(payload:PayloadDto){
        try{
            return {
                user: payload.user,//Email do usuário;
                sub: payload.sub//Id do usuário;
            }
        }catch(error){
            console.log(error.message || error);
            throw new UnauthorizedException();
        }
    }
}