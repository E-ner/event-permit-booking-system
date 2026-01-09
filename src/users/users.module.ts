// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // This provides the User repository
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Export if used in other modules like AuthModule
})
export class UsersModule {}
