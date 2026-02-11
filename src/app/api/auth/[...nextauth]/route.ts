import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Dashboard Access",
            credentials: {
                password: { label: "Security Code", type: "password" },
            },
            async authorize(credentials) {
                // Simple password protection as requested
                const masterPassword = process.env.DASHBOARD_PASSWORD || "admin123";

                if (credentials?.password === masterPassword) {
                    return { id: "1", name: "Administrator" };
                }
                return null;
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
