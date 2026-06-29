import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/apiFetch";

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error("Please provide a valid session_id (`cs_test_...`)");
  }

  const { status, customer_details: { email: customerEmail } = {} } =
    await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    });

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    await apiFetch("/api/premium-subscribed", {
      method: "POST",
      body: JSON.stringify({ userEmail: customerEmail }),
    });

    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-background text-foreground px-4 py-12 font-sans antialiased">
        <Card className="max-w-md w-full border-muted rounded-2xl shadow-2xl relative overflow-hidden bg-card">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-linear-to-r from-emerald-500 via-teal-500 to-primary" />

          <CardHeader className="text-center pt-8 pb-4 px-6 space-y-3">
            <div className="mx-auto bg-emerald-500/10 text-emerald-500 p-3 w-max rounded-full shadow-inner">
              <CheckCircle2 className="h-8 w-8 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <CardTitle className="text-xl font-extrabold tracking-tight text-foreground flex items-center justify-center gap-1.5">
                Payment Successful
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Your Lifetime Premium membership is now completely activated.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-8 space-y-6 text-center">
            {/* Status Details */}
            <div className="bg-muted/40 border border-muted p-4 rounded-xl text-left space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="truncate">
                  User email:{" "}
                  <strong className="font-semibold text-foreground">
                    {customerEmail}
                  </strong>
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                We appreciate your business! All the premium features and posts
                have been ulocked for you. .
              </p>
            </div>

            {/* Perks Badge Row */}
            <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground font-medium">
              <div className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>Secure Checkout</span>
              </div>
              <div className="w-1 h-1 bg-muted rounded-full" />
              <div className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Instant Upgrades Enabled</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2">
              <Button
                asChild
                className="w-full text-xs font-semibold h-10 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground shadow-lg shadow-primary/10 transition-all duration-200 group"
              >
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
