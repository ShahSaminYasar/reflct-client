"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import { signUp } from "@/lib/authClient";
import { saveToken } from "@/lib/token";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 6) errors.push("at least 6 characters");
    if (!/[A-Z]/.test(password)) errors.push("an uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("a lowercase letter");
    return errors;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadToImgbb = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
      { method: "POST", body: formData },
    );
    const data = await res.json();
    if (!data.success) throw new Error("Image upload failed");
    return data.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      toast.error(`Password must contain: ${passwordErrors.join(", ")}`);
      setLoading(false);
      return;
    }

    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadToImgbb(imageFile);
      }

      await signUp.email({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        image: imageUrl || "",
        fetchOptions: {
          onSuccess: (ctx) => {
            const token = ctx.response.headers.get("set-auth-token");
            if (token) saveToken(token);
            toast.success("Account created successfully!");
            router.push("/");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Registration failed");
          },
        },
      });
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Join our community of lifelong learners
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Profile Photo (Optional)</Label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={120}
                    height={120}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                  />
                )}
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
              <p className="text-xs text-muted-foreground">
                Must contain uppercase, lowercase, and be at least 6 characters
              </p>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              size="lg"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="my-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          <GoogleAuthButton />

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
