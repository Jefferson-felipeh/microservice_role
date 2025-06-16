import { Module } from '@nestjs/common';
import { modules } from './modules';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './common/config/database.config';
import { TypeOrmConfigService } from './database/typeorm_config.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    //Tornando as variaveis de ambiente globais_
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      ignoreEnvFile: false,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
        useClass: TypeOrmConfigService
    }),

    ...modules
  ],
  providers: [TypeOrmConfigService]
})
export class AppModule {}
