import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            user_metadata: { name },
            email_confirm: true, // Auto-confirm email so user can login immediately
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, userId: data.user?.id });
    } catch (err) {
        console.error("Register error:", err);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
