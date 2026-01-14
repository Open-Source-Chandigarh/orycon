import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@osc/prisma";

import type { Request, Response } from "express";
/**
 * The user controller class which will be working around and executing the main
 * functionalities realted to user functions that are defined below.
 */

interface jwtInformation {
  id: string;
  email: string;
  rollNumber: string;
}

class userController {
  /**
   * The function checks for existing user and if not add them into our database
   * along with the email sending workflow
   */
  async handleEmailSignup(req: Request, res: Response) {
    try {
      const { name, rollNumber, email, password } = req.body;

      if (!name) throw new Error("missing data name");
      if (!rollNumber) throw new Error("missing data rollNumber");
      if (!email) throw new Error("missing data email");
      if (!password) throw new Error("missing data password");

      const dbUser = await prisma.user.findFirst({
        where: {
          OR: [{ email: email }, { rollnumber: rollNumber }],
        },
      });
      if (dbUser) throw new Error("user already exists");

      const hashedPassword = await bcrypt.hash(password, 10);

      const createdUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          rollnumber: rollNumber,
        },
      });

      if (!createdUser) throw new Error("user not created");

      const jwtToken = await this.generateJWT({
        id: createdUser.id,
        rollNumber: createdUser.rollnumber || "",
        email: createdUser.email,
      });

      return res.status(200).json({
        data: {
          id: createdUser.id,
          email,
          name,
          rollNumber,
          token: jwtToken,
        },
        message: "user created successfully",
        error: null,
      });
    } catch (error: any) {
      console.log(error);
      return res.status(400).json({
        data: null,
        message: error.message || "Something went wrong",
        error: true,
      });
    }
  }
  /**
   * The function checks for existing user and returns the JWT if valid
   */
  async handleEmailLogin(req: Request, res: Response) {
    try {
      const { rollNumber, email, password } = req.body;
      if (!rollNumber) throw new Error("missing data rollNumber");
      if (!email) throw new Error("missing data email");
      if (!password) throw new Error("missing data password");

      const dbUser = await prisma.user.findFirst({
        where: {
          OR: [{ email: email }, { rollnumber: rollNumber }],
        },
      });
      if (!dbUser) throw new Error("user doesn't exists");

      const isPasswordCorrect = await bcrypt.compare(
        password,
        dbUser.password as string,
      );
      if (!isPasswordCorrect) throw new Error("Invalid credentials");

      const signedJWT = await this.generateJWT({
        id: dbUser.id,
        email: dbUser.email,
        rollNumber: dbUser.rollnumber || "",
      });

      return res.status(200).json({
        token: signedJWT,
      });
    } catch (error: any) {
      console.log(error);
      return res.status(400).json({
        data: null,
        message: error.message || "Something went wrong",
        error: true,
      });
    }
  }
  /**
   * Signup VIA google/github OAuth
   */
  async handleOAuthSignup(name: string, email: string) {
    try {
      const createUser = await prisma.user.create({
        data: { name, email },
      });
      if (!createUser) throw new Error("user not created");
      return createUser;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  /**
   * Login VIA google/github OAuth for now i dont think this
   * will be of any use
   */
  async handleOAuthLogin(data: jwtInformation) {}

  async updateUserDetails(req: Request, res: Response) {
    try {
      const { id, name, email, rollnumber, password } = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ message: "User id is missing", error: true });
      }

      const user = await prisma.user.findUnique({ where: { id } });

      if (!user) {
        return res.status(404).json({ message: "User not found", error: true });
      }

      const newData: any = {};

      if (name) newData.name = name;
      if (email) newData.email = email;
      if (rollnumber) newData.rollnumber = rollnumber;
      if (password) newData.password = await bcrypt.hash(password, 10);

      const userUpdated = await prisma.user.update({
        where: { id },
        data: newData,
        select: {
          id: true,
          name: true,
          email: true,
          rollnumber: true,
          role: true,
          updatedAt: true,
        },
      });

      return res.status(200).json({
        message: "User updated successfully",
        error: false,
        newData: userUpdated,
      });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ message: err.message, error: true });
    }
  }

  /**
   * Helper function inorder to generate a JWT for the user
   */
  async generateJWT(data: jwtInformation) {
    try {
      const signedJWT = await jwt.sign(data, process.env.JWT_SECRET!, {
        expiresIn: "15d",
      });

      if (!signedJWT) throw new Error("jwt creation failed");
      return signedJWT;
    } catch (error) {
      console.log("jwt creation error");
      return null;
    }
  }
}
export default new userController();
