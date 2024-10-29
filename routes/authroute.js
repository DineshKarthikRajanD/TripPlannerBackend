import express from "express";
import { registerUser, loginUser,savePayment,saveCustomer } from "../controller/control";
import cors from "cors"
import bodyParser from "body-parser";

const router = express.Router();
router.use(cors)
app.use(bodyParser.json());
// Register a new user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);
router.post('/', savePayment);
router.post('/', saveCustomer);

export default router;
