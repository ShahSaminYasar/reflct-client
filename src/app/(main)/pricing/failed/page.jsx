// app/payment/cancel/page.tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PaymentCancel() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || "canceled";

  return (
    <div className="max-w-md mx-auto py-20 text-center">
      <h1 className="text-3xl font-bold text-red-600">Payment Cancelled</h1>

      <p className="mt-4 text-lg">
        {reason === "canceled"
          ? "You cancelled the payment. No charges were made."
          : "There was an issue processing your payment."}
      </p>

      <div className="mt-8 space-x-4">
        <Link
          href="/pricing"
          className="block bg-primary text-primary-foreground text-sm px-3 py-2 rounded-sm"
        >
          Try Again
        </Link>
        <Link
          href="/"
          className="block bg-background text-foreground border text-sm px-3 py-2 rounded-sm my-2"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
