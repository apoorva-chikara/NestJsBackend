
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateForgotPasswordDto } from './dto/create-forgot-password.dto';
import { Request } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { Controller, Get, Post, Body, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyUuidDto } from './dto/verify-uuid.dto';
import { UserService } from './user.service';

@Controller('user')

export class UserController {
    constructor(
        private readonly userService: UserService,
        ) {}

    /**
     * 
     * @param createUserDto : the user signup model to create a new one
     * @returns - newly created user
     */
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() createUserDto: CreateUserDto) {
        return await this.userService.create(createUserDto);
    }

    /**
     * 
     * @param req - Request object 
     * @param loginUserDto - the user login model to get token authentication
     * @returns : token and user deatils
     */
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Req() req: Request, @Body() loginUserDto: LoginUserDto) {
            const response = await this.userService.login(req, loginUserDto);
            return response;
    }

    /**
     * 
     * @param resetPasswordDto - email, new password
     * @returns email and text message
     */
    @Post('resetpassword')
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return await this.userService.resetPassword(resetPasswordDto);
    }
