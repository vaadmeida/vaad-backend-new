import { transform } from '@app/util/general/function/pascal-case.function';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserStatusEnum } from 'src/users/dto/user.dto';

@Schema({ timestamps: true })
export class MediaPartner {
  @Prop({ uppercase: true, trim: true })
  partnerId: string;

  @Prop({ transform })
  fullName: string;

  @Prop({
    required: true,
    unique: true,
    index: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({ transform })
  address: string;

  @Prop({ transform })
  state: string;

  @Prop({ transform })
  city: string;

  @Prop({ transform })
  country: string;

  @Prop({ transform })
  businessName: string;

  @Prop()
  logo: string;

  @Prop()
  termsAndConditions: boolean;

  @Prop({
    type: String,
    enum: UserStatusEnum,
    default: UserStatusEnum.AWAITING_EMAIL_VERIFICATION,
  })
  status: UserStatusEnum;

  @Prop({ default: null })
  deletedAt: Date;
}

export const MediaPartnerSchema = SchemaFactory.createForClass(MediaPartner);
