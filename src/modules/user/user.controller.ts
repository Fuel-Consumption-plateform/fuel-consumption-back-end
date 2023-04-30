import { BadRequestException, Body, Controller, Delete, Get,  Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Schema } from 'mongoose';
import { UpdateUserDto } from './dto/update.dto';
import { ObjectIdPipe } from './utils/pipeId';
import {GETUser} from 'src/decorators/user.decorator';
import { User, UserDocument } from './user.model';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}
    @Get()
    @UseGuards(JwtAuthGuard)
    async find(
    ) {
      const user = await this.userService.find();
      if (user) return user ;
      else throw new BadRequestException({ message: 'User not found.' });
    }
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(
      @Param('id', new ObjectIdPipe()) _id: Schema.Types.ObjectId,
    ): Promise<{user:User}> {
      const user = await this.userService.findOne({ _id });
      if (user) return {user} ;
      else throw new BadRequestException({ message: 'User not found.' });
    }

    @Post('create')
    //@UseGuards(JwtAuthGuard)
      async createuser(
        @Body() userData: CreateUserDto,
        @GETUser() user
      ) {
            return await this.userService.createUser(userData,user);
          }
    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async update(
        @Param('id', new ObjectIdPipe()) id: Schema.Types.ObjectId,
        @Body() updateUserDto: UpdateUserDto,
      ): Promise<{user:User}> {
        const user = await this.userService.update(id, updateUserDto);
        return {user} ;
      }
      @Put('softdelete/:id')
      @UseGuards(JwtAuthGuard)
      async softdelete(
        @Param('id', new ObjectIdPipe()) id: Schema.Types.ObjectId,
      ): Promise<{user:User}> {
        const user = await this.userService.softdelete(id);
        return {user} ;
      }


      @Put('recoveruser/:id')
      @UseGuards(JwtAuthGuard)
      async recover_user(
        @Param('id', new ObjectIdPipe()) id: Schema.Types.ObjectId,
      ): Promise<{user:User}> {
        const user = await this.userService.recoveruser(id);
        return {user} ;
      }

}

