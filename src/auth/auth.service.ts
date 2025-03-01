import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UpdateResult } from 'typeorm';
import { LoginDTO } from './dto/login.dto';
import * as bcrypt from "bcryptjs";
import { PayloadType, Enable2FAType } from './types';
import * as speakeasy from 'speakeasy';

@Injectable()
export class AuthService {
    constructor(private userService: UsersService,
                private jwtService: JwtService,
                ) {}
    async login(loginDTO: LoginDTO): Promise<{ accessToken: string } | { validate2FA: string; message: string }> {
        const user = await this.userService.findOne(loginDTO); 

        const passwordMatched = await bcrypt.compare(
        loginDTO.password,
        user.password
        );
        if (passwordMatched) {
            const { password, ...userWithoutPassword } = user; // Exclude password
            const payload : PayloadType = { email: user.email, userId: user.id };
            
            if (user.enable2FA && user.twoFASecret) { 
            
                return { 
                validate2FA: 'http://localhost:3000/validate-2fa',
                message:
                'Please send the one-time password/token from your Google Authenticator App',
                };
    }
            return {
            accessToken: this.jwtService.sign(payload),
            };
            } else {
            throw new UnauthorizedException("Password does not match"); 
            }
            }
    async enable2FA(userId: number) : Promise<Enable2FAType> {
        const user = await this.userService.findById(userId );
        if (user.enable2FA) { 
            return { secret: user.twoFASecret };
                }
        const secret = speakeasy.generateSecret(); 
        console.log(secret);
        user.twoFASecret = secret.base32; 
            await this.userService.updateSecretKey(user.id, user.twoFASecret); 
            return { secret: user.twoFASecret }; 
            }

    // validate the 2fa secret with provided token
    async validate2FAToken(
        userId: number,
        token: string,
        ): Promise<{ verified: boolean }> {
        try {
            // find the user on the based on id
            const user = await this.userService.findById(userId);
            // extract his 2FA secret
            // verify the secret with a token by calling the speakeasy verify method
            const verified = speakeasy.totp.verify({
            secret: user.twoFASecret,
            token: token,
            encoding: 'base32',
        });
        // if validated then sends the json web token in the response
        if (verified) {
            return { verified: true };
            } else {
            return { verified: false };
            }
        } catch (err) {
            throw new UnauthorizedException('Error verifying token');
    }
    }

    async disable2FA(userId: number): Promise<UpdateResult> {
        return this.userService.disable2FA(userId);
        }
    }
