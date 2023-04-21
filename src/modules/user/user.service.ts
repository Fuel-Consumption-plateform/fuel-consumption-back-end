import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.model';
import { Model, Schema } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create.dto';
import { UpdateUserDto } from './dto/update.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private model: Model<UserDocument>) {}
    
    
    
    async authUser(email: string, password: string): Promise<User> {
        const user = await this.model.findOne({ email});
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException('*Invalid credentials');

        return user;
      }
      async createUser(createUser: CreateUserDto) {
        const userExist = await this.model.findOne({
          name: createUser.name,
          email: createUser.email,
          password:createUser.password,
          role:createUser.role
        });
        if (userExist) throw new BadRequestException({ message: 'User exist' });

        try {
          const user = await new this.model(createUser).save();
          return user;
        } catch (e) {
          throw new BadRequestException({ message: e.message });
        }
      }

      async update(
        _id: Schema.Types.ObjectId,
        updateUserDto: UpdateUserDto,
      ): Promise<UserDocument> {
        try {
          const user = await this.model.findOneAndUpdate(
            { _id },
            { $set: updateUserDto },
            { new: true },
          );

          if (!user) throw new NotFoundException({ message: 'User not found' });

          return user;
        } catch (e) {
          throw new BadRequestException({ message: e.message });
        }
      }
      async findOne(obj: {
        _id?: Schema.Types.ObjectId;
        email?: string;
        name?: string;
      }): Promise<UserDocument> {
        const filter: any = {};

        if (obj._id) filter._id = obj._id;

        const user = await this.model.findOne(filter);

        if (!user) throw new BadRequestException({ message: 'User not found.' });

        return user;
      }

      async find(any){
        const user = await this.model.find(any);

        if (!user) throw new BadRequestException({ message: 'User not found.' });

        return user;
      }
}
