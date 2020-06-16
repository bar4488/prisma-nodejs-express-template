import { Router } from "express";
import AuthController from "../controller/AuthController";
import { validateToken } from "../middleware/validateToken";
import { verifyParams } from "../middleware/verifyParams";

const router = Router();
//Login route
router.post("/login",
    verifyParams("email", "password"),
    AuthController.login
);

//Change my password
router.post("/change-password", [validateToken], AuthController.changePassword);

export default router;