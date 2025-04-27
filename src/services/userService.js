import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const prisma = new PrismaClient();
dotenv.config();

const signUpUser = async ({ email, name, password, role, location }) => {
    try {
        const existingCaptain = await prisma.captains.findFirst({ where: { email } })

        if (existingCaptain) {
            return res.status(409).json({
                message: "Email already exists!"
            })
        }

        const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklomnopqrstuvwxyz_-@#$&";
        let captainId = '';

        for (let i = 0; i < 15; i++) {
            let pos = Math.floor(Math.random() * alpha.length)
            captainId = captainId + alpha[pos];
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt)

        return await prisma.captains.create({ data: { email: email.trim(), name: name.trim(), password: hashedPassword.trim(), role: role.trim(), location: location.trim(), captainId: captainId.trim() } });

    } catch (error) {
        throw new Error("signUp service error: ", error.message);
    }
}

const logInUser = async ({ email, password }) => {
    try {
        const captain = await prisma.captains.findFirst({ where: { email } })

        let passwordMatched;
        if (captain) {
            passwordMatched = await bcrypt.compare(password, captain.password);
        }

        if (!captain || !passwordMatched) {
            res.status(404).json({
                message: "Incorrect email or password!"
            });
            return;
        }

        const token = jwt.sign({ email, id: captain.captainId, name: captain.name }, process.env.JWT_SECRET, { expiresIn: "1h" })
        return token;

    } catch (error) {
        throw new Error("logIn service error: ", error.message)
    }
}

const updateUser = async ({ newEmail, newName, newPassword, newRole, oldPassword, email }) => {
    try {
        const captain = await prisma.captains.findFirst({
            where: { email }
        });

        let passwordMatched;
        if (captain) {
            passwordMatched = await bcrypt.compare(oldPassword, captain.password);
        }

        if (!passwordMatched || !captain) {
            return res.status(400).json({
                message: "Incorrect Email or Password!"
            })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const updatedCaptain = await prisma.captains.update({
            where: { email },
            data: { email: newEmail, name: newName, password: hashedPassword, role: newRole }
        })

        return updatedCaptain;

    } catch (error) {
       throw new Error("update service error: ", error.message);
    }
}

const deleteUser = async ({email, password}) => {
    try {
        const captain = await prisma.captains.findFirst({ where: { email } })

        let passwordMatched;
        if (captain) {
            passwordMatched = await bcrypt.compare(password, captain.password);
        }

        if (!captain || !passwordMatched) {
            return res.status(400).json({
                message: "Incorrect email or password!"
            });
        }

        const deletedCaptain = await prisma.captains.delete({ where: { email } });

        return deletedCaptain;

    } catch (error) {
        throw new Error("delete service error: ", error.message);
    }
}

export const userService = { signUpUser, logInUser, updateUser, deleteUser };