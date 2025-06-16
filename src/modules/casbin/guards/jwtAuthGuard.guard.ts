import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
//Guard Jwt para ser adicionado nos endpoints para autorização_
export class JwtAuthGuard extends AuthGuard('jwt'){}