"use client";

import { GoogleLogoIcon } from "@phosphor-icons/react";
import { Button } from "./ui/button";
import { authClient, signIn } from "@/lib/authClient";
import { saveToken } from "@/lib/token";
import { toast } from "sonner";

const GoogleAuthButton = () => {
  const handleGoogleSignIn = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: "/auth/callback",
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
