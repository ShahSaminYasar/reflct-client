import { GoogleLogoIcon } from "@phosphor-icons/react";
import { Button } from "./ui/button";

const GoogleAuthButton = () => {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full flex items-center gap-2"
    >
      <GoogleLogoIcon weight="bold" size={32} />
      Continue with Google
    </Button>
  );
};
export default GoogleAuthButton;
