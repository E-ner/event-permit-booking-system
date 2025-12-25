import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { PermitsModule } from './permits/permits.module';
import { VenuesModule } from './venues/venues.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Loads .env globally
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres', // Or 'mysql', 'sqlite', etc.
        host: configService.get('DATABASE_HOST'),
        port: +configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // Auto-load all entities (User, Venue, etc.)
        synchronize: true, // Auto-create tables in dev (turn off in prod!)
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    VenuesModule, BookingsModule, PermitsModule 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}