import { createClient } from '@supabase/supabase-js'

export async function getOrInviteUser(email: string, origin: string, name?: string) {
    // SECURITY WARNING: Ensure this function only runs on the server!
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );

    // 1. Use maybeSingle() to avoid throwing an error if 0 rows are found
    const { data: profileData, error: profileErr } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();

    // 2. Catch actual database errors (timeouts, syntax issues, etc.)
    if (profileErr) {
        return { status: "error", error: `Database error: ${profileErr.message}` };
    }

    // 3. If no profile data exists, we invite the user
    if (!profileData) {
        const { data: inviteData, error: inviteErr } = await supabase.auth.admin.inviteUserByEmail(email, {
            data: {
                full_name: name
            },
            redirectTo: `${origin}/auth/callback`
        });

        if (inviteErr) {
            return { status: "error", error: `Invite error: ${inviteErr.message}` };
        }

        return { status: "success", id: inviteData.user.id };
    }

    // 4. User exists, return their ID
    return { status: "success", id: profileData.id };
}