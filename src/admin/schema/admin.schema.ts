import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserStatusEnum } from 'src/users/dto/user.dto';

@Schema({ timestamps: true })
export class Admin {
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

  @Prop({
    type: String,
    enum: UserStatusEnum,
    default: UserStatusEnum.AWAITING_EMAIL_VERIFICATION,
  })
  status: UserStatusEnum;

  @Prop({ default: null })
  deletedAt: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
