import express from "express";
import {
  createSessionHandler,
  refreshAccessTokenHandler,
  invalidateTokens,
} from "../controller/auth.controller";
import validateResource from "../middleware/validateResource";
import { createSessionSchema } from "../schema/auth.schema";

const router = express.Router();
//equal to login
router.post(
  "/api/sessions",
  validateResource(createSessionSchema),
  createSessionHandler
);

router.post("/api/sessions/refresh", refreshAccessTokenHandler);

router.get("/api/sessions/logout", invalidateTokens);

export default router;
