import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface IUser extends Document {
  email: string;
  password: string;
  userName: string;
}

export const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
});

interface UserModel extends Model<IUser> {
  register({
    password,
    userName,
    email,
  }: {
    password: string;
    userName: string;
    email: string;
  }): Promise<Boolean>;
  login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<String>;
}

class User {
  static async register(
    this: UserModel,
    {
      password,
      userName,
      email,
    }: { password: string; userName: string; email: string }
  ) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.create({
      password: hashedPassword,
      userName,
      email,
    });

    return user ? true : false;
  }
  static async login(
    this: UserModel,
    { email, password }: { email: string; password: string }
  ) {
    const user = await this.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new Error("Password was wrong");
    }

    const token = jwt.sign({ userId: user._id }, "token");

    return token;
  }
}

userSchema.loadClass(User);

const Users = mongoose.model<IUser, UserModel>("User", userSchema);

export default Users;
