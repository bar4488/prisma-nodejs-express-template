import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";
import { prisma } from '../config/prisma';
import * as bcrypt from 'bcryptjs';

class AuthController {
    static login = async (req: Request, res: Response) => {
        //Check if username and password are set
        let { email, password } = req.body;
        console.log(email, password);
        if (!(email && password)) {
            res.status(400).send('{"error": true, "message": "email or password are missing", "msg_code": 1}');
            return;
        }

        //Get user from database
        const user = await prisma.user.findOne({
            where: {
                email: email
            }
        });
        if (!user) {
            res.status(401).send('{"error": true, "message": "user does not exists", "msg_code", 2}');
            return;
        }

        //Check if encrypted password match
        if (!bcrypt.compareSync(password, user.password)) {
            res.status(401).send('{"error": true, "message": "wrong password", "msg_code": 3');
            return;
        }

        //Sing JWT, valid for 1 hour
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            config.jwtSecret,
            { expiresIn: "1h" }
        );

        //Send the jwt in the response
        res.send(token);
    };

    static changePassword = async (req: Request, res: Response) => {
        //Get ID from JWT
        const id = res.locals.jwtPayload.userId;

        //Get parameters from the body
        const { oldPassword, newPassword } = req.body;
        if (!(oldPassword && newPassword)) {
            res.status(400).send();
        }

        //Get user from database
        const user = await prisma.user.findOne({
            where: {
                id: id
            }
        });
        if (!user) {
            res.status(401).send('{"error": true, "message": "user does not exists", "msg_code", 2}');
            return;
        }

        //Check if old password matchs
        if (!bcrypt.compareSync(oldPassword, user.password)) {
            res.status(401).send();
            return;
        }

        //Validate de model (password lenght)
        user.password = bcrypt.hashSync(newPassword);
        //Hash the new password and save
        prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                password: user.password
            }
        });

        res.status(204).send();
    };
}
export default AuthController;
