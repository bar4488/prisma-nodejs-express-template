import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";
import { prisma } from "../config/prisma";

export const validateToken = (req: Request, res: Response, next: NextFunction) => {
    if (!(req.headers["authorization"] && req.headers["client"])) {
        res.status(400).send('{"error": true, "message": "missing headers"}')
        return;
    }
    const client = <string>req.headers["client"];
    if (client === "web") {
        validateJwt(req, res, next);
        return;
    }
    else if (client === "mobile") {
        validateNative(req, res, next);
        return;
    }
    else {
        res.status(400).send('{"error": true, "message": "not an authorized client"}');
        return;
    }
};

const validateJwt = (req: Request, res: Response, next: NextFunction) => {
    const token = <string>req.headers["authorization"];
    let jwtPayload;

    //Try to validate the token and get data
    try {
        jwtPayload = <any>jwt.verify(token, config.jwtSecret);
        res.locals.userId = jwtPayload.userId;
        res.locals.email = jwtPayload.email;
    } catch (error) {
        //If token is not valid, respond with 401 (unauthorized)
        res.status(401).send(JSON.stringify({ error: true, message: "token is invalid!", msg_code: 3 }));
        return;
    }

    //The token is valid for 1 hour
    //We want to send a new token on every request
    const { userId, email } = jwtPayload;
    const newToken = jwt.sign({ userId, email }, config.jwtSecret, {
        expiresIn: "1h"
    });
    res.setHeader("token", newToken);

    //Call the next middleware or controller
    next();
}

const validateNative = async (req: Request, res: Response, next: NextFunction) => {
    const token = <string>req.headers["authorization"];

    //Try to validate the token and get data
    const tokenPayload = await prisma.token.findOne({
        include: { user: true },
        where: { token: token }
    })
    if (!tokenPayload) {
        res.status(401).send(JSON.stringify(
            {
                error: true,
                message: "token invalid"
            }
        ));
        return;
    }

    //The token is valid for 1 hour
    //We want to send a new token on every request
    const { id, email } = tokenPayload.user;
    res.locals.userId = id;
    res.locals.email = email;

    //Call the next middleware or controller
    next();
}