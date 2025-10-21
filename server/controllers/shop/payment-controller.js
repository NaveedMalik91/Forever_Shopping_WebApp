import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
import Order from "../../models/Order.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Create Checkout Session + Save Order
export const createCheckoutSession = async (req, res) => {
  try {
    const { cartItems, totalAmount, user, addressInfo } = req.body;

    if (!cartItems?.length) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Build Stripe line items
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "USD",
        product_data: {
          name: item.title,
          images: [item.image],
        },
        unit_amount: Math.round(
          (item.salePrice > 0 ? item.salePrice : item.price) * 100
        ),
      },
      quantity: item.quantity,
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.FRONTEND_URL}/shop/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/shop/payment-cancel`,
      metadata: {
        userId: user.id,
        email: user.email,
      },
    });

    // Save order with session ID (used later to update)
    await Order.create({
      userId: user.id,
      cartItems,
      addressInfo,
      totalAmount,
      orderStatus: "Pending",
      paymentMethod: "Stripe",
      paymentStatus: "Processing",
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      stripeSessionId: session.id,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("🔴 Error creating checkout session:", err.message);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};

// ✅ Capture Stripe Payment after success
export const capturePayment = async (req, res) => {
  try {
    const { session_id } = req.body;

    if (!session_id)
      return res.status(400).json({ error: "Missing session_id" });

    const session = await stripe.checkout.sessions.retrieve(session_id);

    console.log("🟢 Stripe Session Payment Status:", session.payment_status);

    if (session.payment_status === "paid") {
      const updatedOrder = await Order.findOneAndUpdate(
        { stripeSessionId: session_id },
        {
          orderStatus: "Paid",
          paymentStatus: "Completed",
          orderUpdateDate: new Date(),
        },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ error: "Order not found for session" });
      }

      console.log("✅ Order updated to Paid:", updatedOrder._id);

      return res.status(200).json({
        message: "Payment captured successfully",
        order: updatedOrder,
      });
    }

    res.status(400).json({ error: "Payment not completed yet" });
  } catch (err) {
    console.error("🔴 Error capturing payment:", err.message);
    res.status(500).json({ error: "Failed to capture payment" });
  }
};

// ✅ Retrieve session details (optional)
export const getCheckoutSession = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    res.status(200).json(session);
  } catch (err) {
    console.error("Error fetching checkout session:", err.message);
    res.status(500).json({ error: "Failed to fetch session" });
  }
};


