const Stripe = require("stripe");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL;

// ✅ Create Stripe Order & Checkout Session
const createOrder = async (req, res) => {
  try {
    console.log("🟢 Stripe order creation started");

    const { userId, cartId, cartItems, addressInfo, totalAmount } = req.body;

    if (!cartItems || !cartItems.length) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // ✅ Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.title },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${FRONTEND_URL}/shop/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/shop/payment-cancel`,
    });

    // ✅ Save order with pending payment
    const newOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus: "pending",
      paymentMethod: "stripe",
      paymentStatus: "pending",
      totalAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: session.id, // Stripe session ID
    });

    await newOrder.save();
    console.log("🟢 Order created:", newOrder._id);

    res.status(201).json({
      success: true,
      url: session.url,
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("🔴 Error creating order:", error.message);
    res.status(500).json({
      success: false,
      message: "Error creating Stripe order",
      error: error.message,
    });
  }
};

// ✅ Capture Stripe Payment & Update Order Status
const capturePayment = async (req, res) => {
  try {
    const { sessionId, orderId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return res.status(400).json({ success: false, message: "Invalid session" });
    }

    if (session.payment_status === "paid") {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      // ✅ Update order as paid & confirmed
      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";
      order.paymentId = session.payment_intent;
      order.orderUpdateDate = new Date();

      // ✅ Reduce product stock
      for (const item of order.cartItems) {
        const product = await Product.findById(item.productId);
        if (product) {
          product.totalStock -= item.quantity;
          await product.save();
        }
      }

      // ✅ Delete cart and save updated order
      await Cart.findByIdAndDelete(order.cartId);
      await order.save();

      res.status(200).json({
        success: true,
        message: "Payment captured successfully. Order confirmed.",
        data: order,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment not completed yet",
      });
    }
  } catch (error) {
    console.error("🔴 Error capturing payment:", error.message);
    res.status(500).json({
      success: false,
      message: "Error capturing payment",
      error: error.message,
    });
  }
};

// ✅ Get all orders for a user
const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({ success: false, message: "No orders found!" });
    }

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

// ✅ Get details of a specific order
const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found!" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ success: false, message: "Error fetching order details" });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
