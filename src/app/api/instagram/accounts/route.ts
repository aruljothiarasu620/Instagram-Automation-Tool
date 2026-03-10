import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { data, error } = await supabase
            .from("instagram_accounts")
            .select("ig_user_id, ig_username, created_at")
            .order("created_at", { ascending: false });

        if (error) {
            // Table might not exist yet - return empty
            return NextResponse.json({ accounts: [] });
        }

        return NextResponse.json({ accounts: data || [] });
    } catch {
        return NextResponse.json({ accounts: [] });
    }
}
