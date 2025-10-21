import express from "express";
import {
  createCheckoutSession,
  capturePayment,
  getCheckoutSession,
} from "../../controllers/shop/payment-controller.js";

const router = express.Router();

router.post("/create-checkout-session", createCheckoutSession);
router.post("/capture", capturePayment);
router.get("/checkout-session/:sessionId", getCheckoutSession);

export default router;
