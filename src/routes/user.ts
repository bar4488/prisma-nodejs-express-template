import { Router } from "express";
import UserController from "../controller/UserController";
import { checkJwt } from "../middleware/checkJwt";

const router = Router();

//Get all users
router.get("/", [checkJwt], UserController.listAll);

// Get one user
router.get(
    "/:id([0-9]+)",
    [checkJwt],
    UserController.getOneById
);

//Create a new user
//router.post("/", [checkJwt], UserController.newUser);
router.post("/", UserController.newUser);

//Edit one user
router.patch(
    "/:id([0-9]+)",
    [checkJwt],
    UserController.editUser
);

//Delete one user
router.delete(
    "/:id([0-9]+)",
    [checkJwt],
    UserController.deleteUser
);

export default router;
