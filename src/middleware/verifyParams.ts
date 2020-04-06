
import { Request, Response, NextFunction } from "express";
import config from "../config/config";

export const verifyParams = (method: string, ...params: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        var missing: string[] = [];
        if (req.method == "POST") {
            params.forEach(param => {
                if (!req.body[param]) {
                    missing.push(param);
                }
            });
        }
        if (req.method == "GET") {
            params.forEach(param => {
                if (!req.params[param]) {
                    missing.push(param);
                }
            });
        }
        if (missing.length > 0) {
            res.status(400).send(JSON.stringify({
                error: true,
                message: "some parameters are missing",
                missing_params: missing
            }));
        }
        else {
            next();
        }
    }
}
