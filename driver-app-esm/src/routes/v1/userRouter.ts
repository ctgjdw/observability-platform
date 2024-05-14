import express from "express";

import { loginUser } from "../../controllers/v1/userController.js";

const router = express.Router();

router.get("/", loginUser);

export default { router };
