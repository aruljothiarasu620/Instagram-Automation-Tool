import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const accessToken = (session as any).accessToken;

    if (!accessToken) {
        return NextResponse.json({ 
            error: "no_token",
            message: "No Facebook access token found. Please log out and log back in with Facebook."
        }, { status: 400 });
    }

    try {
        // Fetch Facebook Pages using the existing login token
        const pagesRes = await fetch(
            `https://graph.facebook.com/v18.0/me/accounts?` +
            new URLSearchParams({
                access_token: accessToken,
                fields: "id,name,access_token,instagram_business_account",
            })
        );
        const pagesData = await pagesRes.json();

        if (pagesData.error) {
            return NextResponse.json({ 
                error: "fb_error", 
                message: pagesData.error.message 
            }, { status: 400 });
        }

        const pages = pagesData.data || [];
        const instagramAccounts = [];

        for (const page of pages) {
            if (!page.instagram_business_account?.id) continue;

            const igId = page.instagram_business_account.id;

            // Get Instagram username
            const igRes = await fetch(
                `https://graph.facebook.com/v18.0/${igId}?` +
                new URLSearchParams({
                    fields: "username,name,followers_count,profile_picture_url",
                    access_token: page.access_token,
                })
            );
            const igData = await igRes.json();

            instagramAccounts.push({
                ig_user_id: igId,
                ig_username: igData.username || "unknown",
                name: igData.name,
                followers: igData.followers_count,
                page_name: page.name,
                access_token: page.access_token,
            });
        }

        return NextResponse.json({ 
            pages: pages.length,
            accounts: instagramAccounts 
        });

    } catch (err) {
        console.error("Instagram fetch error:", err);
        return NextResponse.json({ error: "fetch_failed" }, { status: 500 });
    }
}
