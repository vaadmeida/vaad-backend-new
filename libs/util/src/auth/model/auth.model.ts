import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { RolesEnum } from '../enum/roles.enum';

@Schema({ timestamps: true })
export class Auth {
  @Prop({ type: SchemaTypes.ObjectId, index: true })
  identifier: string;

  @Prop()
  password: string;

  @Prop({ default: [], type: [String] })
  roles: RolesEnum[];

  @Prop({ default: true })
  isActive: boolean;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
