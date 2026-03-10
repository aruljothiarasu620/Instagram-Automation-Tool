import NextAuth, { AuthOptions } from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import { supabaseAdmin } from "@/lib/supabase";

export const authOptions: AuthOptions = {
    providers: [
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID || "",
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
            authorization: {
                params: {
                    // Requesting necessary scopes for Instagram Automation
                    scope: "email,public_profile,instagram_basic,instagram_manage_comments,instagram_manage_insights,pages_show_list,pages_read_engagement",
                },
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "facebook") {
                try {
                    // Check if user already exists in our Supabase database
                    const { data: existingUser, error: checkError } = await supabaseAdmin
                        .from("users")
                        .select("id")
                        .eq("facebook_user_id", user.id)
                        .single();

                    if (!existingUser) {
                        // Create new user if they don't exist
                        const { error: insertError } = await supabaseAdmin.from("users").insert({
                            facebook_user_id: user.id,
                            email: user.email,
                            name: user.name,
                        });
                        if (insertError) {
                            console.error("Error creating user in Supabase:", insertError);
                            return false;
                        }
                    }
                    // The user logs in successfully, you can also store long-lived tokens here if needed
                    return true;
                } catch (error) {
                    console.error("Error on sign-in:", error);
                    return false; // Reject sign in on error
                }
            }
            return true;
        },
        async session({ session, token }) {
            // Attach the provider's user ID to the session object
            if (session.user) {
                (session.user as any).id = token.sub;
                (session as any).accessToken = token.accessToken; // Passing the token for API usage if necessary
            }
            return session;
        },
        async jwt({ token, user, account }) {
            // On initial sign in, attach the access token to the JWT token
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        }
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
