import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { orderAPI } from "../api/order.api";
import { ShippingAddress } from "../types/order.types";
import { Button, Card, Input } from "../components/ui";
import {
  MapPin,
  CreditCard,
  Package,
  Check,
  ArrowLeft,
  CreditCardIcon,
  ArrowRight,
} from "lucide-react";

type Step = "shipping" | "payment" | "review";

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>("shipping");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [shipping, setShipping] = useState<ShippingAddress>({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("Paypal");

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-xl text-center"
        >
          <Package size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 text-lg mb-6">Your cart is empty</p>
          <Button onClick={() => navigate("/cart")} className="gap-2">
            <ArrowLeft size={20} />
            Back to Cart
          </Button>
        </motion.div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shippingPrice = 10;
  const taxPrice = (subtotal + shippingPrice) * 0.1;
  const totalPrice = subtotal + shippingPrice + taxPrice;

  const steps: { id: Step; label: string; icon: React.ReactNode }[] = [
    { id: "shipping", label: "Shipping", icon: <MapPin size={20} /> },
    { id: "payment", label: "Payment", icon: <CreditCard size={20} /> },
    { id: "review", label: "Review", icon: <Package size={20} /> },
  ];

  const isShippingValid =
    shipping.address &&
    shipping.city &&
    shipping.postalCode &&
    shipping.country;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const orderItems = cart.map((item) => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item._id,
      }));

      const order = await orderAPI.createOrder({
        orderItems,
        shippingAddress: shipping,
        paymentMethod,
        shippingPrice,
        taxPrice,
        totalPrice,
      });

      clearCart();
      navigate(`/order/${order._id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <button
            onClick={() => navigate("/cart")}
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-6"
          >
            <ArrowLeft size={20} />
            Back to Cart
          </button>
          <h1 className="text-4xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">
            Complete your purchase in 3 simple steps
          </p>
        </motion.div>

        {/* Step Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex justify-between items-center relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200">
              <motion.div
                className="h-full bg-primary-600"
                initial={{ width: "0%" }}
                animate={{
                  width:
                    currentStep === "shipping"
                      ? "0%"
                      : currentStep === "payment"
                        ? "50%"
                        : "100%",
                }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Steps */}
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                className="flex flex-col items-center relative z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold mb-2 transition-colors ${
                    currentStep === step.id
                      ? "bg-primary-600 text-white"
                      : ["shipping", "payment"].includes(currentStep) &&
                          steps.findIndex((s) => s.id === currentStep) > index
                        ? "bg-green-500 text-white"
                        : "bg-white text-gray-500 border-2 border-gray-300"
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  {["shipping", "payment"].includes(currentStep) &&
                  steps.findIndex((s) => s.id === currentStep) > index ? (
                    <Check size={24} />
                  ) : (
                    step.icon
                  )}
                </motion.div>
                <span className="text-sm font-semibold text-gray-700">
                  {step.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
          >
            <div className="text-red-600 flex-shrink-0 mt-0.5">!</div>
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <AnimatePresence mode="wait">
              {/* Shipping Step */}
              {currentStep === "shipping" && (
                <motion.form
                  key="shipping"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (isShippingValid) setCurrentStep("payment");
                  }}
                >
                  <Card>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <MapPin className="text-primary-600" size={28} />
                      Shipping Address
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Address"
                        value={shipping.address}
                        onChange={(e) =>
                          setShipping({ ...shipping, address: e.target.value })
                        }
                        placeholder="123 Main Street"
                        required
                      />

                      <Input
                        label="City"
                        value={shipping.city}
                        onChange={(e) =>
                          setShipping({ ...shipping, city: e.target.value })
                        }
                        placeholder="New York"
                        required
                      />

                      <Input
                        label="Postal Code"
                        value={shipping.postalCode}
                        onChange={(e) =>
                          setShipping({
                            ...shipping,
                            postalCode: e.target.value,
                          })
                        }
                        placeholder="10001"
                        required
                      />

                      <Input
                        label="Country"
                        value={shipping.country}
                        onChange={(e) =>
                          setShipping({ ...shipping, country: e.target.value })
                        }
                        placeholder="United States"
                        required
                      />
                    </div>
                  </Card>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full gap-2"
                    disabled={!isShippingValid}
                  >
                    Continue to Payment
                    <ArrowRight size={20} />
                  </Button>
                </motion.form>
              )}

              {/* Payment Step */}
              {currentStep === "payment" && (
                <motion.form
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setCurrentStep("review");
                  }}
                >
                  <Card>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <CreditCard className="text-primary-600" size={28} />
                      Payment Method
                    </h2>

                    <div className="space-y-3">
                      {[
                        { value: "Paypal", label: "PayPal", icon: "◐" },
                        {
                          value: "Credit Card",
                          label: "Credit Card",
                          icon: <CreditCardIcon size={20} />,
                        },
                      ].map((method) => (
                        <motion.label
                          key={method.value}
                          className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            paymentMethod === method.value
                              ? "border-primary-600 bg-primary-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <input
                            type="radio"
                            value={method.value}
                            checked={paymentMethod === method.value}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-5 h-5"
                          />
                          <span className="flex-grow font-semibold text-gray-900">
                            {method.label}
                          </span>
                        </motion.label>
                      ))}
                    </div>

                    {paymentMethod === "Credit Card" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 pt-6 border-t border-gray-200 space-y-4"
                      >
                        <Input
                          label="Card Number"
                          placeholder="1234 5678 9012 3456"
                          required={paymentMethod === "Credit Card"}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Expiry Date"
                            placeholder="MM/YY"
                            required={paymentMethod === "Credit Card"}
                          />
                          <Input
                            label="CVV"
                            placeholder="123"
                            required={paymentMethod === "Credit Card"}
                          />
                        </div>
                      </motion.div>
                    )}
                  </Card>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="secondary"
                      size="lg"
                      className="flex-1 gap-2"
                      onClick={() => setCurrentStep("shipping")}
                    >
                      <ArrowLeft size={20} />
                      Back
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      className="flex-1 gap-2"
                      onClick={() => setCurrentStep("review")}
                    >
                      Review Order
                      <ArrowRight size={20} />
                    </Button>
                  </div>
                </motion.form>
              )}

              {/* Review Step */}
              {currentStep === "review" && (
                <motion.form
                  key="review"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                  onSubmit={handleSubmit}
                >
                  {/* Shipping Review */}
                  <Card>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <MapPin size={24} className="text-primary-600" />
                        Shipping Address
                      </h3>
                      <button
                        type="button"
                        onClick={() => setCurrentStep("shipping")}
                        className="text-primary-600 hover:text-primary-700 font-semibold"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-gray-700">
                      {shipping.address}
                      <br />
                      {shipping.city}, {shipping.postalCode}
                      <br />
                      {shipping.country}
                    </p>
                  </Card>

                  {/* Payment Review */}
                  <Card>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <CreditCard size={24} className="text-primary-600" />
                        Payment Method
                      </h3>
                      <button
                        type="button"
                        onClick={() => setCurrentStep("payment")}
                        className="text-primary-600 hover:text-primary-700 font-semibold"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-gray-700 font-semibold">
                      {paymentMethod}
                    </p>
                  </Card>

                  {/* Items Review */}
                  <Card>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Package size={24} className="text-primary-600" />
                      Order Items
                    </h3>
                    <div className="space-y-3">
                      {cart.map((item, index) => (
                        <motion.div
                          key={item._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex justify-between items-center pb-3 border-b border-gray-200 last:border-0"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <p className="font-semibold text-gray-900">
                                {item.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                Qty: {item.qty}
                              </p>
                            </div>
                          </div>
                          <p className="font-bold text-gray-900">
                            ${(item.price * item.qty).toFixed(2)}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </Card>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="secondary"
                      size="lg"
                      className="flex-1 gap-2"
                      onClick={() => setCurrentStep("payment")}
                    >
                      <ArrowLeft size={20} />
                      Back
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      className="flex-1"
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Place Order"}
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Order Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex justify-between text-gray-700"
                >
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-between text-gray-700"
                >
                  <span>Shipping</span>
                  <span className="font-semibold">
                    ${shippingPrice.toFixed(2)}
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex justify-between text-gray-700"
                >
                  <span>Tax (10%)</span>
                  <span className="font-semibold">${taxPrice.toFixed(2)}</span>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="p-4 bg-primary-50 rounded-lg mb-6"
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-primary-600">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </motion.div>

              {/* Progress Indicator */}
              <div className="bg-gray-100 rounded-lg p-4 space-y-2 text-sm text-gray-600">
                <div className="font-semibold text-gray-900 mb-3">
                  {cart.length === 1 ? "1 item" : `${cart.length} items`} in
                  order
                </div>
                <div className="flex items-center gap-2">
                  {currentStep === "shipping" ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-primary-600" />
                      <span>Editing shipping address...</span>
                    </>
                  ) : currentStep === "payment" ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-primary-600" />
                      <span>Selecting payment method...</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span>Ready to place order</span>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
