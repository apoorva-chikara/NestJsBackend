import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { sign } from 'jsonwebtoken';
import { User } from 'src/user/interfaces/user.interface';
import * as Cryptr from 'cryptr';


@Injectable()
export class AuthService {

  cryptr: any;

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>
  ) {
    this.cryptr = new Cryptr(process.env.ENCRYPT_JWT_SECRET);
  }

  async createAccessToken(userId: string) {
    const accessToken = sign({userId}, process.env.JWT_SECRET , { expiresIn: process.env.JWT_EXPIRATION });
    return this.encryptText(accessToken);
  }

  async validateUser(jwtPayload: JwtPayload): Promise<any> {
    const user = await this.userModel.findOne({_id: jwtPayload.userId});
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    return user;
  }

/**
 * 
 * @param request 
 * @returns void
 */
  private jwtExtractor(request) {
    
    let token = null;
    if (request.header('x-token')) {
    token = request.get('x-token');
  } else if (request.headers.authorization) {
    token = request.headers.authorization.replace('Bearer ', '').replace(' ', '');
  } else if (request.body.token) {
    token = request.body.token.replace(' ', '');
  }
    if (request.query.token) {
    token = request.body.token.replace(' ', '');
  }
    const cryptr = new Cryptr(process.env.ENCRYPT_JWT_SECRET);
    console.log(token);
    if (token) {
      try {
        token = cryptr.decrypt(token);
      } catch (err) {
        throw new BadRequestException('Bad request.');
      }
  }
    return token;
}

 /**
  * 
  * @returns Token
  */
  returnJwtExtractor() {
    return this.jwtExtractor;
  }

  /**
   * 
   * @param text - jwt Token
   * @returns Encrypted Token
   */

  encryptText(text: string): string {
    return this.cryptr.encrypt(text);
  }
}
