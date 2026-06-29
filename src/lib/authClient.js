import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins";
import { getToken } from "./token";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [
    inferAdditionalFields({
      user: {
        isPremium: { type: "boolean" },
        role: { type: "string" },
      },
    }),
    jwtClient(),
  ],
  fetchOptions: {
    auth: { type: "Bearer", token: () => getToken() },
  },
});

export const { useSession, signIn, signOut, signUp } = authClient;
