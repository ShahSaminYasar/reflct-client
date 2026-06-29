"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/authClient";
import { saveToken } from "@/lib/token";
import { toast } from "sonner";

function Callback() {
  const router = useRouter();

  useEffect(() => {
    const finish = async () => {
      console.log("Callback page mounted");
      await authClient.getSession({
        fetchOptions: {
          onSuccess: (ctx) => {
            const token = ctx.response.headers.get("set-auth-jwt");
            console.log("JWT token received:", !!token);
            console.log("Session data:", ctx.data);
            if (token) {
              saveToken(token);
              toast.success("Logged in successfully!");
              router.replace("/");
            } else {
              toast.error("No JWT received");
              router.replace("/login");
            }
          },
          onError: (ctx) => {
            console.error("getSession error:", ctx.error);
            toast.error("Sign in failed");
            router.replace("/login");
          },
        },
      });
    };
    finish();
  }, []);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-muted-foreground">Finishing sign in…</p>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <p>Loading…</p>
        </div>
      }
    >
      <Callback />
    </Suspense>
  );
}
