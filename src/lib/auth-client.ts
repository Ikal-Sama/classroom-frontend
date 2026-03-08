import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_BACKEND_BASE_URL.replace(/\/api\/$/, ''), // Remove trailing /api/ if present
})

export const { signIn, signUp, useSession, signOut } = authClient;
