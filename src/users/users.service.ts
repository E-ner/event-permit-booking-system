// src/users/users.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './entities/user.entity'; // Assuming enum is in entity

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    isAdminRequest = false,
  ): Promise<User> {
    const restrictedRoles = [UserRole.AUTHORITY, UserRole.VENUE_MANAGER];
    if (restrictedRoles.includes(createUserDto.role) && !isAdminRequest) {
      throw new ForbiddenException(
        'Cannot self-register for this role. Contact admin.',
      );
    }

    const { password, ...rest } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds: 10

    const user = this.usersRepository.create({
      ...rest,
      password: hashedPassword,
    });

    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        // PostgreSQL unique violation
        throw new ConflictException('Username or email already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}
