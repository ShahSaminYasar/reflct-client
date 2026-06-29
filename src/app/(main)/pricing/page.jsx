"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Crown,
  BadgeCheck,
  Check,
  X,
  Sparkles,
  ArrowRight,
  Loader2,
  Gem,
} from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSession } from "@/lib/authClient";
import { apiFetch } from "@/lib/apiFetch";

export default function PricingPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground font-medium tracking-tight">
            Authenticating...
          </p>
        </div>
      </div>
    );
  }

  if (!session || !session.user) {
    return router.push("/login");
  }

  const isPremiumUser = session?.user?.isPremium === true;

  const handleUpgrade = async () => {
    try {
      setLoadingCheckout(true);
      const res = await apiFetch("/api/create-checkout-session", {
        method: "POST",
      });

      if (res && res.ok && res.url) {
        toast.success("Redirecting to secure stripe checkout...");
        window.location.href = res.url;
      } else {
        toast.error(
          res?.message || "Failed to initialize subscription checkout.",
        );
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoadingCheckout(false);
    }
  };

  const comparisonFeatures = [
    {
      name: "Number of lessons",
      free: "Up to 5",
      premium: "Unlimited Lifetime",
    },
    { name: "Premium lesson creation", free: false, premium: true },
    { name: "Access Premium lessons", free: false, premium: true },
    { name: "Priority listing", free: false, premium: true },
    { name: "Ad-free experience", free: false, premium: true },
    { name: "Verified badge", free: false, premium: true },
    { name: "Premium support", free: false, premium: true },
    { name: "Lifetime updates", free: false, premium: true },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen font-sans antialiased">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section 1: Hero */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center bg-primary/10 text-primary p-2 rounded-full mb-1">
            <Crown className="h-6 w-6 animate-pulse" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground bg-clip-text">
            Reflct Pricing
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Upgrade to premium to unlock all features of the app and view
            premium content.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 lg:grid grid-cols-3 lg:gap-6 relative items-center">
          <div className="pt-8 w-full mx-auto space-y-4 md:col-span-2">
            <div className="text-center lg:text-left">
              <h2 className="text-lg font-bold tracking-tight text-foreground uppercase">
                Free vs Premium
              </h2>
              <p className="text-xs text-muted-foreground">
                Detailed comparison breakdowns of tiered privileges.
              </p>
            </div>

            <div className="border border-muted rounded-xl bg-card overflow-hidden shadow-sm">
              <div className="overflow-x-auto w-full">
                <Table>
                  <TableHeader>
                    <TableRow className="border-muted bg-muted/20 hover:bg-transparent">
                      <TableHead className="text-xs font-bold text-foreground h-10 px-4">
                        Feature
                      </TableHead>
                      <TableHead className="text-xs font-bold text-center text-foreground h-10 px-4 w-28">
                        Free
                      </TableHead>
                      <TableHead className="text-xs font-bold text-center text-primary h-10 px-4 w-28 bg-primary/5">
                        Premium
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comparisonFeatures.map((row, index) => (
                      <TableRow
                        key={index}
                        className="border-muted hover:bg-muted/10 transition-colors"
                      >
                        <TableCell className="text-xs font-medium text-foreground/90 h-10 px-4 py-2">
                          {row.name}
                        </TableCell>
                        <TableCell className="text-xs text-center text-muted-foreground h-10 px-4 py-2">
                          {typeof row.free === "string" ? (
                            <span className="font-medium text-[11px]">
                              {row.free}
                            </span>
                          ) : row.free ? (
                            <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                          ) : (
                            <X className="h-4 w-4 text-destructive/70 mx-auto" />
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-center font-semibold text-foreground h-10 px-4 py-2 bg-primary/5">
                          {typeof row.premium === "string" ? (
                            <span className="text-primary font-bold text-[11px]">
                              {row.premium}
                            </span>
                          ) : row.premium ? (
                            <Check className="h-4 w-4 text-emerald-500 mx-auto stroke-[2.5]" />
                          ) : (
                            <X className="h-4 w-4 text-destructive mx-auto" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <div className="w-full max-w-sm mx-auto lg:sticky lg:top-22">
            {isPremiumUser ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="border-emerald-500/30 bg-emerald-500/5 shadow-xl shadow-emerald-500/5 relative overflow-hidden backdrop-blur-sm">
                  <div className="absolute top-0 right-0 p-3">
                    <Sparkles className="h-5 w-5 text-emerald-500 opacity-60" />
                  </div>
                  <CardHeader className="text-center pb-4 pt-8">
                    <div className="mx-auto bg-emerald-500 text-white p-3 w-max rounded-full mb-3 shadow-lg shadow-emerald-500/20">
                      <Gem className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5">
                      Premium Member
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground mt-1">
                      Thank you for upgrading. Your lifetime membership is fully
                      active.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 px-6 pb-8 text-center">
                    <div className="text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 py-2 px-3 rounded-lg font-medium inline-block">
                      Enjoy all Premium features indefinitely.
                    </div>
                    <Button
                      onClick={() => router.push("/dashboard")}
                      className="w-full text-xs font-semibold h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all duration-200 group"
                    >
                      Go to Dashboard
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                <Card className="w-full max-w-sm border-primary/20 bg-card shadow-2xl relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-bl-xl shadow-sm">
                    Lifetime Value
                  </div>
                  <CardHeader className="pt-8 pb-1 px-6">
                    <CardTitle className="text-lg font-bold tracking-tight text-foreground flex items-center gap-1.5">
                      Lifetime Premium
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      Comprehensive boundless ecosystem access
                    </CardDescription>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold tracking-tight text-foreground">
                        ৳1500
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">
                        / one-time payment
                      </span>
                    </div>
                  </CardHeader>
                  <Separator className="bg-muted mx-6 w-auto" />
                  <CardContent className="p-6 space-y-6 pt-2">
                    <ul className="space-y-2.5 text-xs text-muted-foreground">
                      {[
                        "Unlimited lesson creation",
                        "Create Premium lessons",
                        "View Premium lessons",
                        "Priority listing",
                        "Premium badge",
                        "Ad-free experience",
                        "Lifetime access",
                        "Future Premium features",
                      ].map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <BadgeCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span className="text-foreground/90">{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    <form action="/api/checkout_sessions" method="POST">
                      <input
                        type="hidden"
                        name="user_email"
                        value={session?.user?.email}
                      />
                      <section>
                        <Button
                          disabled={loadingCheckout}
                          type="submit"
                          role="link"
                          className="w-full text-xs font-semibold h-10 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group"
                        >
                          {loadingCheckout ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              Upgrade to Premium
                              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </>
                          )}
                        </Button>
                      </section>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
