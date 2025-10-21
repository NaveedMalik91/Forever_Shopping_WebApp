import { useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer  } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";
import Address from "@/components/shopping-view/address";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalCartAmount =
    cartItems?.items?.reduce(
      (sum, item) =>
        sum +
        (item.salePrice > 0 ? item.salePrice : item.price) * item.quantity,
      0
    ) || 0;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleStripeCheckout = async () => {
    if (!cartItems?.items?.length){
      toast.error("Your cart is empty");
       return;
    }
      

    if (!currentSelectedAddress){
      toast.error("Please select an address to proceed");
      return;
    }
      

    setIsProcessing(true);

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((item) => ({
        productId: item?.productId,
        title: item?.title,
        image: item?.image,
        price: item?.salePrice > 0 ? item?.salePrice : item?.price,
        quantity: item?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        fullName: currentSelectedAddress?.fullName,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        state: currentSelectedAddress?.state,
        country: currentSelectedAddress?.country,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "Stripe",
      paymentStatus: "processing",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
    };

    try {
      const res = await axios.post(`${backendUrl}/api/shop/order/create`, orderData);

      if (res.data?.url) {
        // ✅ Save orderId locally to use later on success page
        localStorage.setItem("currentOrderId", res.data.orderId);
        window.location.href = res.data.url; // Redirect to Stripe checkout
      } else {
         toast.error("Payment session not created");
      }
    } catch (err) {
      console.error(err);
       toast.error("Payment failed!! Try again");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
      <Address
        selectedId={currentSelectedAddress}
        setCurrentSelectedAddress={setCurrentSelectedAddress}
      />

      <div className="flex flex-col gap-4">
        {cartItems?.items?.map((item) => (
          <UserCartItemsContent key={item.productId} cartItem={item} />
        ))}

        <div className="mt-8 flex justify-between font-bold">
          <span>Total</span>
          <span>${totalCartAmount}</span>
        </div>

        <Button
          onClick={handleStripeCheckout}
          className="mt-4 w-full bg-black text-white hover:bg-gray-800"
          disabled={isProcessing}
        >
          {isProcessing ? "Processing Payment..." : "Checkout with Stripe"}
        </Button>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
