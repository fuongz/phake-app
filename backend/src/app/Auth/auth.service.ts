import {
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  NotFoundException,
  Req,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersService } from '../User/users.service';
import { compareHash, hash } from 'src/core/utils';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async getMe(id): Promise<any> {
    return await this.usersService.findById(id);
  }

  async signIn({ email, password }): Promise<any> {
    if (!email || !password)
      throw new UnprocessableEntityException('email and password is required');
    const user = await this.usersService.findOne({ email });
    if (!user) {
      throw new NotFoundException(user);
    }
    const isPasswordMatch = await compareHash(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Wrong password');
    }

    const jwtPayload = {
      sub: user._id,
      email: user.email,
      username: user.username,
    };

    return {
      user,
      access_token: await this.jwtService.signAsync(jwtPayload),
    };
  }

  async signUp({
    email,
    username,
    password,
    first_name,
    last_name,
  }): Promise<any> {
    if (!email || !username || !password) {
      throw new UnprocessableEntityException();
    }
    const user = await this.usersService.findOneOr([{ email }, { username }]);
    if (user) {
      throw new ForbiddenException('User already exists');
    }
    const newUser = await this.usersService.create({
      email,
      username,
      password: await hash(password),
      first_name: first_name || '',
      last_name: last_name || '',
    });

    const jwtPayload = {
      sub: newUser._id,
      email: newUser.email,
      username: newUser.username,
    };
    const { password: _password, __v, ...rest } = newUser;
    return {
      ...newUser,
      access_token: await this.jwtService.signAsync(jwtPayload),
    };
  }
}
