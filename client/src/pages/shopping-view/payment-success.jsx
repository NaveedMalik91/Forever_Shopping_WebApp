import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) return;

    const fetchAndCapturePayment = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        // ✅ 1. Get Stripe checkout session details
        const sessionRes = await axios.get(
          `${backendUrl}/api/payment/checkout-session/${sessionId}`
        );
        setSession(sessionRes.data);

        // ✅ 2. Capture and update payment/order status in DB
        const orderId = localStorage.getItem("currentOrderId");
        if (!orderId) {
          console.warn("No orderId found in localStorage!");
          toast.warning("Order reference missing.");
          return;
        }

        const captureRes = await axios.post(
          `${backendUrl}/api/shop/order/capture`,
          { sessionId, orderId }
        );

        if (captureRes.data?.success) {
          toast.success("Payment successful! Order confirmed");
          // clear stored order id
          localStorage.removeItem("currentOrderId");
        } else {
          toast.error(captureRes.data.message || "Payment capture failed");
        }
      } catch (err) {
        console.error("Error confirming payment:", err);
        toast.error("Error confirming payment");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndCapturePayment();
  }, [sessionId]);

  return (
    <Card className="p-10 mx-auto mt-20 w-full sm:w-[600px] text-center shadow-md">
      <CardHeader className="p-0">
        <CardTitle className="text-4xl">
          {isLoading ? "Loading..." : session ? "Payment Successful!" : "Payment Failed"}
        </CardTitle>
      </CardHeader>

      {session && (
        <div className="mt-4 space-y-2">
          <p>Customer: {session.customer_details?.name || "N/A"}</p>
          <p>Email: {session.customer_details?.email}</p>
          <p>Amount Paid: ${session.amount_total / 100}</p>
        </div>
      )}

      <Button className="mt-6" onClick={() => navigate("/shop/account")}>
        View Orders
      </Button>
    </Card>
  );
}

export default PaymentSuccessPage;
