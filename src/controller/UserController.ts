import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { prisma } from "../config/prisma";
import * as bcrypt from "bcryptjs";
import { Errors } from "../middleware/errorHandler";

class UserController {
  static listAll = async (req: Request, res: Response, next: NextFunction) => {
    //Get users from database
    const users = await prisma.user.findMany({
      include: { token: true },
      orderBy: { id: "desc" },
    });

    //Send the users object
    res.send(users);
  };

  static getOneById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    //Get the ID from the url
    const id: number = +req.params.id;

    //Get the user from database
    const user = prisma.user.findOne({ where: { id: id } });
    if (!user) {
      next(Errors.NotFound("user not found"));
      return;
    }
    res.send(user);
  };

  static newUser = async (req: Request, res: Response, next: NextFunction) => {
    //Get parameters from the body
    let { email, password, firstName, lastName, businessId } = req.body;
    password = bcrypt.hashSync(password);

    //Try to save. If fails, the username is already in use
    prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        userType: "basic",
        business: businessId,
        email: email,
        password: password,
      },
    });

    //If all ok, send 201 response
    res.status(201).send("User created");
  };

  static editUser = async (req: Request, res: Response, next: NextFunction) => {
    //Get the ID from the url
    const id: number = +req.params.id;

    //Get values from the body
    const { email } = req.body;

    //Try to find user on database
    const user = await prisma.user.findOne({ where: { id: id } });
    if (user == null) {
      next(Errors.NotFound("user not found"));
      return;
    }

    //Validate the new values on model
    user.email = email;

    //Try to safe, if fails, that means username already in use
    prisma.user.update({
      where: { id: id },
      data: { email: email },
    });

    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };

  static deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    //Get the ID from the url
    const id = +req.params.id;

    try {
      await prisma.user.delete({
        where: { id: id },
      });
    } catch (error) {}

    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };
}

export default UserController;
