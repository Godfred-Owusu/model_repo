// import { UserSchema } from './users.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
  //   _id: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ type: String })
  verificationToken?: string;

  @Prop({ type: String })
  passwordResetToken?: string;

  @Prop({ type: Date })
  passwordResetExpires?: Date;
}

// export const UserSchema = {
//   name: User.name,
//   schema: User,
// };

export const UserSchema = SchemaFactory.createForClass(User);
