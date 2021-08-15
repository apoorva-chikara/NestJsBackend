import { ResetPasswordDto } from './dto/reset-password.dto';
import { Request } from 'express';
import { AuthService } from './../auth/auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Injectable, BadRequestException, NotFoundException, ConflictException, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 } from 'uuid';
import { addHours } from 'date-fns';
import * as bcrypt from 'bcrypt';
import { CreateForgotPasswordDto } from './dto/create-forgot-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyUuidDto } from './dto/verify-uuid.dto';
import { ForgotPassword } from './interfaces/forgot-password.interface';
import { User } from './interfaces/user.interface';


@Injectable()
export class UserService {


    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('ForgotPassword') private readonly forgotPasswordModel: Model<ForgotPassword>,
        private readonly authService: AuthService,
        ) {}

/**
 * 
 * @param createUserDto - User type
 * @returns Error or newly created User
 */
    async create(createUserDto: CreateUserDto): Promise<{email: string, fullName: string} | Error> {
            const user = new this.userModel(createUserDto);
            await this.isEmailUnique(user.email);
            const res =  await user.save();
            return { email: res.email, fullName: res.fullName }
    }


 /**
  * 
  * @param req - contains the request object
  * @param loginUserDto - it taks the login user object type
  * @returns token and the user information
  */
    async login(req: Request, loginUserDto: LoginUserDto) {
        const user = await this.findUserByEmail(loginUserDto.email);
        await this.checkPassword(loginUserDto.password, user);
        await this.passwordsAreMatch(user);
        return {
            fullName: user.fullName,
            email: user.email,
            accessToken: await this.authService.createAccessToken(user._id)
        };
    }


    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        await this.resetUserPassword(resetPasswordDto);
            return {
                email: resetPasswordDto.email,
                message: 'password successfully changed.',
            };

    }

//Below are the helper functions

 /**
  * 
  * @param email - passed from the user to verify if exist
  */

    private async isEmailUnique(email: string) {
        const user = await this.userModel.findOne({email});
        if (user) {
            throw new BadRequestException('Email must be unique.');
        }
    }


    private async findUserByEmail(email: string): Promise<User> {
        const user = await this.userModel.findOne({email});
        if (!user) {
          throw new NotFoundException('Wrong email or password.');
        }
        return user;
      }

    private async checkPassword(attemptPass: string, user) {
        const match = await bcrypt.compare(attemptPass, user.password);
        console.log(match);
        if (!match) {
            throw new NotFoundException('Wrong email or password.');
        }
        return match;
      }


    private async passwordsAreMatch(user) {
        user.loginAttempts = 0 ;
        await user.save();
    }

    private async resetUserPassword(resetPasswordDto: ResetPasswordDto) {
        const user = await this.userModel.findOne({
            email: resetPasswordDto.email,
        });
        user.password = resetPasswordDto.password;
        await user.save();
    }
}
