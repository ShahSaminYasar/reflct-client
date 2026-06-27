import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { getToken } from "./token";

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
      token: () => getToken(),
    },
  },
});

export const { useSession, signIn, signOut, signUp } = authClient;
