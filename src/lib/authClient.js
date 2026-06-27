import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  plugins: [
    inferAdditionalFields({
      user: {
        isPremium: { type: "boolean" },
        role: { type: "string" },
      },
    }),
  ],
  fetchOptions: {
    auth: {
      type: "Bearer",
      token: () => {
        if (typeof window === "undefined") return "";
        return localStorage.getItem("bearer_token") || "";
      },
    },
  },
});

export const { useSession, signIn, signOut, signUp } = authClient;
