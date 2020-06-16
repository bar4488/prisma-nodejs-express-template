import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";
import { prisma } from "../config/prisma";
import * as bcrypt from "bcryptjs";
import { PrismaClient, User } from "@prisma/client";
import * as rand from "rand-token";
import { randomBytes } from "crypto";
import { ServerError, Errors } from "../middleware/errorHandler";

class AdminController {
  static login = async (req: Request, res: Response, next: NextFunction) => {
    //Check if username and password are set
    let { email, password }: { email: string; password: string } = req.body;

    if (req.headers["client"] !== undefined) {
      Errors.Forbidden("no client provided");
    }

    let client: string = req.headers["client"] as string;

    //Get user from database
    const user = await prisma.user.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      next(Errors.NotFound("user does not exists"));
      return;
    }

    //Check if encrypted password match
    if (!bcrypt.compareSync(password, user.password)) {
      next(Errors.Forbidden("worng password"));
      return;
    }

    let token: string;
    token = randomBytes(32).toString("hex");
    await prisma.token.create({
      data: {
        client: client,
        token: token,
        user: {
          connect: { id: user.id },
        },
      },
    });
    //Send the jwt in the response
    res.send(token);
  };

  static changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    //Get ID from JWT
    const id: number = res.locals.userId;

    //Get parameters from the body
    const { oldPassword, newPassword } = req.body;

    //Get user from database
    const user = await prisma.user.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      next(Errors.NotFound("user does not exists"));
      return;
    }

    //Check if old password matchs
    if (!bcrypt.compareSync(oldPassword, user.password)) {
      next(Errors.Forbidden("wrong password"));
      return;
    }

    //Validate de model (password lenght)
    user.password = bcrypt.hashSync(newPassword);
    //Hash the new password and save
    prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: user.password,
      },
    });

    res.status(204).send();
  };
}
export default AdminController;
