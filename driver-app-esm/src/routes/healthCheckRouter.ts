import express from "express";

import healthCheckController from "../controllers/healthCheckController.js";

const router = express.Router();

router.get("/", healthCheckController.ping);

export default { router };
