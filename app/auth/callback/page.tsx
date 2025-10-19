// app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const next = searchParams.get("next") || "/dashboard";

    useEffect(() => {
        const supabase = createClient();

        // Restore session from cookie
        supabase.auth.getSession().then(({ data }) => {
            if (data.session) {
                router.replace(next);
            } else {
                router.replace("/sign-in"); // or show an error
            }
        });
    }, [next]);

    return <p>Redirecting...</p>;
}