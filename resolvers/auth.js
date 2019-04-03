import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/user';

export default {
    async createUser(args) {
        let { email, password } = args.data;
        try {
            let findUser = await User.findOne({ email: email });
            if (findUser) {
                throw new Error("Email is already taken");
            }
            let hashedPassword = await bcrypt.hash(password, 12);
            let user = new User({
                email,
                password: hashedPassword
            });
            let savedUser = await user.save();
            savedUser.password = null;
            return savedUser;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
    async login({ email, password }) {
        let userFound = await User.findOne({ email: email });
        if (!userFound) {
            throw new Error("Auth failed, user not found");
        } else {
            let isPasswordCorrect = await bcrypt.compare(password, userFound.password);
            if (!isPasswordCorrect) {
                throw new Error("Password is not correct");
            } else {
                let token = jwt.sign({ userId: userFound._doc._id }, "volimeizinata", { expiresIn: "1h" });
                return {
                    token,
                    userId: userFound._doc._id,
                    tokenExpiration: 1
                }
            }
        }
    },
}