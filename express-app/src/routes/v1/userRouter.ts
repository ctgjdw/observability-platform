import express from "express";

import { loginUser } from "../../controllers/v1/userController";

const router = express.Router();

router.get("/", loginUser);

export default { router };
