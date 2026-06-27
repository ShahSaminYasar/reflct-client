"use client";

import { GoogleLogoIcon } from "@phosphor-icons/react";
import { Button } from "./ui/button";
import { signIn } from "@/lib/authClient";
import { saveToken } from "@/lib/token";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const GoogleAuthButton = () => {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: "/",
      fetchOptions: {
        onSuccess: (ctx) => {
          const token = ctx.response.headers.get("set-auth-token");
          if (token) saveToken(token);
          toast.success("Logged in successfully!");
          router.push("/");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Google sign in failed");
        },
      },
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full flex items-center gap-2"
      onClick={handleGoogleSignIn}
    >
      <GoogleLogoIcon weight="bold" size={20} />
      Continue with Google
    </Button>
  );
};

export default GoogleAuthButton;
