import { Request, Response, NextFunction } from "express";
import config from "../config/config";
import { Errors } from "./errorHandler";

export const verifyParams = (...params: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    var missing: string[] = [];
    if (req.method == "POST") {
      params.forEach((param) => {
        if (!req.body[param]) {
          missing.push(param);
        }
      });
    }
    if (req.method == "GET") {
      params.forEach((param) => {
        if (!req.params[param]) {
          missing.push(param);
        }
      });
    }
    if (missing.length > 0) {
      next(
        Errors.ParametersError(
          "missing params: " + missing.toString().replace(",", ", ")
        )
      );
    } else {
      next();
    }
  };
};
