"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  ctaLabel?: string;
  onPaymentSuccess?: () => void;
  isUnlocked?: boolean;
  portfolioReference?: string;
}

const PRICE_INR = 5;

export default function PaymentModal({
  isOpen,
  onClose,
  title = "One-time access for Rs. 5",
  message = "Pay Rs. 5 to export or deploy your portfolio.",
  ctaLabel = "Pay Rs. 5 with Razorpay",
  onPaymentSuccess,
  isUnlocked = false,
  portfolioReference,
}: PaymentModalProps) {
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setPaymentConfirmed(false);
      setIsProcessing(false);
      setPaymentError("");
    }
  }, [isOpen]);

  const handleConfirmPayment = () => {
    void handleRazorpayPayment();
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-checkout-script")) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.id = "razorpay-checkout-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    if (isUnlocked) {
      return;
    }

    setIsProcessing(true);
    setPaymentError("");

    const loaded = await loadRazorpayScript();
    if (!loaded || !window.Razorpay) {
      setIsProcessing(false);
      setPaymentError("Unable to load Razorpay checkout. Please try again.");
      return;
    }

    try {
      const orderResponse = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amountInRupees: PRICE_INR,
          portfolioReference: portfolioReference || "portfolio",
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok || !orderData?.orderId) {
        throw new Error(orderData?.message || "Failed to create payment order");
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "PortfolioAI",
        description: "Portfolio export and deploy unlock",
        order_id: orderData.orderId,
        method: {
          upi: true,
          card: false,
          netbanking: false,
          wallet: false,
        },
        prefill: {
          name: "PortfolioAI User",
        },
        theme: {
          color: "#8b5cf6",
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verifyResponse = await fetch("/api/payments/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(response),
          });

          const verifyData = await verifyResponse.json();
          if (!verifyResponse.ok || !verifyData?.verified) {
            setPaymentError("Payment verification failed. Please try again.");
            setIsProcessing(false);
            return;
          }

          setPaymentConfirmed(true);
          setIsProcessing(false);
          onPaymentSuccess?.();
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      setIsProcessing(false);
      setPaymentError(
        error instanceof Error ? error.message : "Unable to complete payment"
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22 }}
            className="w-full max-w-xl rounded-2xl border border-white/15 bg-zinc-950 p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-violet-400">
                  Pricing
                </p>
                <h3 className="mt-1 text-2xl font-bold text-white">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-zinc-400">
                  {message}
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Close payment modal"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleConfirmPayment}
                disabled={isUnlocked || isProcessing}
                className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-violet-500 hover:to-fuchsia-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUnlocked
                  ? "Paid features already unlocked"
                  : isProcessing
                    ? "Opening Razorpay..."
                    : ctaLabel}
              </button>

              {paymentError && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">
                  {paymentError}
                </div>
              )}

              {(paymentConfirmed || isUnlocked) && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
                  Portfolio unlocked! You can now Deploy, Export, or Push to GitHub.
                </div>
              )}

              <p className="text-xs text-zinc-500">
                Secure checkout powered by Razorpay.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
