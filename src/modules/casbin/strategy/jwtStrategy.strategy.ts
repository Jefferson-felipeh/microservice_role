import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt'
import { PayloadDto } from "../dtos/payload.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey:'jeffersons',  
        });
    }
    validate(payload:PayloadDto){
        try{
            return {
                user: payload.user,
                sub: payload.sub
            }
        }catch(error){
            console.log(error.message || error);
            throw new UnauthorizedException();
        }
    }
}