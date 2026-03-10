import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const authOptions: AuthOptions = {
    providers: [
        // ── Email + Password Login ──
        CredentialsProvider({
            name: "Email & Password",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "you@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                // Sign in with Supabase Auth
                const { data, error } = await supabaseAdmin.auth.signInWithPassword({
                    email: credentials.email,
                    password: credentials.password,
                });

                if (error || !data.user) return null;

                return {
                    id: data.user.id,
                    email: data.user.email,
                    name: data.user.user_metadata?.name || data.user.email,
                };
            },
        }),

        // ── Facebook OAuth Login ──
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID || "",
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
            authorization: {
                params: {
                    scope: "email,public_profile",
                },
            },
        }),
    ],

    pages: {
        signIn: "/login",
    },

    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "facebook") {
                // Upsert user in our users table
                try {
                    await supabaseAdmin.from("users").upsert(
                        { facebook_user_id: user.id, email: user.email, name: user.name },
                        { onConflict: "facebook_user_id" }
                    );
                } catch (e) {
                    console.error("Supabase upsert error (non-fatal):", e);
                }
            }
            return true;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.sub;
                (session as any).accessToken = token.accessToken;
            }
            return session;
        },
        async jwt({ token, user, account }) {
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
