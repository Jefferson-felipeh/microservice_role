export interface PayloadDto{
    //Modelo básico de dados que o token fornece ao strategy de autenticação com o JWT_
    user?:string
    sub:string,
}