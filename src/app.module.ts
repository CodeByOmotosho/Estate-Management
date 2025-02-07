import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { ManagerModule } from './manager/manager.module';


@Module({
  imports: [
    UsersModule, 
    AuthModule, 
    TypeOrmModule.forRoot({
      type: 'postgres',                
      host: 'localhost',               
      port: 5432,                      
      username: 'postgres',  
      password: '08038569945',  
      database: 'estate_db',      
      entities: [ User ], 
      synchronize: true,               
    }),
    NotificationsModule,
    ManagerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
