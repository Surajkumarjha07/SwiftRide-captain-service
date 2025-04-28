import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const prisma = new PrismaClient();
dotenv.config();

const signUpCaptain = async ({ email, name, password, role, location }) => {
    try {
        const existingCaptain = await prisma.captains.findFirst({ where: { email } })

        if (existingCaptain) {
            throw new Error("Email already exists!");
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
        console.log("SignUp service error: ", error.message);
        throw error;
    }
}

const logInCaptain = async ({ email, password }) => {
    try {
        const captain = await prisma.captains.findFirst({ where: { email } })

        let passwordMatched;
        if (captain) {
            passwordMatched = await bcrypt.compare(password, captain.password);
        }

        if (!captain || !passwordMatched) {
            throw new Error("Incorrect email or password!");
        }

        const token = jwt.sign({ email, id: captain.captainId, name: captain.name }, process.env.JWT_SECRET, { expiresIn: "1h" })
        return token;

    } catch (error) {
        console.log("LogIn service error: ", error.message);
        throw error;
    }
}

const updateCaptain = async ({ newEmail, newName, newPassword, newRole, oldPassword, email }) => {
    try {
        const captain = await prisma.captains.findFirst({
            where: { email }
        });

        let passwordMatched;
        if (captain) {
            passwordMatched = await bcrypt.compare(oldPassword, captain.password);
        }

        if (!passwordMatched || !captain) {
            throw new Error("Incorrect Email or Password!");
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
        console.log("Update service error: ", error.message);
        throw error;
    }
}

const deleteCaptain = async ({ email, password }) => {
    try {
        const captain = await prisma.captains.findFirst({ where: { email } })

        let passwordMatched;
        if (captain) {
            passwordMatched = await bcrypt.compare(password, captain.password);
        }

        if (!captain || !passwordMatched) {
            throw new Error("Incorrect Email or Password!");
        }

        const deletedCaptain = await prisma.captains.delete({ where: { email } });

        return deletedCaptain;

    } catch (error) {
        console.log("delete service error: ", error.message);
        throw error;
    }
}

export const captainService = { signUpCaptain, logInCaptain, updateCaptain, deleteCaptain };