import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserStatusEnum } from '../dto/user.dto';

@Schema({ timestamps: true })
export class User {
  @Prop()
  fullName: string;

  @Prop({
    required: true,
    unique: true,
    index: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({
    type: String,
    enum: UserStatusEnum,
    default: UserStatusEnum.AWAITING_EMAIL_VERIFICATION,
  })
  status: UserStatusEnum;

  @Prop({ default: null })
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
