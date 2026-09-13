import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import crypto from "crypto";

/**
 * EchoSoul / Solenne — Secure Isolated Guest Session Provisioner
 *
 * Creates a real, unique, isolated guest session:
 * 1. Unique email: guest_<uuid>@guest.solenne.internal
 * 2. High-entropy random password
 * 3. Pre-confirmed email (zero emails dispatched, immune to rate limits)
 * 4. Distinct UUID in Supabase Auth (auth.uid() is unique per guest)
 * 5. Automatic profiles row initialization
 * 6. Automatic entitlements row initialization (3 trial uses)
 */
export async function POST() {
  try {
    const serviceClient = createServiceClient();
    const guestUuid = crypto.randomUUID().replace(/-/g, "");
    const guestEmail = `guest_${guestUuid}@guest.solenne.internal`;
    const guestPassword = `Gst_${crypto.randomBytes(16).toString("hex")}!2026`;

    // 1. Create unique guest user in Supabase Auth
    const { data: userData, error: createError } = await serviceClient.auth.admin.createUser({
      email: guestEmail,
      password: guestPassword,
      email_confirm: true,
      user_metadata: {
        is_guest: true,
        display_name: "Guest Explorer",
        role: "Guest Explorer",
        created_at: new Date().toISOString(),
      },
    });

    if (createError || !userData?.user) {
      console.error("[GuestAuth] Failed to provision guest auth user:", createError);
      return NextResponse.json(
        { error: "Failed to initialize guest identity", detail: createError?.message },
        { status: 500 }
      );
    }

    const userId = userData.user.id;

    // 2. Initialize profiles row for guest
    try {
      await serviceClient.from("profiles").upsert(
        {
          id: userId,
          display_name: "Guest Explorer",
          full_name: "Guest Explorer",
          role: "Guest Explorer",
          onboarding_completed: true,
          onboarding_step: 1,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );
    } catch (profileErr) {
      console.warn("[GuestAuth] Profile initialization notice:", profileErr);
    }

    // 3. Initialize entitlements row for guest (3 free music meaning trials)
    try {
      await serviceClient.from("entitlements").upsert(
        {
          user_id: userId,
          plan: "free",
          usage: {
            music_meaning_free_uses_total: 3,
            music_meaning_free_uses_used: 0,
            waitlist_requested: false,
            unlocked_tracks: [],
          },
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    } catch (entErr) {
      console.warn("[GuestAuth] Entitlements initialization notice:", entErr);
    }

    return NextResponse.json({
      success: true,
      userId,
      email: guestEmail,
      password: guestPassword,
    });
  } catch (err) {
    console.error("[GuestAuth] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal guest session failure" },
      { status: 500 }
    );
  }
}
