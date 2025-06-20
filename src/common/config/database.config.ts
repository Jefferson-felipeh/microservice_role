import { registerAs } from "@nestjs/config";

export default registerAs('database',() => ({
    type: process.env.DB_TYPE,
    nome: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
}))