import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // ⬅️ lit automatiquement le fichier .env à la racine du backend
    ConfigModule.forRoot({
      isGlobal: true, // disponible dans tout le projet
    }),

    MongooseModule.forRoot('mongodb://localhost:27017', {
      dbName: 'platforme-etudiant',
    }),

    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
