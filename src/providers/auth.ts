import { AuthProvider } from "@refinedev/core";
import { authClient } from "@/lib/auth-client";

export const authProvider: AuthProvider = {
    login: async ({ email, password }) => {
        const { data, error } = await authClient.signIn.email({
            email,
            password,
        });

        if (error) {
            return {
                success: false,
                error: {
                    name: "Login Error",
                    message: error.message || "Invalid email or password",
                },
            };
        }

        return {
            success: true,
            redirectTo: "/",
        };
    },
    logout: async () => {
        await authClient.signOut();
        return {
            success: true,
            redirectTo: "/login",
        };
    },
    onError: async (error) => {
        if (error.status === 401 || error.status === 403) {
            return {
                logout: true,
                redirectTo: "/login",
            };
        }

        return { error };
    },
    check: async () => {
        const { data: session } = await authClient.getSession();

        if (session) {
            return {
                authenticated: true,
            };
        }

        return {
            authenticated: false,
            redirectTo: "/login",
            error: {
                message: "Check failed",
                name: "Unauthenticated",
            },
        };
    },
    getPermissions: async () => {
        const { data: session } = await authClient.getSession();
        if (session?.user) {
            return (session.user as any).role;
        }
        return null;
    },
    getIdentity: async () => {
        const { data: session } = await authClient.getSession();
        if (session?.user) {
            return {
                ...session.user,
                fullName: session.user.name,
                avatar: session.user.image,
            };
        }
        return null;
    },
};
