import { Router } from "express";
import UserController from "../controller/UserController";
import { validateToken } from "../middleware/checkJwt";

const router = Router();

//Get all users
router.get("/", [validateToken], UserController.listAll);

// Get one user
router.get(
    "/:id([0-9]+)",
    [validateToken],
    UserController.getOneById
);

//Create a new user
//router.post("/", [checkJwt], UserController.newUser);
router.post("/", UserController.newUser);

//Edit one user
router.patch(
    "/:id([0-9]+)",
    [validateToken],
    UserController.editUser
);

//Delete one user
router.delete(
    "/:id([0-9]+)",
    [validateToken],
    UserController.deleteUser
);

export default router;
