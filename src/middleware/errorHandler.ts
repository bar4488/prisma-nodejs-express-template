import { ErrorRequestHandler } from "express";
import { isError } from "util";

export class Errors {
  static NotFound(message: string): ServerError {
    return new ServerError("NotFound", message, 404);
  }

  static Unauthorized(message: string): ServerError {
    return new ServerError("Unauthorized", message, 401);
  }
  static Forbidden(message: string): ServerError {
    return new ServerError("Forbidden", message, 403);
  }

  static ParametersError(message?: string): ServerError {
    return new ServerError("ParametersError", message ?? "", 400);
  }

  static DatabaseError(message: string): ServerError {
    return new ServerError("DatabaseError", message, 500);
  }
}

export class ServerError extends Error {
  constructor(
    public name: string,
    public message: string,
    public code: number
  ) {
    super(message ?? "");
  }
}

export const errorHandler: ErrorRequestHandler = function (
  err,
  req,
  res,
  next
) {
  if (isError(err)) {
    if (isServerError(err)) {
      res.status(err.code);
    } else {
      res.status(500);
    }
    res.json({
      name: err.name,
      message: err.message,
      stack: err.stack?.split("\n"),
    });
  } else {
    console.error(err);
    res.status(500).json({ error: "SERVER_ERROR" });
  }
};

function isServerError(error: any): error is ServerError {
  let e = error as ServerError;
  return isError(error) && e.code !== undefined;
}
