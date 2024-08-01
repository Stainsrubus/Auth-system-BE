import express from "express";
import UserController from "../controllers/users.js";

const router = express.Router();

router.post("/signup", UserController.signup);
router.post("/login", UserController.login);
router.get("/getallusers", UserController.getAllUsers);
router.get("/getusers/:id", UserController.getUserById);
export default router;
