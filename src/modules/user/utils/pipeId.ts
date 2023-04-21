import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ObjectIdPipe implements PipeTransform {
  transform(value: string) {
    if (!value) throw new BadRequestException('ObjectId is required');
    if (!Types.ObjectId.isValid(value)) throw new BadRequestException('Invalid objectId');

    return new Types.ObjectId(value);
  }
}