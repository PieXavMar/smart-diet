import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;

  // 2FA fields
  twoFactorSecret?: string | null;
  tempTwoFactorSecret?: string | null;
  requires2FASetup: boolean;

  // login security
  failedLoginAttempts: number;
  isLocked: boolean;
  lockUntil?: Date | null;

  // password reset
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;

  // SMART DIET PROFILE FIELDS
  userId: string;
  age?: number;
  heightCm?: number;
  weightKg?: number;
  goal?: string;
  activityLevel?: string;
  dietType?: string[];
  allergies?: string[];

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    // AUTH FIELDS
    email: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // 2FA
    twoFactorSecret: { type: String, default: null },
    tempTwoFactorSecret: { type: String, default: null },
    requires2FASetup: { type: Boolean, default: true },

    // login security
    failedLoginAttempts: { type: Number, default: 0 },
    isLocked: { type: Boolean, default: false },
    lockUntil: { type: Date, default: null },

    // password reset
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },

    // SMART DIET FIELDS
    userId: {
        type: String,
        required: true,
        unique: true,
        default: () => new mongoose.Types.ObjectId().toString()
        },
    age: Number,
    heightCm: Number,
    weightKg: Number,
    goal: String,
    activityLevel: String,
    dietType: [String],
    allergies: [String]
  },
  {
    timestamps: true
  }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
