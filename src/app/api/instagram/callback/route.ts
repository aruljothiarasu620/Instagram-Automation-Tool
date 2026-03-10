import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    const dashboardUrl = `${new URL(req.url).origin}/dashboard/connect`;

    if (error || !code) {
        return NextResponse.redirect(`${dashboardUrl}?result=error`);
    }

    try {
        // Exchange code for access token
        const tokenRes = await fetch(
            `https://graph.facebook.com/v18.0/oauth/access_token?` +
            new URLSearchParams({
                client_id: process.env.FACEBOOK_CLIENT_ID!,
                client_secret: process.env.FACEBOOK_CLIENT_SECRET!,
                redirect_uri: `${new URL(req.url).origin}/api/instagram/callback`,
                code,
            })
        );
        const tokenData = await tokenRes.json();

        if (!tokenData.access_token) {
            return NextResponse.redirect(`${dashboardUrl}?result=error`);
        }

        const accessToken = tokenData.access_token;

        // Get user's Facebook Pages
        const pagesRes = await fetch(
            `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}&fields=id,name,access_token,instagram_business_account`
        );
        const pagesData = await pagesRes.json();

        if (!pagesData.data?.length) {
            return NextResponse.redirect(`${dashboardUrl}?result=error&reason=no_pages`);
        }

        let savedCount = 0;

        for (const page of pagesData.data) {
            if (!page.instagram_business_account?.id) continue;

            const igId = page.instagram_business_account.id;

            // Get Instagram username
            const igRes = await fetch(
                `https://graph.facebook.com/v18.0/${igId}?fields=username&access_token=${page.access_token}`
            );
            const igData = await igRes.json();

            // Save to Supabase (will fail gracefully if table doesn't exist)
            try {
                await supabase.from("instagram_accounts").upsert({
                    ig_user_id: igId,
                    ig_username: igData.username || "unknown",
                    access_token: page.access_token,
                }, { onConflict: "ig_user_id" });
                savedCount++;
            } catch {
                // Table doesn't exist yet - that's okay
            }
        }

        return NextResponse.redirect(`${dashboardUrl}?result=success&connected=${savedCount}`);
    } catch (err) {
        console.error("Instagram callback error:", err);
        return NextResponse.redirect(`${dashboardUrl}?result=error`);
    }
}
