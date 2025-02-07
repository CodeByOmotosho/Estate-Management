import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './user.entity';
import * as bcrypt from "bcryptjs";
import { LoginDTO } from 'src/auth/dto/login.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        ) {}
    
      async create(userDTO: CreateUserDTO): Promise<User> {
        const { password, ...userData } = userDTO;
        const salt = await bcrypt.genSalt(); 
        const hashedPassword = await bcrypt.hash(password, salt); // Encrypt password
    
        const user = this.userRepository.create({
          ...userData,
          password: hashedPassword, // Save the hashed password
        });
    
        await this.userRepository.save(user);
        return plainToInstance(User, user);
        }
        async findOne(data: LoginDTO): Promise<User> {
            const user = await this.userRepository.findOneBy({ email: data.email });
            if (!user) {
                throw new UnauthorizedException('Could not find user');
                }
                return user;
            }

        async updateSecretKey(userId, secret: string): Promise<UpdateResult> {
            return this.userRepository.update(
            { id: userId },
            {
            twoFASecret: secret,
            enable2FA: true,
            },
            );
        }
       
        
        async findById(id: number): Promise<User> {
          const user = await this.userRepository.findOneBy({ id: id });
          
          if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
          }
          
          return user;
        }
        async disable2FA(userId: number): Promise<UpdateResult> {
          return this.userRepository.update(
          { id: userId },
          {
          enable2FA: false,
          twoFASecret: ''
          },
          );
          }
          
    
}
