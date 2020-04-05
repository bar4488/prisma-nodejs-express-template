import { Router } from "express";
import AuthController from "../controller/AuthController";
import { validateToken } from "../middleware/checkJwt";

const router = Router();
//Login route
router.post("/login", AuthController.login);

//Change my password
router.post("/change-password", [validateToken], AuthController.changePassword);

export default router;