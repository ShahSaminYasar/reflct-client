"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PaymentCancelContent() {
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
          className="block bg-primary text-primary-foreground text-sm px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition"
        >
          Try Again
        </Link>
        <Link
          href="/"
          className="block mt-3 bg-background text-foreground border border-border hover:bg-accent text-sm px-6 py-3 rounded-lg font-medium transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

// Main Page Component
export default function PaymentCancel() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto py-20 text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <PaymentCancelContent />
    </Suspense>
  );
}
